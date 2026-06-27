/**
 * Generates the main.tf content for a Proxmox LXC using the bpg/proxmox provider.
 */
function generateMainTf(config) {
  const extraDisksHcl = (config.extra_disks || []).map((disk, idx) => {
    return `
  mount_point {
    volume = ${JSON.stringify(disk.storage)}
    size   = "${parseInt(disk.size)}G"
    path   = ${JSON.stringify(disk.mount_point || `/mnt/data${idx + 1}`)}
  }`;
  }).join('');

  let sshKeysList = config.ssh_keys && config.ssh_keys.trim()
    ? config.ssh_keys.split('\n').map(k => k.trim()).filter(Boolean)
    : [];
  if (config.provision_key_pub) {
    sshKeysList.push(config.provision_key_pub.trim());
  }
  const sshKeysJson = JSON.stringify(sshKeysList);

  const gatewayLine = config.network && config.network.gateway && config.network.ip !== 'dhcp'
    ? `gateway = ${JSON.stringify(config.network.gateway)}`
    : '';

  const vlanLine = config.network && config.network.vlan
    ? `vlan_id = ${parseInt(config.network.vlan)}`
    : '';

  const dnsBlock = config.network && (config.network.dns_server || config.network.dns_domain)
    ? `dns {
      ${config.network.dns_server ? `servers = [${JSON.stringify(config.network.dns_server)}]` : ''}
      ${config.network.dns_domain ? `domain  = ${JSON.stringify(config.network.dns_domain)}` : ''}
    }`
    : '';

  // Proxmox container operating system type matching
  // bpg/proxmox automatically detects type if template name is standard,
  // but we can pass/detect standard ones (e.g. ubuntu, debian, alpine, centos, Rocky)
  let osType = 'ubuntu';
  const templateLower = (config.template_file_id || '').toLowerCase();
  if (templateLower.includes('debian')) osType = 'debian';
  else if (templateLower.includes('alpine')) osType = 'alpine';
  else if (templateLower.includes('centos')) osType = 'centos';
  else if (templateLower.includes('rocky')) osType = 'centos';
  else if (templateLower.includes('fedora')) osType = 'fedora';
  else if (templateLower.includes('opensuse')) osType = 'opensuse';
  else if (templateLower.includes('gentoo')) osType = 'gentoo';
  else if (templateLower.includes('arch')) osType = 'archlinux';

  return `terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.84.0"
    }

  }
}

provider "proxmox" {
  endpoint = ${JSON.stringify(config.pm_api_url)}
  api_token = var.pm_api_token
  insecure  = true
}

variable "pm_api_token" {
  type      = string
  sensitive = true
}

resource "proxmox_virtual_environment_container" "lxc_container" {
  node_name = ${JSON.stringify(config.node_name)}
  vm_id     = ${parseInt(config.vm_id)}

  unprivileged = true

  features {
    nesting = true
  }

  ${config.provision_key_pub ? `
  wait_for_ip {
    ipv4 = true
  }
  ` : ''}

  initialization {
    hostname = ${JSON.stringify(config.hostname)}

    ip_config {
      ipv4 {
        address = ${JSON.stringify(config.network.ip === 'dhcp' ? 'dhcp' : config.network.ip)}
        ${gatewayLine}
      }
    }

    ${dnsBlock}

    user_account {
      password = ${JSON.stringify(config.password)}
      keys     = ${sshKeysJson}
    }
  }

  cpu {
    cores = ${parseInt(config.cpu_cores)}
  }

  memory {
    dedicated = ${parseInt(config.memory)}
    swap      = ${parseInt(config.swap || 512)}
  }

  // Root Disk
  disk {
    datastore_id = ${JSON.stringify(config.disk_storage)}
    size         = ${parseInt(config.disk_size)}
  }
  ${extraDisksHcl}

  network_interface {
    name = "eth0"
    bridge = ${JSON.stringify(config.network.bridge || 'vmbr0')}
    ${vlanLine}
  }

  operating_system {
    template_file_id = ${JSON.stringify(config.template_file_id)}
    type             = ${JSON.stringify(osType)}
  }
}

${config.provision_key_pub ? `
resource "terraform_data" "provisioner" {
  triggers_replace = [
    proxmox_virtual_environment_container.lxc_container.id
  ]

  connection {
    type        = "ssh"
    user        = "root"
    private_key = file("\${path.module}/id_rsa")
    host        = proxmox_virtual_environment_container.lxc_container.initialization[0].ip_config[0].ipv4[0].address == "dhcp" ? split("/", proxmox_virtual_environment_container.lxc_container.ipv4["eth0"])[0] : split("/", proxmox_virtual_environment_container.lxc_container.initialization[0].ip_config[0].ipv4[0].address)[0]
    agent       = false
    timeout     = "5m"
  }

  provisioner "file" {
    source      = "\${path.module}/provision.sh"
    destination = "/tmp/provision.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/provision.sh",
      "/tmp/provision.sh"
    ]
  }
}
` : ''}
`;
}

module.exports = {
  generateMainTf
};
