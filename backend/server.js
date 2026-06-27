const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const https = require('https');
const { generateMainTf } = require('./terraform_templates');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CONFIG_PATH = path.join(__dirname, 'config.json');
const DB_PATH = path.join(__dirname, 'db.json');
const DEPLOYMENTS_DIR = path.join(__dirname, 'deployments');
const metricsHistory = {};

// Ensure directories and files exist
if (!fs.existsSync(DEPLOYMENTS_DIR)) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ deployments: [] }, null, 2));
}
if (!fs.existsSync(CONFIG_PATH)) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({
    pm_api_url: '',
    pm_api_token_id: '',
    pm_api_token_secret: '',
    node_name: 'pve',
    template_storage: 'local',
    default_bridge: 'vmbr0',
    excluded_storages: '',
    excluded_bridges: '',
    default_ssh_keys: '',
    default_cpu_cores: 1,
    default_memory: 1024,
    default_swap: 512,
    default_disk_size: 8,
    default_dns_server: '',
    default_dns_domain: '',
    default_unprivileged: true
  }, null, 2));
}

// Helpers for reading/writing config and db
function getConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return {
      pm_api_url: '',
      pm_api_token_id: '',
      pm_api_token_secret: '',
      node_name: 'pve',
      template_storage: 'local',
      default_bridge: 'vmbr0',
      excluded_storages: '',
      excluded_bridges: '',
      default_ssh_keys: '',
      default_cpu_cores: 1,
      default_memory: 1024,
      default_swap: 512,
      default_disk_size: 8,
      default_dns_server: '',
      default_dns_domain: '',
      default_unprivileged: true,
      ...config
    };
  } catch (e) {
    return {
      pm_api_url: '',
      pm_api_token_id: '',
      pm_api_token_secret: '',
      node_name: 'pve',
      template_storage: 'local',
      default_bridge: 'vmbr0',
      excluded_storages: '',
      excluded_bridges: '',
      default_ssh_keys: '',
      default_cpu_cores: 1,
      default_memory: 1024,
      default_swap: 512,
      default_disk_size: 8,
      default_dns_server: '',
      default_dns_domain: '',
      default_unprivileged: true
    };
  }
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return { deployments: [] };
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Helper to make HTTPS requests to Proxmox VE API
function proxmoxRequest(method, pathUrl, data = null, customConfig = null) {
  const config = customConfig || getConfig();
  if (!config.pm_api_url || !config.pm_api_token_id || !config.pm_api_token_secret) {
    return Promise.reject(new Error('Proxmox credentials not configured'));
  }

  // Parse host from pm_api_url (e.g., https://192.168.1.100:8006/api2/json)
  let urlStr = config.pm_api_url;
  if (!urlStr.startsWith('http')) {
    urlStr = 'https://' + urlStr;
  }
  let url;
  try {
    url = new URL(urlStr);
  } catch (e) {
    return Promise.reject(new Error('Invalid Proxmox API URL'));
  }

  const tokenHeader = `PVEAPIToken=${config.pm_api_token_id}=${config.pm_api_token_secret}`;

  let requestBody = null;
  let contentType = 'application/json';
  if (data) {
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      requestBody = new URLSearchParams(data).toString();
      contentType = 'application/x-www-form-urlencoded';
    } else {
      requestBody = JSON.stringify(data);
    }
  }

  const options = {
    hostname: url.hostname,
    port: url.port || 8006,
    path: pathUrl.startsWith('/api2/json') ? pathUrl : `/api2/json${pathUrl}`,
    method: method,
    headers: {
      'Authorization': tokenHeader,
      'Accept': 'application/json',
      'Content-Type': contentType,
      ...(requestBody ? { 'Content-Length': Buffer.byteLength(requestBody) } : {})
    },
    rejectUnauthorized: false // Often Proxmox uses self-signed certs
  };


  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed.data || parsed);
          } else {
            reject(new Error(parsed.errors || parsed.message || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body.substring(0, 100)}`));
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (requestBody) {
      req.write(requestBody);
    }
    req.end();
  });

}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// 1. Config API
app.get('/api/config', (req, res) => {
  const config = getConfig();
  // Strip secret key before returning
  const safeConfig = { ...config };
  if (safeConfig.pm_api_token_secret) {
    safeConfig.pm_api_token_secret = '••••••••••••';
  }
  res.json(safeConfig);
});

// 1b. Test temporary config (unsaved)
app.post('/api/proxmox/test', async (req, res) => {
  const testConfig = req.body;
  const currentConfig = getConfig();
  
  if (testConfig.pm_api_token_secret === '••••••••••••') {
    testConfig.pm_api_token_secret = currentConfig.pm_api_token_secret;
  }

  try {
    const node = testConfig.node_name || 'pve';
    const storage = testConfig.template_storage || 'local';
    
    // Call Proxmox API with the test config
    await proxmoxRequest('GET', `/nodes/${node}/storage/${storage}/content`, null, testConfig);
    res.json({ success: true, message: 'Connection to Proxmox VE successful!' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/config', (req, res) => {
  const newConfig = req.body;
  const currentConfig = getConfig();
  
  // If the secret is the masked value, retain the current one
  if (newConfig.pm_api_token_secret === '••••••••••••') {
    newConfig.pm_api_token_secret = currentConfig.pm_api_token_secret;
  }

  saveConfig(newConfig);
  res.json({ message: 'Configuration saved successfully' });
});

app.post('/api/config/clear', (req, res) => {
  const defaults = {
    pm_api_url: '',
    pm_api_token_id: '',
    pm_api_token_secret: '',
    node_name: 'pve',
    template_storage: 'local',
    default_bridge: 'vmbr0',
    excluded_storages: '',
    excluded_bridges: '',
    default_ssh_keys: '',
    default_cpu_cores: 1,
    default_memory: 1024,
    default_swap: 512,
    default_disk_size: 8,
    default_dns_server: '',
    default_dns_domain: '',
    default_unprivileged: true
  };
  saveConfig(defaults);
  res.json({ message: 'Configuration cleared successfully', config: defaults });
});

// 2b. Fetch next available VMID from Proxmox cluster
app.get('/api/proxmox/next-id', async (req, res) => {
  const db = getDb();
  try {
    // Call Proxmox API to get all cluster resources of type vm/lxc
    const resources = await proxmoxRequest('GET', '/cluster/resources?type=vm');
    
    const usedIds = resources.map(r => parseInt(r.vmid)).filter(id => !isNaN(id));
    const dbIds = db.deployments.map(d => parseInt(d.vm_id)).filter(id => !isNaN(id));
    
    const allIds = [...usedIds, ...dbIds];
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 99;
    
    res.json({ source: 'proxmox', next_id: maxId + 1 });
  } catch (error) {
    console.error('Proxmox API fetch next-id failed, parsing local DB:', error.message);
    const dbIds = db.deployments.map(d => parseInt(d.vm_id)).filter(id => !isNaN(id));
    const maxId = dbIds.length > 0 ? Math.max(...dbIds) : 99;
    res.json({ source: 'mock', next_id: maxId + 1, error: error.message });
  }
});

// 2. Fetch templates from Proxmox
app.get('/api/proxmox/templates', async (req, res) => {
  const config = getConfig();
  try {
    const node = config.node_name || 'pve';
    const storage = config.template_storage || 'local';
    
    // Call Proxmox API: /nodes/{node}/storage/{storage}/content
    const content = await proxmoxRequest('GET', `/nodes/${node}/storage/${storage}/content`);
    
    // Filter templates (vztmpl)
    const templates = content
      .filter(item => item.content === 'vztmpl' || item.volid.includes('vztmpl/'))
      .map(item => ({
        volid: item.volid,
        size: item.size,
        format: item.format
      }));
    
    res.json({ source: 'proxmox', templates });
  } catch (error) {
    console.error('Proxmox API fetch templates failed, using mock data:', error.message);
    // Mock fallbacks for offline development/testing
    const mockTemplates = [
      { volid: 'local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst', size: 120000000 },
      { volid: 'local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst', size: 110000000 },
      { volid: 'local:vztmpl/alpine-3.19-default_20231218_amd64.tar.xz', size: 5000000 },
      { volid: 'local:vztmpl/rockylinux-9-default_20221109_amd64.tar.xz', size: 150000000 }
    ];
    res.json({ source: 'mock', templates: mockTemplates, error: error.message });
  }
});

// 2a. Delete template from Proxmox
app.delete('/api/proxmox/templates', async (req, res) => {
  const { volid } = req.body;
  if (!volid) {
    return res.status(400).json({ error: 'Volume ID is required' });
  }
  const config = getConfig();
  const node = config.node_name || 'pve';
  try {
    const parts = volid.split(':');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid Volume ID' });
    }
    const storage = parts[0];
    const volume = parts.slice(1).join(':');
    
    // DELETE /nodes/{node}/storage/{storage}/content/{volume}
    const encodedVolume = encodeURIComponent(volume);
    await proxmoxRequest('DELETE', `/nodes/${node}/storage/${storage}/content/${encodedVolume}`);
    
    res.json({ success: true, message: `Template '${volume}' deleted successfully.` });
  } catch (err) {
    console.error('Failed to delete template:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 3. Fetch list of storage pools
app.get('/api/proxmox/storages', async (req, res) => {
  const config = getConfig();
  const showAll = req.query.all === 'true';
  const excluded = showAll ? [] : (config.excluded_storages || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  try {
    const node = config.node_name || 'pve';
    const content = await proxmoxRequest('GET', `/nodes/${node}/storage`);
    
    // Filter storages that support rootdir/images and are not excluded
    const storages = content
      .filter(s => s.content.includes('rootdir') || s.content.includes('images'))
      .filter(s => !excluded.includes(s.storage.toLowerCase()))
      .map(s => ({
        name: s.storage,
        type: s.type,
        shared: s.shared
      }));
    res.json({ source: 'proxmox', storages });
  } catch (error) {
    console.error('Proxmox API fetch storages failed, using mock data:', error.message);
    const mockStorages = [
      { name: 'local-lvm', type: 'lvmthin', shared: 0 },
      { name: 'local', type: 'dir', shared: 0 },
      { name: 'ceph-storage', type: 'rbd', shared: 1 }
    ].filter(s => !excluded.includes(s.name.toLowerCase()));
    res.json({ source: 'mock', storages: mockStorages, error: error.message });
  }
});

// Fetch list of network bridges
app.get('/api/proxmox/bridges', async (req, res) => {
  const config = getConfig();
  const showAll = req.query.all === 'true';
  const excluded = showAll ? [] : (config.excluded_bridges || '')
    .split(',')
    .map(b => b.trim().toLowerCase())
    .filter(Boolean);
  try {
    const node = config.node_name || 'pve';
    const networks = await proxmoxRequest('GET', `/nodes/${node}/network`);
    
    // Filter interfaces of type 'bridge' and not excluded
    const bridges = networks
      .filter(n => n.type === 'bridge' || n.type === 'OVSBridge')
      .filter(n => !excluded.includes(n.iface.toLowerCase()))
      .map(n => ({
        name: n.iface,
        active: n.active,
        comment: n.comments || ''
      }));
    res.json({ source: 'proxmox', bridges });
  } catch (error) {
    console.error('Proxmox API fetch bridges failed, using mock data:', error.message);
    const mockBridges = [
      { name: 'vmbr0', active: 1, comment: 'Default LAN Bridge' },
      { name: 'vmbr1', active: 1, comment: 'IoT VLAN Bridge' }
    ].filter(b => !excluded.includes(b.name.toLowerCase()));
    res.json({ source: 'mock', bridges: mockBridges, error: error.message });
  }
});

// 4. List Deployments
app.get('/api/deployments', async (req, res) => {
  const db = getDb();
  const config = getConfig();
  
  // Try to enrich deployments with real-time status from Proxmox
  const enriched = await Promise.all(db.deployments.map(async (dep) => {
    if (dep.status === 'active' && config.pm_api_url) {
      try {
        const node = dep.target_node || config.node_name || 'pve';
        const status = await proxmoxRequest('GET', `/nodes/${node}/lxc/${dep.vm_id}/status/current`);
        
        // Push metrics history
        if (!metricsHistory[dep.id]) {
          metricsHistory[dep.id] = [];
        }
        metricsHistory[dep.id].push({
          cpu: parseFloat((status.cpu * 100).toFixed(1)) || 0,
          mem: Math.round(status.mem / (1024 * 1024)) || 0,
          timestamp: Date.now()
        });
        
        if (metricsHistory[dep.id].length > 15) {
          metricsHistory[dep.id].shift();
        }

        return {
          ...dep,
          proxmox_status: {
            status: status.status, // running, stopped
            uptime: status.uptime,
            cpu: status.cpu,
            mem: status.mem,
            maxmem: status.maxmem
          },
          history: metricsHistory[dep.id]
        };
      } catch (err) {
        return { 
          ...dep, 
          proxmox_status: { status: 'offline', error: err.message },
          history: metricsHistory[dep.id] || []
        };
      }
    }
    return {
      ...dep,
      history: metricsHistory[dep.id] || []
    };
  }));

  res.json(enriched);
});

// 5. Get Deployment Logs
app.get('/api/deployments/:id/log', (req, res) => {
  const depId = req.params.id;
  const logPath = path.join(DEPLOYMENTS_DIR, depId, 'terraform.log');
  if (fs.existsSync(logPath)) {
    const content = fs.readFileSync(logPath, 'utf8');
    res.json({ log: content });
  } else {
    res.status(404).json({ error: 'Log file not found' });
  }
});

// Helper function to run Terraform command asynchronously
function runTerraform(depId, command, args, envVars = {}) {
  const depDir = path.join(DEPLOYMENTS_DIR, depId);
  const logFile = path.join(depDir, 'terraform.log');
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  logStream.write(`\n\n--- Running terraform ${args.join(' ')} at ${new Date().toISOString()} ---\n`);

  const processEnv = { 
    ...process.env, 
    ...envVars,
    TF_CLI_ARGS: '-no-color'
  };
  const child = spawn(command, args, { cwd: depDir, env: processEnv, shell: true });

  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  return new Promise((resolve) => {
    child.on('close', (code) => {
      logStream.write(`\n--- Finished with exit code: ${code} ---\n`);
      logStream.end();
      resolve(code);
    });
  });
}

// 6. Deploy Container
app.post('/api/deployments', async (req, res) => {
  const config = getConfig();
  const deployConfig = req.body; // includes vm_id, hostname, password, ssh_keys, template_file_id, cpu_cores, memory, swap, disk_storage, disk_size, extra_disks, network, predefined_app, custom_script

  if (!deployConfig.vm_id || !deployConfig.hostname || !deployConfig.template_file_id) {
    return res.status(400).json({ error: 'Missing required parameters (vm_id, hostname, template_file_id)' });
  }

  const depId = `lxc-${deployConfig.vm_id}-${Date.now()}`;
  const depDir = path.join(DEPLOYMENTS_DIR, depId);
  fs.mkdirSync(depDir, { recursive: true });

  // Provisioning Check
  let provision_key_pub = null;
  const apps = Array.isArray(deployConfig.predefined_apps) ? deployConfig.predefined_apps : [];
  const wantsApp = apps.length > 0;
  const wantsCustom = deployConfig.custom_script && deployConfig.custom_script.trim();

  if (wantsApp || wantsCustom) {
    try {
      const { execSync } = require('child_process');
      execSync(`ssh-keygen -t rsa -b 2048 -N "" -f "${path.join(depDir, 'id_rsa')}"`);
      const pubKeyPath = path.join(depDir, 'id_rsa.pub');
      if (fs.existsSync(pubKeyPath)) {
        provision_key_pub = fs.readFileSync(pubKeyPath, 'utf8').trim();
      }

      // Compile provision.sh script
      let provisionScript = `#!/bin/bash
# Gantry Auto-generated Provisioning Script
echo "=== Gantry: Starting Container Provisioning ==="
`;

      if (apps.includes('docker')) {
        provisionScript += `
echo "=== Gantry: Installing Docker ==="
if [ -f /usr/bin/apt-get ]; then
  apt-get update && apt-get install -y curl
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
elif [ -f /sbin/apk ]; then
  apk update && apk add docker
  rc-update add docker default
  service docker start
elif [ -f /usr/bin/pacman ]; then
  pacman -Sy --noconfirm docker
  systemctl enable --now docker
else
  yum install -y docker || dnf install -y docker
  systemctl enable --now docker
fi
`;
      }

      if (apps.includes('docker-compose')) {
        provisionScript += `
echo "=== Gantry: Installing Docker Compose ==="
if [ -f /usr/bin/apt-get ]; then
  apt-get update && apt-get install -y docker-compose-plugin
elif [ -f /sbin/apk ]; then
  apk update && apk add docker-compose
elif [ -f /usr/bin/pacman ]; then
  pacman -Sy --noconfirm docker-compose
else
  dnf install -y docker-compose || yum install -y docker-compose
fi
`;
      }

      if (apps.includes('podman')) {
        provisionScript += `
echo "=== Gantry: Installing Podman ==="
if [ -f /usr/bin/apt-get ]; then
  apt-get update && apt-get install -y podman
elif [ -f /sbin/apk ]; then
  apk update && apk add podman
elif [ -f /usr/bin/pacman ]; then
  pacman -Sy --noconfirm podman
else
  yum install -y podman || dnf install -y podman
fi
`;
      }

      if (apps.includes('podman-compose')) {
        provisionScript += `
echo "=== Gantry: Installing Podman Compose ==="
if [ -f /usr/bin/apt-get ]; then
  apt-get update && apt-get install -y podman-compose
elif [ -f /sbin/apk ]; then
  apk update && apk add podman-compose
elif [ -f /usr/bin/pacman ]; then
  pacman -Sy --noconfirm podman-compose
else
  dnf install -y podman-compose || yum install -y podman-compose
fi
`;
      }

      if (apps.includes('tailscale')) {
        provisionScript += `
echo "=== Gantry: Installing Tailscale ==="
curl -fsSL https://tailscale.com/install.sh | sh
`;
      }

      if (apps.includes('nginx')) {
        provisionScript += `
echo "=== Gantry: Installing Nginx ==="
if [ -f /usr/bin/apt-get ]; then
  apt-get update && apt-get install -y nginx
  systemctl enable --now nginx
elif [ -f /sbin/apk ]; then
  apk update && apk add nginx
  rc-update add nginx default && service nginx start
elif [ -f /usr/bin/pacman ]; then
  pacman -Sy --noconfirm nginx
  systemctl enable --now nginx
else
  dnf install -y nginx || yum install -y nginx
  systemctl enable --now nginx
fi
`;
      }

      if (wantsCustom) {
        provisionScript += `
echo "=== Gantry: Running Custom User Provisioning Script ==="
${deployConfig.custom_script}
`;
      }

      provisionScript += `\necho "=== Gantry: Provisioning Finished ==="\n`;
      fs.writeFileSync(path.join(depDir, 'provision.sh'), provisionScript);
    } catch (err) {
      console.error('Failed to prepare provisioning keys/script:', err.message);
    }
  }

  // Add Proxmox URLs to config for Terraform main.tf generation
  const targetNode = deployConfig.target_node || config.node_name || 'pve';
  const fullConfig = {
    ...deployConfig,
    pm_api_url: config.pm_api_url,
    node_name: targetNode,
    provision_key_pub
  };

  const mainTfContent = generateMainTf(fullConfig);
  fs.writeFileSync(path.join(depDir, 'main.tf'), mainTfContent);

  // Initialize DB entry
  const db = getDb();
  const newDeployment = {
    id: depId,
    vm_id: deployConfig.vm_id,
    hostname: deployConfig.hostname,
    template: deployConfig.template_file_id,
    cpu_cores: deployConfig.cpu_cores,
    memory: deployConfig.memory,
    disk_storage: deployConfig.disk_storage,
    disk_size: deployConfig.disk_size,
    target_node: targetNode,
    status: 'deploying',
    created_at: new Date().toISOString()
  };
  db.deployments.push(newDeployment);
  saveDb(db);

  res.json({ message: 'Deployment started', deployment: newDeployment });

  // Async Terraform apply execution
  (async () => {
    const envVars = {
      TF_VAR_pm_api_token: `${config.pm_api_token_id}=${config.pm_api_token_secret}`
    };

    const initCode = await runTerraform(depId, 'terraform', ['init'], envVars);
    if (initCode !== 0) {
      updateDeploymentStatus(depId, 'failed');
      return;
    }

    const applyCode = await runTerraform(depId, 'terraform', ['apply', '-auto-approve'], envVars);
    if (applyCode === 0) {
      updateDeploymentStatus(depId, 'active');
    } else {
      // If Terraform exited with code 1, check if the container actually exists in Proxmox
      // (Handles cases where Proxmox reports WARNINGS: 1 which Terraform treats as a failure)
      try {
        const node = config.node_name || 'pve';
        await proxmoxRequest('GET', `/nodes/${node}/lxc/${deployConfig.vm_id}/status/current`);
        console.log(`LXC container ${deployConfig.vm_id} exists on Proxmox. Marking deployment as active despite warnings.`);
        updateDeploymentStatus(depId, 'active');
      } catch (err) {
        console.error(`LXC container verification failed for VMID ${deployConfig.vm_id}:`, err.message);
        updateDeploymentStatus(depId, 'failed');
      }
    }
  })();
});

// Helper to update DB status
function updateDeploymentStatus(id, status) {
  const db = getDb();
  const idx = db.deployments.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.deployments[idx].status = status;
    saveDb(db);
  }
}

// 7. Destroy Container
app.post('/api/deployments/:id/destroy', async (req, res) => {
  const depId = req.params.id;
  const db = getDb();
  const dep = db.deployments.find(d => d.id === depId);
  const config = getConfig();

  if (!dep) {
    return res.status(404).json({ error: 'Deployment not found' });
  }

  updateDeploymentStatus(depId, 'destroying');
  res.json({ message: 'Destroy process initiated' });

  // Async Terraform destroy execution
  (async () => {
    const envVars = {
      TF_VAR_pm_api_token: `${config.pm_api_token_id}=${config.pm_api_token_secret}`
    };
    const destroyCode = await runTerraform(depId, 'terraform', ['destroy', '-auto-approve'], envVars);
    if (destroyCode === 0) {
      updateDeploymentStatus(depId, 'destroyed');
    } else {
      updateDeploymentStatus(depId, 'failed'); // or retain destroying with failure log
    }
  })();
});

// 8. Archive Deployment
app.post('/api/deployments/:id/archive', (req, res) => {
  const depId = req.params.id;
  const db = getDb();
  const idx = db.deployments.findIndex(d => d.id === depId);
  if (idx !== -1) {
    db.deployments[idx].archived = true;
    saveDb(db);
    res.json({ success: true, message: 'Deployment archived successfully' });
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// 9. Unarchive Deployment
app.post('/api/deployments/:id/unarchive', (req, res) => {
  const depId = req.params.id;
  const db = getDb();
  const idx = db.deployments.findIndex(d => d.id === depId);
  if (idx !== -1) {
    db.deployments[idx].archived = false;
    saveDb(db);
    res.json({ success: true, message: 'Deployment restored from archive' });
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// 10. Fetch Proxmox Cluster Nodes
app.get('/api/proxmox/nodes', async (req, res) => {
  try {
    const nodes = await proxmoxRequest('GET', '/nodes');
    res.json({ source: 'proxmox', nodes: nodes.map(n => ({ name: n.node, status: n.status, cpu: n.cpu, mem: n.mem, maxmem: n.maxmem })) });
  } catch (err) {
    console.error('Proxmox nodes fetch failed:', err.message);
    res.json({ source: 'mock', nodes: [{ name: 'pve', status: 'online', cpu: 0.12, mem: 4096000000, maxmem: 16000000000 }] });
  }
});

// 11. LXC Power Status Actions
app.post('/api/proxmox/lxc/:node/:vmid/status/:action', async (req, res) => {
  const { node, vmid, action } = req.params;
  if (!['start', 'shutdown', 'stop', 'reboot'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Supported: start, shutdown, stop, reboot' });
  }
  try {
    await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/${action}`);
    res.json({ success: true, message: `Container ${vmid} status change to '${action}' submitted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. List Downloadable Templates
app.get('/api/proxmox/aplinfo/:node', async (req, res) => {
  const { node } = req.params;
  try {
    const list = await proxmoxRequest('GET', `/nodes/${node}/aplinfo`);
    res.json({ source: 'proxmox', templates: list.filter(item => item.type === 'vztmpl' || item.type === 'lxc' || item.template) });
  } catch (err) {
    res.json({
      source: 'mock',
      templates: [
        { template: 'ubuntu-22.04-standard_22.04-1_amd64.tar.zst', package: 'system/ubuntu-22.04', headline: 'Ubuntu 22.04 Jammy Jellyfish (Standard)', version: '22.04-1', section: 'system' },
        { template: 'alpine-3.19-default_20231218_amd64.tar.xz', package: 'system/alpine-3.19', headline: 'Alpine Linux 3.19 (Default)', version: '3.19', section: 'system' },
        { template: 'debian-12-standard_12.2-1_amd64.tar.zst', package: 'system/debian-12', headline: 'Debian 12 Bookworm (Standard)', version: '12.2-1', section: 'system' }
      ]
    });
  }
});

// 13. Download Template Task
app.post('/api/proxmox/apldownload/:node', async (req, res) => {
  const { node } = req.params;
  const { template, storage } = req.body;
  try {
    const upid = await proxmoxRequest('POST', `/nodes/${node}/aplinfo`, {
      template,
      storage: storage || 'local'
    });
    res.json({ success: true, message: 'Template download task started.', upid });
  } catch (err) {
    console.error('API download failed, trying local CLI fallback:', err?.message || err);
    try {
      const { exec } = require('child_process');
      const targetStorage = storage || 'local';
      const cmd = `pveam download ${targetStorage} ${template}`;
      exec(cmd, (execErr, stdout, stderr) => {
        if (execErr) {
          console.error(`pveam download fallback failed: ${execErr.message}`);
        } else {
          console.log(`pveam download fallback completed: ${stdout}`);
        }
      });
      res.json({ success: true, message: 'Template download started via CLI fallback in the background.' });
    } catch (fallbackErr) {
      res.status(500).json({ success: false, error: `${err?.message || err || 'Unknown error'} (CLI fallback failed: ${fallbackErr?.message || fallbackErr || 'Unknown error'})` });
    }
  }
});


// 14. List LXC Container Snapshots
app.get('/api/proxmox/lxc/:node/:vmid/snapshots', async (req, res) => {
  const { node, vmid } = req.params;
  try {
    const list = await proxmoxRequest('GET', `/nodes/${node}/lxc/${vmid}/snapshot`);
    res.json({ source: 'proxmox', snapshots: list });
  } catch (err) {
    res.json({
      source: 'mock',
      snapshots: [
        { name: 'current', comment: 'You are here', parent: 'clean-install' },
        { name: 'clean-install', comment: 'Base system setup completed', parent: '', snaptime: Math.floor(Date.now()/1000) - 3600 }
      ]
    });
  }
});

// 15. Create Container Snapshot
app.post('/api/proxmox/lxc/:node/:vmid/snapshots', async (req, res) => {
  const { node, vmid } = req.params;
  const { snapname, description } = req.body;
  if (!snapname) return res.status(400).json({ error: 'Snapshot name is required.' });
  try {
    const upid = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/snapshot`, {
      snapname,
      comment: description || ''
    });
    res.json({ success: true, message: `Snapshot '${snapname}' creation started.`, upid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 16. Rollback Container Snapshot
app.post('/api/proxmox/lxc/:node/:vmid/snapshots/:snapname/rollback', async (req, res) => {
  const { node, vmid, snapname } = req.params;
  try {
    const upid = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/rollback`);
    res.json({ success: true, message: `Rollback to snapshot '${snapname}' started.`, upid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 17. Delete Container Snapshot
app.delete('/api/proxmox/lxc/:node/:vmid/snapshots/:snapname', async (req, res) => {
  const { node, vmid, snapname } = req.params;
  try {
    const upid = await proxmoxRequest('DELETE', `/nodes/${node}/lxc/${vmid}/snapshot/${snapname}`);
    res.json({ success: true, message: `Snapshot '${snapname}' deletion started.`, upid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
