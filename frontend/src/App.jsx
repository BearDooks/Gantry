import React, { useState, useEffect } from 'react';

// Inline SVG Icons for self-contained, robust visual design
const Icons = {
  Cpu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
  ),
  Ram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
  ),
  HardDrive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
  ),
  Network: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  Archive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
  ),
  FolderOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M2 10h20"/></svg>
  ),
  Gantry: ({ size = 28 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem', verticalAlign: 'middle', color: 'var(--accent-primary)' }}>
      <path d="M3 22V4h18v18" />
      <path d="M3 8h4" />
      <path d="M17 8h4" />
      <path d="M3 4l4 4" />
      <path d="M21 4l-4 4" />
      <rect x="10" y="4" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
      <path d="M12 7v5" />
      <rect x="8" y="12" width="8" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 15h8" />
    </svg>
  )
};

const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api`;

// Custom Searchable Dropdown
const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(opt => 
    (opt.label || '').toLowerCase().includes(search.toLowerCase()) ||
    (opt.value || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedOpt = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className="form-control"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'var(--glass-border)',
          opacity: disabled ? 0.6 : 1,
          userSelect: 'none',
          padding: '0.6rem 1.0rem',
          height: 'auto',
          minHeight: '42px'
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOpt ? '#fff' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <span style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)', fontSize: '0.8rem' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          right: 0,
          zIndex: 9999,
          background: '#0e121a',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(15px)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '300px',
          overflow: 'hidden'
        }}>
          <input
            type="text"
            placeholder="Type to search..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.85rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              margin: 0
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                No matches found
              </div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  style={{
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.85rem',
                    color: opt.value === value ? 'var(--accent-primary)' : '#fff',
                    background: opt.value === value ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background 0.2s',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    lineHeight: '1.4'
                  }}

                  className="table-row-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {

  const [activeTab, setActiveTab] = useState('deploy');
  const [wizardStep, setWizardStep] = useState(1);
  const [settingsSubTab, setSettingsSubTab] = useState('credentials');
  
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  const [config, setConfig] = useState({
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
  });
  
  const [templates, setTemplates] = useState([]);
  const [storages, setStorages] = useState([]);
  const [bridges, setBridges] = useState([]);
  const [allStorages, setAllStorages] = useState([]);
  const [allBridges, setAllBridges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [aplinfoTemplates, setAplinfoTemplates] = useState([]);
  const [snapshots, setSnapshots] = useState([]);

  const [selectedSnapshotDep, setSelectedSnapshotDep] = useState(null);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [newSnapshotDesc, setNewSnapshotDesc] = useState('');
  
  const [selectedDrawerDep, setSelectedDrawerDep] = useState(null);
  const [selectedPipelineDep, setSelectedPipelineDep] = useState(null);
  const [deployingLogs, setDeployingLogs] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('gantry-theme') || 'space');
  const [blurIntensity, setBlurIntensity] = useState(() => parseInt(localStorage.getItem('gantry-blur')) || 16);
  const [showClusterTotals, setShowClusterTotals] = useState(false);
  const [clusterAllocatedVCPUs, setClusterAllocatedVCPUs] = useState(0);
  
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);
  const [isAllResourcesLoading, setIsAllResourcesLoading] = useState(false);
  const [isStoragesLoading, setIsStoragesLoading] = useState(false);
  const [isBridgesLoading, setIsBridgesLoading] = useState(false);
  const [isNodesLoading, setIsNodesLoading] = useState(false);
  const [isAplinfoLoading, setIsAplinfoLoading] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isSnapshotsLoading, setIsSnapshotsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  
  const [notification, setNotification] = useState(null);
  
  // Terraform logs viewer state
  const [activeLogId, setActiveLogId] = useState(null);
  const [logContent, setLogContent] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadSearchTerm, setDownloadSearchTerm] = useState('');
  const [selectedDownloadTemplate, setSelectedDownloadTemplate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  const [enableCustomScript, setEnableCustomScript] = useState(false);

  // Reset page when filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showArchived]);
  
  // Deployment Form State
  const [formData, setFormData] = useState({
    vm_id: 100,
    hostname: '',
    password: '',
    ssh_keys: '',
    template_file_id: '',
    target_node: '',
    cpu_cores: 1,
    memory: 1024,
    swap: 512,
    disk_storage: '',
    disk_size: 8,
    extra_disks: [],
    predefined_apps: [],
    custom_script: '',
    unprivileged: true,
    network: {
      type: 'dhcp',
      bridge: 'vmbr0',
      ip: '',
      gateway: '',
      vlan: '',
      dns_server: '',
      dns_domain: ''
    }
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch initial app configuration
  useEffect(() => {
    fetch(`${API_BASE}/config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setFormData(prev => ({
          ...prev,
          cpu_cores: data.default_cpu_cores !== undefined ? parseInt(data.default_cpu_cores) : prev.cpu_cores,
          memory: data.default_memory !== undefined ? parseInt(data.default_memory) : prev.memory,
          swap: data.default_swap !== undefined ? parseInt(data.default_swap) : prev.swap,
          disk_size: data.default_disk_size !== undefined ? parseInt(data.default_disk_size) : prev.disk_size,
          ssh_keys: data.default_ssh_keys || prev.ssh_keys,
          unprivileged: data.default_unprivileged !== undefined ? !!data.default_unprivileged : prev.unprivileged,
          network: {
            ...prev.network,
            bridge: data.default_bridge || prev.network.bridge,
            dns_server: data.default_dns_server || prev.network.dns_server,
            dns_domain: data.default_dns_domain || prev.network.dns_domain
          }
        }));
      })
      .catch(() => showNotification('Could not load configuration', 'error'));
  }, []);

  // Theme & blur dynamic application
  useEffect(() => {
    localStorage.setItem('gantry-theme', selectedTheme);
    localStorage.setItem('gantry-blur', blurIntensity);
    
    const root = document.documentElement;
    root.style.setProperty('--glass-blur', `${blurIntensity}px`);
    
    if (selectedTheme === 'cyberpunk') {
      root.style.setProperty('--bg-primary', '#020205');
      root.style.setProperty('--bg-glow-1', 'radial-gradient(circle at 10% 20%, rgba(244, 63, 94, 0.15) 0%, transparent 60%)');
      root.style.setProperty('--bg-glow-2', 'radial-gradient(circle at 90% 80%, rgba(56, 189, 248, 0.12) 0%, transparent 60%)');
      root.style.setProperty('--accent-primary', '#f43f5e'); // Rose
      root.style.setProperty('--accent-primary-hover', '#e11d48');
    } else if (selectedTheme === 'violet') {
      root.style.setProperty('--bg-primary', '#0b0816');
      root.style.setProperty('--bg-glow-1', 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)');
      root.style.setProperty('--bg-glow-2', 'radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)');
      root.style.setProperty('--accent-primary', '#8b5cf6'); // Violet
      root.style.setProperty('--accent-primary-hover', '#7c3aed');
    } else {
      // Default 'space'
      root.style.setProperty('--bg-primary', '#080a10');
      root.style.setProperty('--bg-glow-1', 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)');
      root.style.setProperty('--bg-glow-2', 'radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 60%)');
      root.style.setProperty('--accent-primary', '#6366f1'); // Indigo
      root.style.setProperty('--accent-primary-hover', '#4f46e5');
    }
  }, [selectedTheme, blurIntensity]);

  // Log scanning helper for active deployments
  const parseLogsToPipeline = (logText) => {
    const steps = [
      { id: 1, name: 'Initializing Workspace', status: 'pending' },
      { id: 2, name: 'Checking OS Template', status: 'pending' },
      { id: 3, name: 'Allocating System Resources', status: 'pending' },
      { id: 4, name: 'Configuring Network Interface', status: 'pending' },
      { id: 5, name: 'Running Post-Install Provisioning', status: 'pending' }
    ];

    if (!logText) return steps;

    // Step 1: Initializing
    if (logText.includes('terraform init') || logText.includes('Initializing')) {
      steps[0].status = 'active';
    }
    if (logText.includes('Successfully initialized') || logText.includes('Initializing provider plugins')) {
      steps[0].status = 'completed';
      steps[1].status = 'active';
    }

    // Step 2: OS Template
    if (logText.includes('template') || logText.includes('vztmpl')) {
      steps[1].status = 'active';
    }
    if (logText.includes('proxmox_lxc') || logText.includes('Creating...')) {
      steps[1].status = 'completed';
      steps[2].status = 'active';
    }

    // Step 3: Resources
    if (logText.includes('cores') || logText.includes('memory') || logText.includes('rootfs')) {
      steps[2].status = 'active';
    }
    if (logText.includes('network') || logText.includes('interfaces') || logText.includes('ip=')) {
      steps[2].status = 'completed';
      steps[3].status = 'active';
    }

    // Step 4: Network
    if (logText.includes('bridge') || logText.includes('gw=')) {
      steps[3].status = 'active';
    }
    if (logText.includes('provision') || logText.includes('SSH') || logText.includes('provisioner')) {
      steps[3].status = 'completed';
      steps[4].status = 'active';
    }

    // Step 5: Provisioning
    if (logText.includes('Starting Container Provisioning') || logText.includes('Executing')) {
      steps[4].status = 'active';
    }

    // Check completion or failure
    if (logText.includes('Apply complete!') || logText.includes('exit code: 0')) {
      steps.forEach(s => s.status = 'completed');
    } else if (logText.includes('exit code:') && !logText.includes('exit code: 0')) {
      const activeStep = steps.find(s => s.status === 'active');
      if (activeStep) {
        activeStep.status = 'failed';
      }
    }

    return steps;
  };

  // Poll logs for active deploying containers
  useEffect(() => {
    const deployingDeps = deployments.filter(d => d.status === 'deploying');
    if (deployingDeps.length === 0) return;

    const pollLogs = () => {
      deployingDeps.forEach(dep => {
        fetch(`${API_BASE}/deployments/${dep.id}/log`)
          .then(res => res.json())
          .then(data => {
            if (data.log) {
              const parsed = parseLogsToPipeline(data.log);
              setDeployingLogs(prev => ({
                ...prev,
                [dep.id]: parsed
              }));
            }
          })
          .catch(() => {});
      });
    };

    pollLogs();
    const interval = setInterval(pollLogs, 3000);
    return () => clearInterval(interval);
  }, [deployments]);

  const loadAllResourcesForExclusions = () => {
    if (!config.pm_api_url) return;
    setIsAllResourcesLoading(true);
    setIsAplinfoLoading(true);
    
    const fetchStorages = fetch(`${API_BASE}/proxmox/storages?all=true`).then(res => res.json());
    const fetchBridges = fetch(`${API_BASE}/proxmox/bridges?all=true`).then(res => res.json());
    const node = config.node_name || 'pve';
    const fetchAplinfo = fetch(`${API_BASE}/proxmox/aplinfo/${node}`).then(res => res.json());

    Promise.all([fetchStorages, fetchBridges, fetchAplinfo])
      .then(([storagesData, bridgesData, aplinfoData]) => {
        setAllStorages(storagesData.storages || []);
        setAllBridges(bridgesData.bridges || []);
        setAplinfoTemplates(aplinfoData.templates || []);
      })
      .catch(() => {})
      .finally(() => {
        setIsAllResourcesLoading(false);
        setIsAplinfoLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      loadAllResourcesForExclusions();
    }
  }, [activeTab, config.pm_api_url]);

  // Fetch templates, storages, and deployments
  const loadProxmoxData = () => {
    setIsTemplatesLoading(true);
    fetch(`${API_BASE}/proxmox/templates`)
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates && data.templates.length > 0 && !formData.template_file_id) {
          setFormData(prev => ({ ...prev, template_file_id: data.templates[0].volid }));
        }
      })
      .catch(() => showNotification('Error fetching templates', 'error'))
      .finally(() => setIsTemplatesLoading(false));

    setIsStoragesLoading(true);
    fetch(`${API_BASE}/proxmox/storages`)
      .then(res => res.json())
      .then(data => {
        setStorages(data.storages || []);
        if (data.storages && data.storages.length > 0 && !formData.disk_storage) {
          setFormData(prev => ({ ...prev, disk_storage: data.storages[0].name }));
        }
      })
      .catch(() => showNotification('Error fetching storages', 'error'))
      .finally(() => setIsStoragesLoading(false));

    setIsBridgesLoading(true);
    fetch(`${API_BASE}/proxmox/bridges`)
      .then(res => res.json())
      .then(data => {
        setBridges(data.bridges || []);
        // Only set default if no bridge is selected yet, or default_bridge config isn't loaded
        if (data.bridges && data.bridges.length > 0 && !formData.network.bridge) {
          setFormData(prev => ({
            ...prev,
            network: { ...prev.network, bridge: data.bridges[0].name }
          }));
        }
      })
      .catch(() => showNotification('Error fetching network bridges', 'error'))
      .finally(() => setIsBridgesLoading(false));

    setIsNodesLoading(true);
    fetch(`${API_BASE}/proxmox/nodes`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes || []);
        setClusterAllocatedVCPUs(data.total_allocated_vcpus || 0);
        if (data.nodes && data.nodes.length > 0 && !formData.target_node) {
          setFormData(prev => ({ ...prev, target_node: data.nodes[0].name }));
        }
      })
      .catch(() => {})
      .finally(() => setIsNodesLoading(false));

    fetch(`${API_BASE}/proxmox/next-id`)
      .then(res => res.json())
      .then(data => {
        if (data.next_id) {
          setFormData(prev => ({ ...prev, vm_id: data.next_id }));
        }
      })
      .catch(() => {});
  };

  const loadDeployments = () => {
    fetch(`${API_BASE}/deployments`)
      .then(res => res.json())
      .then(data => {
        setDeployments(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProxmoxData();
    loadDeployments();
    
    // Poll deployments status every 5 seconds
    const interval = setInterval(loadDeployments, 5000);
    return () => clearInterval(interval);
  }, [config.pm_api_url]);

  // Handle settings save
  const handleSaveConfig = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
      .then(res => res.json())
      .then(data => {
        showNotification(data.message);
        loadProxmoxData();
      })
      .catch(() => showNotification('Failed to save settings', 'error'));
  };

  // Handle settings wipe/clear
  const handleClearConfig = () => {
    triggerConfirm(
      'Reset All Settings',
      'Are you sure you want to clear all settings? This will reset your Proxmox API integration and all default parameters.',
      () => {
        fetch(`${API_BASE}/config/clear`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            showNotification(data.message);
            setConfig(data.config);
            setTemplates([]);
            setStorages([]);
            setBridges([]);
            setAllStorages([]);
          })
          .catch(() => showNotification('Failed to clear settings', 'error'));
      }
    );
  };

  // Handle settings power actions (start/stop/reboot)
  const handlePowerAction = (dep, action) => {
    const node = dep.target_node || config.node_name || 'pve';
    fetch(`${API_BASE}/proxmox/lxc/${node}/${dep.vm_id}/status/${action}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification(data.message);
          loadDeployments();
        } else {
          showNotification(`Power action failed: ${data.error || 'Unknown error'}`, 'error');
        }
      })
      .catch((err) => showNotification(`Error executing action: ${err.message}`, 'error'));
  };

  // Open Snapshots modal
  const openSnapshotsModal = (dep) => {
    setSelectedSnapshotDep(dep);
    setNewSnapshotName('');
    setNewSnapshotDesc('');
    loadSnapshots(dep);
  };

  // Load container snapshots
  const loadSnapshots = (dep) => {
    setIsSnapshotsLoading(true);
    const node = dep.target_node || config.node_name || 'pve';
    fetch(`${API_BASE}/proxmox/lxc/${node}/${dep.vm_id}/snapshots`)
      .then(res => res.json())
      .then(data => {
        setSnapshots(data.snapshots || []);
      })
      .catch(() => showNotification('Failed to fetch snapshots', 'error'))
      .finally(() => setIsSnapshotsLoading(false));
  };

  // Create Snapshot
  const handleCreateSnapshot = (e) => {
    e.preventDefault();
    if (!newSnapshotName.trim()) return;
    const node = selectedSnapshotDep.target_node || config.node_name || 'pve';
    fetch(`${API_BASE}/proxmox/lxc/${node}/${selectedSnapshotDep.vm_id}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapname: newSnapshotName, description: newSnapshotDesc })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification(data.message);
          setNewSnapshotName('');
          setNewSnapshotDesc('');
          loadSnapshots(selectedSnapshotDep);
        } else {
          showNotification(data.error || 'Failed to create snapshot', 'error');
        }
      })
      .catch(() => showNotification('Error creating snapshot', 'error'));
  };

  // Rollback Snapshot
  const handleRollbackSnapshot = (snapname) => {
    triggerConfirm(
      'Rollback Snapshot',
      `Are you sure you want to rollback to snapshot '${snapname}'? This will revert the container state.`,
      () => {
        const node = selectedSnapshotDep.target_node || config.node_name || 'pve';
        fetch(`${API_BASE}/proxmox/lxc/${node}/${selectedSnapshotDep.vm_id}/snapshots/${snapname}/rollback`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              showNotification(data.message);
              loadSnapshots(selectedSnapshotDep);
            } else {
              showNotification(data.error || 'Failed to rollback', 'error');
            }
          })
          .catch(() => showNotification('Error rolling back snapshot', 'error'));
      }
    );
  };

  // Delete Snapshot
  const handleDeleteSnapshot = (snapname) => {
    triggerConfirm(
      'Delete Snapshot',
      `Are you sure you want to delete snapshot '${snapname}'?`,
      () => {
        const node = selectedSnapshotDep.target_node || config.node_name || 'pve';
        fetch(`${API_BASE}/proxmox/lxc/${node}/${selectedSnapshotDep.vm_id}/snapshots/${snapname}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              showNotification(data.message);
              loadSnapshots(selectedSnapshotDep);
            } else {
              showNotification(data.error || 'Failed to delete snapshot', 'error');
            }
          })
          .catch(() => showNotification('Error deleting snapshot', 'error'));
      }
    );
  };

  // Draw lightweight SVG Sparkline
  const drawSparkline = (points, key, maxVal = 100, color = 'var(--accent-primary)') => {
    if (!points || points.length < 2) return null;
    const width = 85;
    const height = 18;
    const padding = 1;
    const xStep = (width - padding * 2) / (points.length - 1);
    
    const coords = points.map((p, idx) => {
      const x = padding + idx * xStep;
      const val = p[key] || 0;
      const clampedVal = Math.min(val, maxVal);
      const y = height - padding - (clampedVal / (maxVal || 1)) * (height - padding * 2);
      return { x, y };
    });

    const linePointsStr = coords.map(c => `${c.x},${c.y}`).join(' ');
    const areaPointsStr = `${coords[0].x},${height} ${linePointsStr} ${coords[coords.length - 1].x},${height}`;
    
    const gradId = `sparkline-grad-${key}-${Math.random().toString(36).substr(2, 4)}`;

    return (
      <svg width={width} height={height} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '0.5rem', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#${gradId})`}
          points={areaPointsStr}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePointsStr}
        />
      </svg>
    );
  };

  // Test configuration endpoint
  const handleTestConfig = () => {
    setIsTestingConfig(true);
    fetch(`${API_BASE}/proxmox/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.success) {
          showNotification('Proxmox cluster successfully connected! Templates pulled.');
          loadProxmoxData();
        } else {
          showNotification(`Connection test failed: ${data.error || 'Unknown error'}`, 'error');
        }
      })
      .catch((err) => showNotification(`Error connecting: ${err.message}`, 'error'))
      .finally(() => setIsTestingConfig(false));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.vm_id || formData.vm_id < 100) {
        showNotification('VM ID must be 100 or greater.', 'error');
        return false;
      }
      const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/;
      if (!formData.hostname || !hostnameRegex.test(formData.hostname)) {
        showNotification('Invalid Hostname. Use alphanumeric characters and hyphens only.', 'error');
        return false;
      }
      if (!formData.password) {
        showNotification('Root Password is required.', 'error');
        return false;
      }
      if (formData.password.length < 6) {
        showNotification('Root Password must be at least 6 characters long.', 'error');
        return false;
      }
      if (!formData.target_node) {
        showNotification('Please select a Target Cluster Node.', 'error');
        return false;
      }
      if (!formData.template_file_id) {
        showNotification('Please select a Container Template.', 'error');
        return false;
      }
    } else if (step === 2) {
      if (!formData.cpu_cores || formData.cpu_cores < 1) {
        showNotification('CPU Cores must be 1 or more.', 'error');
        return false;
      }
      if (!formData.memory || formData.memory < 256) {
        showNotification('RAM must be 256 MB or more.', 'error');
        return false;
      }
      if (formData.swap === undefined || formData.swap < 0) {
        showNotification('Swap memory cannot be negative.', 'error');
        return false;
      }
      if (!formData.disk_storage) {
        showNotification('Please select a Root Disk Target Storage.', 'error');
        return false;
      }
      if (!formData.disk_size || formData.disk_size < 1) {
        showNotification('Root Disk Size must be 1 GB or more.', 'error');
        return false;
      }
    } else if (step === 3) {
      if (!formData.network.bridge) {
        showNotification('Please select a Network Bridge.', 'error');
        return false;
      }
      if (formData.network.type === 'static') {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:3[0-2]|[1-2]?[0-9])$/;
        
        if (!cidrRegex.test(formData.network.ip)) {
          showNotification('Invalid IPv4 CIDR address. Format must be IP/Mask (e.g., 192.168.1.50/24).', 'error');
          return false;
        }
        
        if (formData.network.gateway && !ipRegex.test(formData.network.gateway)) {
          showNotification('Invalid Gateway IP address.', 'error');
          return false;
        }
        
        if (formData.network.dns_server && !ipRegex.test(formData.network.dns_server)) {
          showNotification('Invalid DNS Server IP address.', 'error');
          return false;
        }
      }
    }
    return true;
  };

  // Deploy submit
  const handleDeploy = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (wizardStep < 4) {
      if (validateStep(wizardStep)) {
        setWizardStep(prev => prev + 1);
      }
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsDeploying(true);

    const payload = {
      ...formData,
      network: {
        ...formData.network,
        ip: formData.network.type === 'dhcp' ? 'dhcp' : formData.network.ip
      }
    };

    fetch(`${API_BASE}/deployments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        showNotification('Deployment pipeline initiated successfully');
        setActiveTab('dashboard');
        loadDeployments();
      })
      .catch(() => showNotification('Failed to launch deployment job', 'error'))
      .finally(() => setIsDeploying(false));
  };

  // Destroy deployment
  const handleDestroy = (id) => {
    triggerConfirm(
      'Destroy Container',
      'Are you absolutely sure you want to destroy this LXC container? All data will be lost.',
      () => {
        fetch(`${API_BASE}/deployments/${id}/destroy`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            showNotification('Tear-down job submitted');
            loadDeployments();
          })
          .catch(() => showNotification('Failed to submit destroy request', 'error'));
      }
    );
  };

  // Archive deployment
  const handleArchive = (id) => {
    fetch(`${API_BASE}/deployments/${id}/archive`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        showNotification(data.message || 'Deployment archived');
        loadDeployments();
      })
      .catch(() => showNotification('Failed to archive deployment', 'error'));
  };

  // Unarchive deployment
  const handleUnarchive = (id) => {
    fetch(`${API_BASE}/deployments/${id}/unarchive`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        showNotification(data.message || 'Deployment restored');
        loadDeployments();
      })
      .catch(() => showNotification('Failed to restore deployment', 'error'));
  };

  // Delete downloaded container template
  const handleDeleteTemplate = (volid) => {
    triggerConfirm(
      'Delete Container Template',
      `Are you sure you want to permanently delete the template file '${volid.split('/').pop()}' from Proxmox storage?`,
      () => {
        fetch(`${API_BASE}/proxmox/templates`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volid })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              showNotification(data.message);
              loadProxmoxData(); // Reload templates list
            } else {
              showNotification(data.error || 'Failed to delete template', 'error');
            }
          })
          .catch(() => showNotification('Error deleting template', 'error'));
      }
    );
  };


  // View logs helper
  const viewLogs = (id) => {
    setActiveLogId(id);
    setLogContent('Loading logs...');
    fetch(`${API_BASE}/deployments/${id}/log`)
      .then(res => res.json())
      .then(data => setLogContent(data.log || 'No log details available.'))
      .catch(() => setLogContent('Failed to fetch logs.'));
  };

  // Keep logs modal refreshed
  useEffect(() => {
    if (!activeLogId) return;
    const logInterval = setInterval(() => {
      fetch(`${API_BASE}/deployments/${activeLogId}/log`)
        .then(res => res.json())
        .then(data => setLogContent(data.log || 'No log details available.'))
        .catch(() => {});
    }, 3000);
    return () => clearInterval(logInterval);
  }, [activeLogId]);

  // Add/Remove extra disks
  const addExtraDisk = () => {
    const defaultStorage = storages.length > 0 ? storages[0].name : 'local';
    const diskCount = formData.extra_disks.length + 1;
    setFormData(prev => ({
      ...prev,
      extra_disks: [...prev.extra_disks, { storage: defaultStorage, size: 10, mount_point: `/mnt/data${diskCount}` }]
    }));
  };

  const removeExtraDisk = (idx) => {
    setFormData(prev => ({
      ...prev,
      extra_disks: prev.extra_disks.filter((_, i) => i !== idx)
    }));
  };

  const updateExtraDisk = (idx, field, val) => {
    setFormData(prev => {
      const updated = [...prev.extra_disks];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, extra_disks: updated };
    });
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalCPU = deployments.reduce((acc, dep) => acc + (dep.status === 'active' ? dep.cpu_cores || 0 : 0), 0);
  const totalRAM = deployments.reduce((acc, dep) => acc + (dep.status === 'active' ? dep.memory || 0 : 0), 0);
  const totalDisk = deployments.reduce((acc, dep) => acc + (dep.status === 'active' ? dep.disk_size || 0 : 0), 0);

  // Dynamic cluster-wide capacity calculations
  const clusterCPU = nodes.reduce((acc, n) => acc + (n.status === 'online' ? n.maxcpu || 0 : 0), 0) || 64;
  const clusterMemBytes = nodes.reduce((acc, n) => acc + (n.status === 'online' ? n.maxmem || 0 : 0), 0) || (32 * 1024 * 1024 * 1024);
  const clusterMemGB = Math.round(clusterMemBytes / (1024 * 1024 * 1024)) || 32;
  const clusterDiskGB = storages.reduce((acc, s) => acc + (s.active ? (s.total || 0) : 0), 0) / (1024 * 1024 * 1024) || 500;
  const clusterDiskGBRounded = Math.round(clusterDiskGB) || 500;

  // Real-time Physical Cluster Consumption
  const physicalCPUUsed = nodes.reduce((acc, n) => acc + (n.status === 'online' ? (n.cpu || 0) * (n.maxcpu || 0) : 0), 0);
  const physicalMemBytesUsed = nodes.reduce((acc, n) => acc + (n.status === 'online' ? (n.mem || 0) : 0), 0);
  const physicalMemMBUsed = Math.round(physicalMemBytesUsed / (1024 * 1024));
  const physicalDiskBytesUsed = storages.reduce((acc, s) => acc + (s.active ? (s.used || 0) : 0), 0);
  const physicalDiskGBUsed = Math.round(physicalDiskBytesUsed / (1024 * 1024 * 1024));

  const displayCPU = showClusterTotals ? clusterAllocatedVCPUs : totalCPU;
  const displayRAM = showClusterTotals ? physicalMemMBUsed : totalRAM;
  const displayDisk = showClusterTotals ? physicalDiskGBUsed : totalDisk;

  const filteredDeployments = deployments
    .filter(d => showArchived ? d.archived : !d.archived)
    .filter(d => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (d.hostname || '').toLowerCase().includes(term) ||
        (d.vm_id || '').toString().includes(term) ||
        (d.template || '').toLowerCase().includes(term) ||
        (d.status || '').toLowerCase().includes(term)
      );
    });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDeployments.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeployments = filteredDeployments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Header Panel */}
      <header className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icons.Gantry size={36} />
          <div>
            <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.1rem', lineHeight: '1.1' }}>Gantry</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Internal Proxmox LXC Dynamic Terraform Deployer & Monitor</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
          <button className={`nav-tab-btn ${activeTab === 'deploy' ? 'active' : ''}`} onClick={() => setActiveTab('deploy')}>
            <Icons.Plus /> Deploy LXC
          </button>
          <button className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Icons.Activity /> Dashboard
          </button>
          <button className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Icons.Settings /> Settings
          </button>
        </nav>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          color: '#ffffff',
          fontWeight: 500,
          transition: 'all 0.3s ease'
        }}>
          {notification.message}
        </div>
      )}

      {/* Main Sections */}
      <main>
        
        {/* Tab 1: Deploy Form */}
        {activeTab === 'deploy' && (
          <div className="glass-panel fade-in" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: 0 }}>Create LXC Instance</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                Step {wizardStep} of 4
              </span>
            </div>
            
            {/* Visual Stepper */}
            <div className="stepper-container">
              <div className="stepper-line">
                <div className="stepper-line-fill" style={{ width: `${((wizardStep - 1) / 3) * 100}%` }}></div>
              </div>
              <div className={`stepper-step ${wizardStep === 1 ? 'active' : ''} ${wizardStep > 1 ? 'completed' : ''}`} onClick={() => setWizardStep(1)} style={{ cursor: 'pointer' }}>
                <div className="stepper-bubble">{wizardStep > 1 ? '✓' : '1'}</div>
                <span className="stepper-label">General & OS</span>
              </div>
              <div className={`stepper-step ${wizardStep === 2 ? 'active' : ''} ${wizardStep > 2 ? 'completed' : ''}`} onClick={() => { if (validateStep(1)) setWizardStep(2); }} style={{ cursor: 'pointer' }}>
                <div className="stepper-bubble">{wizardStep > 2 ? '✓' : '2'}</div>
                <span className="stepper-label">Resources</span>
              </div>
              <div className={`stepper-step ${wizardStep === 3 ? 'active' : ''} ${wizardStep > 3 ? 'completed' : ''}`} onClick={() => { if (validateStep(1) && validateStep(2)) setWizardStep(3); }} style={{ cursor: 'pointer' }}>
                <div className="stepper-bubble">{wizardStep > 3 ? '✓' : '3'}</div>
                <span className="stepper-label">Network</span>
              </div>
              <div className={`stepper-step ${wizardStep === 4 ? 'active' : ''}`} onClick={() => { if (validateStep(1) && validateStep(2) && validateStep(3)) setWizardStep(4); }} style={{ cursor: 'pointer' }}>
                <div className="stepper-bubble">4</div>
                <span className="stepper-label">Provisioning</span>
              </div>
            </div>

            {/* Proxmox Host Missing Banner */}
            {!config.pm_api_url && (
              <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderColor: 'var(--accent-warning)', background: 'rgba(245, 158, 11, 0.08)', marginBottom: '2rem' }}>
                <div style={{ color: 'var(--accent-warning)' }}><Icons.Info /></div>
                <div>
                  <h4 style={{ color: 'var(--accent-warning)', margin: 0, fontSize: '0.95rem' }}>Proxmox Credentials Missing</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Configure Proxmox server integration in the <strong style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setActiveTab('settings')}>Settings Tab</strong> first to fetch templates & storages dynamically.</p>
                </div>
              </div>
            )}

            {/* STEP 1: General & OS Settings */}
            {wizardStep === 1 && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: 0 }}>General Settings</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">VM/CT ID</label>
                    <input type="number" required className="form-control" value={formData.vm_id} onChange={(e) => setFormData({ ...formData, vm_id: parseInt(e.target.value) || 0 })} min="100" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Unique CT identifier (ID &ge; 100).</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hostname</label>
                    <input type="text" required placeholder="e.g. debian-web-server" className="form-control" value={formData.hostname} onChange={(e) => setFormData({ ...formData, hostname: e.target.value })} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Alphanumerics and hyphens only.</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Root Password</label>
                    <input type="password" required placeholder="••••••••" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Administrative login credential.</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: '0.5rem 0 0 0' }}>Compute & Image Location</h3>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Target Cluster Node</label>
                  {isNodesLoading ? (
                    <div className="form-control" style={{ color: 'var(--text-muted)' }}>Fetching nodes...</div>
                  ) : (
                    <select className="form-control" value={formData.target_node} onChange={(e) => setFormData({ ...formData, target_node: e.target.value })} required style={{ width: '100%', maxWidth: '550px' }}>
                      <option value="" disabled>-- Select Target Node --</option>
                      {nodes.map(node => {
                        const cpuText = node.cpu !== undefined && !isNaN(node.cpu) ? `CPU: ${(node.cpu * 100).toFixed(0)}%` : '';
                        const memText = node.mem !== undefined && node.maxmem !== undefined && !isNaN(node.mem) && !isNaN(node.maxmem) 
                          ? `RAM: ${(node.mem / (1024 ** 3)).toFixed(1)}GB / ${(node.maxmem / (1024 ** 3)).toFixed(1)}GB` 
                          : '';
                        const statusDetails = [cpuText, memText].filter(Boolean).join(', ');
                        return (
                          <option key={node.name} value={node.name}>
                            {node.name} ({node.status === 'online' ? `Online${statusDetails ? `, ${statusDetails}` : ''}` : 'Offline'})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Select Container OS Template</label>
                  {isTemplatesLoading ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Fetching templates from Proxmox...</div>
                  ) : templates.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>No templates available on storage pool. Download one in the Settings tab.</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                      {templates.map(tmpl => {
                        const name = tmpl.volid.split('/').pop();
                        const isSelected = formData.template_file_id === tmpl.volid;
                        
                        let osName = 'Linux';
                        let osColor = 'var(--accent-primary)';
                        let osEmoji = '🐧';
                        
                        if (name.toLowerCase().includes('ubuntu')) {
                          osName = 'Ubuntu';
                          osColor = '#e95420';
                          osEmoji = '🦊';
                        } else if (name.toLowerCase().includes('debian')) {
                          osName = 'Debian';
                          osColor = '#d70a53';
                          osEmoji = '🌀';
                        } else if (name.toLowerCase().includes('alpine')) {
                          osName = 'Alpine';
                          osColor = '#0d597f';
                          osEmoji = '🏔️';
                        }
                        
                        return (
                          <div
                            key={tmpl.volid}
                            onClick={() => setFormData({ ...formData, template_file_id: tmpl.volid })}
                            style={{
                              padding: '1.25rem 1rem',
                              background: isSelected ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.005)',
                              border: isSelected ? `2px solid ${osColor}` : '1px solid var(--glass-border)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.5rem',
                              boxShadow: isSelected ? `0 0 10px ${osColor}22` : 'none'
                            }}
                          >
                            <span style={{ fontSize: '1.85rem' }}>{osEmoji}</span>
                            <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{osName}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', wordBreak: 'break-word', width: '100%', minHeight: '2.4rem', lineHeight: '1.2' }} title={name}>
                              {name.replace('-standard', '').replace('-default', '')}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{formatBytes(tmpl.size)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Resources & Disks */}
            {wizardStep === 2 && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: 0 }}>System Resources</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icons.Cpu /> CPU Cores</label>
                    <input type="number" required className="form-control" value={formData.cpu_cores} onChange={(e) => setFormData({ ...formData, cpu_cores: parseInt(e.target.value) || 1 })} min="1" max="64" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icons.Ram /> RAM (MB)</label>
                    <input type="number" required className="form-control" value={formData.memory} onChange={(e) => setFormData({ ...formData, memory: parseInt(e.target.value) || 512 })} min="256" step="128" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icons.Ram /> SWAP (MB)</label>
                    <input type="number" required className="form-control" value={formData.swap} onChange={(e) => setFormData({ ...formData, swap: parseInt(e.target.value) || 0 })} min="0" step="128" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: 0 }}>Disk Configuration</h3>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={addExtraDisk}>
                    <Icons.Plus /> Add Extra Disk
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Root Disk Target Storage</label>
                    {isStoragesLoading ? (
                      <div className="form-control" style={{ color: 'var(--text-muted)' }}>Loading storage datastores...</div>
                    ) : (
                      <select className="form-control" value={formData.disk_storage} onChange={(e) => setFormData({ ...formData, disk_storage: e.target.value })} required>
                        <option value="" disabled>-- Select Storage --</option>
                        {storages.map(st => (
                          <option key={st.name} value={st.name}>{st.name} ({st.type})</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Root Disk Size (GB)</label>
                    <input type="number" required className="form-control" value={formData.disk_size} onChange={(e) => setFormData({ ...formData, disk_size: parseInt(e.target.value) || 1 })} min="1" />
                  </div>
                </div>

                {/* Extra Disks dynamic fields */}
                {formData.extra_disks.map((disk, idx) => (
                  <div className="form-row glass-card" key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.015)' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label className="form-label">Extra Disk #{idx + 1} Storage</label>
                      <select className="form-control" value={disk.storage} onChange={(e) => updateExtraDisk(idx, 'storage', e.target.value)} required>
                        {storages.map(st => (
                          <option key={st.name} value={st.name}>{st.name} ({st.type})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mount Point</label>
                      <input type="text" className="form-control" placeholder="e.g. /mnt/data" value={disk.mount_point || ''} onChange={(e) => updateExtraDisk(idx, 'mount_point', e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: 0 }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Size (GB)</label>
                        <input type="number" className="form-control" value={disk.size} onChange={(e) => updateExtraDisk(idx, 'size', parseInt(e.target.value) || 1)} min="1" required />
                      </div>
                      <button type="button" className="btn btn-danger" style={{ height: '42px', padding: '0 0.8rem' }} onClick={() => removeExtraDisk(idx)}>
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: Networking Settings */}
            {wizardStep === 3 && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: 0 }}>Network Interfaces</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Network Bridge</label>
                    {isBridgesLoading ? (
                      <div className="form-control" style={{ color: 'var(--text-muted)' }}>Loading network bridges...</div>
                    ) : (
                      <select className="form-control" value={formData.network.bridge} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, bridge: e.target.value } })} required>
                        <option value="" disabled>-- Select Bridge --</option>
                        {bridges.map(br => (
                          <option key={br.name} value={br.name}>{br.name} {br.comment ? `(${br.comment})` : ''}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">IP Allocation Policy</label>
                    <select className="form-control" value={formData.network.type} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, type: e.target.value } })} required>
                      <option value="dhcp">DHCP (Automatic IP)</option>
                      <option value="static">Static IP Configuration</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">VLAN Tag (Optional)</label>
                    <input type="number" className="form-control" value={formData.network.vlan} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, vlan: e.target.value } })} placeholder="e.g. 10" min="1" max="4094" />
                  </div>
                </div>

                {formData.network.type === 'static' && (
                  <div className="form-row glass-card fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                    <div className="form-group">
                      <label className="form-label">IPv4 Address (CIDR)</label>
                      <input type="text" className="form-control" required placeholder="e.g. 192.168.1.50/24" value={formData.network.ip} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, ip: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gateway</label>
                      <input type="text" className="form-control" required placeholder="e.g. 192.168.1.1" value={formData.network.gateway} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, gateway: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">DNS Server (Optional)</label>
                      <input type="text" className="form-control" placeholder="e.g. 1.1.1.1" value={formData.network.dns_server} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, dns_server: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">DNS Search Domain (Optional)</label>
                      <input type="text" className="form-control" placeholder="e.g. local.lan" value={formData.network.dns_domain} onChange={(e) => setFormData({ ...formData, network: { ...formData.network, dns_domain: e.target.value } })} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Provisioning & Finalize */}
            {wizardStep === 4 && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: 0 }}>Provisioning Options</h3>
                <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                  <label className="form-label" style={{ marginBottom: '1rem' }}>Preconfigured Applications to Install</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { id: 'docker', name: 'Docker', desc: 'Standard container engine daemon', icon: <Icons.HardDrive /> },
                      { id: 'docker-compose', name: 'Docker Compose', desc: 'Define & run multi-container applications', icon: <Icons.Network /> },
                      { id: 'podman', name: 'Podman', desc: 'Secure, daemonless Docker alternative', icon: <Icons.Cpu /> },
                      { id: 'podman-compose', name: 'Podman Compose', desc: 'Run multi-container setups using Podman', icon: <Icons.Network /> },
                      { id: 'tailscale', name: 'Tailscale', desc: 'Zero-config secure mesh VPN network', icon: <Icons.Activity /> },
                      { id: 'nginx', name: 'Nginx', desc: 'High-performance reverse proxy & web server', icon: <Icons.Settings /> }
                    ].map(app => {
                      const isSelected = formData.predefined_apps.includes(app.id);
                      return (
                        <div
                          key={app.id}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              predefined_apps: isSelected
                                ? prev.predefined_apps.filter(id => id !== app.id)
                                : [...prev.predefined_apps, app.id]
                            }));
                          }}
                          style={{
                            background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                            alignItems: 'flex-start'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
                            <span style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'inline-flex' }}>
                              {app.icon}
                            </span>
                            <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{app.name}</span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              style={{
                                marginLeft: 'auto',
                                width: '14px',
                                height: '14px',
                                cursor: 'pointer',
                                accentColor: 'var(--accent-primary)'
                              }}
                            />
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>
                            {app.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'none', margin: 0, color: '#fff' }}>
                      <input type="checkbox" checked={enableCustomScript} onChange={(e) => {
                        setEnableCustomScript(e.target.checked);
                        if (!e.target.checked) setFormData(prev => ({ ...prev, custom_script: '' }));
                      }} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      Enable Custom Provisioning Script
                    </label>
                  </div>
                </div>

                {enableCustomScript && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Custom Provisioning Bash Script</label>
                    <textarea rows="4" className="form-control" placeholder="# Write your custom script here&#10;apt-get update &amp;&amp; apt-get install -y git neofetch" value={formData.custom_script} onChange={(e) => setFormData({ ...formData, custom_script: e.target.value })} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}></textarea>
                  </div>
                )}

                {/* SSH Public Keys */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">SSH Public Keys (One per line, optional)</label>
                  <textarea rows="3" className="form-control" placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC..." value={formData.ssh_keys} onChange={(e) => setFormData({ ...formData, ssh_keys: e.target.value })} style={{ resize: 'vertical' }}></textarea>
                </div>
              </div>
            )}

            {/* Stepper Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <div>
                {wizardStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={() => setWizardStep(prev => prev - 1)}>
                    Back
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {wizardStep < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={() => { if (validateStep(wizardStep)) setWizardStep(prev => prev + 1); }}>
                    Continue
                  </button>
                ) : (
                  <button type="button" disabled={isDeploying || templates.length === 0} className="btn btn-primary" style={{ padding: '0.65rem 2rem' }} onClick={() => handleDeploy()}>
                    {isDeploying ? 'Starting Pipeline...' : 'Deploy Container'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dashboard / Reporting */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Deployments Stats Grid */}
            <div className="form-row" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Created</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{deployments.filter(d => !d.archived).length}</h3>
                </div>
                <div style={{ color: 'var(--accent-primary)', opacity: 0.8 }}><Icons.Activity /></div>
              </div>
              <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active/Running</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.25rem', color: 'var(--accent-success)' }}>
                    {deployments.filter(d => !d.archived && (d.status === 'active' || (d.proxmox_status && d.proxmox_status.status === 'running'))).length}
                  </h3>
                </div>
                <div style={{ color: 'var(--accent-success)', opacity: 0.8 }}><Icons.Activity /></div>
              </div>
              <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Failed Jobs (Active)</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.25rem', color: 'var(--accent-error)' }}>
                    {deployments.filter(d => !d.archived && d.status === 'failed').length}
                  </h3>
                </div>
                <div style={{ color: 'var(--accent-error)', opacity: 0.8 }}><Icons.Info /></div>
              </div>
            </div>

            {/* Cluster Resource Sizing Gauges Header with Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>Cluster Resource Footprint</h3>
              <button
                type="button"
                onClick={() => setShowClusterTotals(prev => !prev)}
                className="btn btn-secondary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  background: showClusterTotals ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: showClusterTotals ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  color: showClusterTotals ? 'var(--accent-primary)' : '#fff',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {showClusterTotals ? '📊 Showing: Physical Cluster Load' : '📦 Showing: Gantry Footprint Only'}
              </button>
            </div>

             <div className="form-row" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {showClusterTotals ? 'Total Cluster vCPUs' : 'Allocated vCPUs'}
                  </span>
                  <strong style={{ color: 'var(--accent-primary)' }}>
                    {displayCPU} / {clusterCPU * 4} Cores
                  </strong>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min((displayCPU / (clusterCPU * 4)) * 100, 100)}%`, 
                    background: 'var(--accent-primary)', 
                    borderRadius: '3px' 
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {showClusterTotals 
                    ? `Total allocated vCPUs across all VMs & containers in environment (${clusterCPU * 4} Cores max)` 
                    : `Provisional limit based on 4:1 virtual-to-physical overcommit (${clusterCPU * 4} Cores)`
                  }
                </span>
              </div>

              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {showClusterTotals ? 'Total Cluster Memory Usage' : 'Allocated Memory'}
                  </span>
                  <strong style={{ color: 'var(--accent-info)' }}>
                    {showClusterTotals 
                      ? `${displayRAM >= 1024 ? `${(displayRAM / 1024).toFixed(1)} GB` : `${displayRAM} MB`} / ${clusterMemGB} GB` 
                      : `${displayRAM >= 1024 ? `${(displayRAM / 1024).toFixed(1)} GB` : `${displayRAM} MB`}`
                    }
                  </strong>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((displayRAM / (clusterMemGB * 1024)) * 100, 100)}%`, background: 'var(--accent-info)', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {showClusterTotals ? 'Total real-time memory usage of online cluster nodes' : `Provisional limit based on online cluster capacity (${clusterMemGB} GB)`}
                </span>
              </div>

              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {showClusterTotals ? 'Total Cluster Disk Allocation' : 'Allocated Disk'}
                  </span>
                  <strong style={{ color: 'var(--accent-success)' }}>
                    {showClusterTotals ? `${displayDisk} / ${clusterDiskGBRounded} GB` : `${displayDisk} GB`}
                  </strong>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((displayDisk / clusterDiskGBRounded) * 100, 100)}%`, background: 'var(--accent-success)', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {showClusterTotals ? 'Total storage capacity consumed by active pools' : `Provisional limit based on storage pools capacity (${clusterDiskGBRounded} GB)`}
                </span>
              </div>
            </div>

            {/* Deployments Table */}
            <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                  {showArchived ? 'Archived Container Deployments' : 'Active Container Deployments'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search hostname, VM ID, template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ width: '220px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', height: '36px' }}
                  />
                  <label className="form-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.9rem', color: '#fff' }}>
                    <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                    Show Archived
                  </label>
                </div>
              </div>
              
              {filteredDeployments.length === 0 ? (
                <div className="fade-in" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ fontSize: '3rem', opacity: 0.85 }}>🚀</div>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>No Containers Active</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem', maxWidth: '400px', marginInline: 'auto', lineHeight: '1.4' }}>
                      {searchTerm ? 'No deployments match your search filter query.' : (showArchived ? 'No archived container instances found.' : 'You have not deployed any LXC container instances yet. Initialize one right away to get started.')}
                    </p>
                  </div>
                  {!searchTerm && !showArchived && (
                    <button type="button" className="btn btn-primary" onClick={() => setActiveTab('deploy')} style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', height: '36px' }}>
                      Deploy First LXC Container
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem 0.75rem' }}>ID & Name</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Template</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Resources</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Status</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Usage (Live)</th>
                        <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDeployments
                        .map((dep) => {
                          const isRunning = dep.proxmox_status?.status === 'running';
                          return (
                            <tr key={dep.id} onClick={(e) => { if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) setSelectedDrawerDep(dep); }} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', cursor: 'pointer' }} className="table-row-hover">
                            
                            {/* ID & Name */}
                            <td style={{ padding: '1.25rem 0.75rem' }}>
                              <div style={{ fontWeight: 600, color: '#fff' }}>{dep.hostname}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CT ID: {dep.vm_id}</div>
                            </td>

                            {/* Template */}
                            <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {dep.template.split('/').pop()}
                            </td>

                            {/* Resources */}
                            <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.85rem' }}>
                              <div>{dep.cpu_cores} vCPU</div>
                              <div style={{ color: 'var(--text-secondary)' }}>{dep.memory} MB RAM</div>
                            </td>

                            {/* Deployment Status */}
                            <td style={{ padding: '1.25rem 0.75rem' }}>
                              {dep.status === 'deploying' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    color: 'var(--accent-primary)',
                                    width: 'fit-content'
                                  }}>
                                    deploying
                                  </span>
                                  {(() => {
                                    const steps = deployingLogs[dep.id] || [];
                                    const completedCount = steps.filter(s => s.status === 'completed').length;
                                    const activeStep = steps.find(s => s.status === 'active');
                                    const pct = (completedCount / 5) * 100;
                                    return (
                                      <div style={{ minWidth: '120px' }}>
                                        <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.25rem' }}>
                                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-primary)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15rem' }}>
                                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '85px' }}>
                                            {activeStep ? activeStep.name : 'Initializing...'}
                                          </span>
                                          <span onClick={(e) => { e.stopPropagation(); setSelectedPipelineDep(dep); }} style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
                                            Track
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <>
                                  <span style={{
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    background: dep.status === 'active' ? 'rgba(16, 185, 129, 0.15)' :
                                                dep.status === 'destroying' ? 'rgba(245, 158, 11, 0.15)' :
                                                'rgba(239, 68, 68, 0.15)',
                                    color: dep.status === 'active' ? 'var(--accent-success)' :
                                           dep.status === 'destroying' ? 'var(--accent-warning)' :
                                           'var(--accent-error)'
                                  }}>
                                    {dep.status}
                                  </span>
                                  {dep.proxmox_status?.status && (
                                    <div style={{ fontSize: '0.75rem', color: isRunning ? 'var(--accent-success)' : 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isRunning ? 'var(--accent-success)' : 'var(--text-muted)', display: 'inline-block' }}></span>
                                      {dep.proxmox_status.status}
                                    </div>
                                  )}
                                </>
                              )}
                              {dep.status === 'active' && dep.proxmox_status?.status && (
                                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem' }}>
                                  {isRunning ? (
                                    <>
                                      <button
                                        type="button"
                                        title="Shutdown Container"
                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--accent-warning)', borderRadius: '3px', cursor: 'pointer' }}
                                        onClick={() => handlePowerAction(dep, 'shutdown')}
                                      >
                                        Stop
                                      </button>
                                      <button
                                        type="button"
                                        title="Reboot Container"
                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', color: 'var(--accent-primary)', borderRadius: '3px', cursor: 'pointer' }}
                                        onClick={() => handlePowerAction(dep, 'reboot')}
                                      >
                                        Reboot
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      title="Start Container"
                                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-success)', borderRadius: '3px', cursor: 'pointer' }}
                                      onClick={() => handlePowerAction(dep, 'start')}
                                    >
                                      Start
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>

                             {/* Real-time resource usage from Proxmox */}
                             <td style={{ padding: '1.25rem 0.75rem', fontSize: '0.8rem', width: '240px' }}>
                               {isRunning ? (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <span>CPU: <strong style={{ color: '#fff' }}>{(dep.proxmox_status.cpu * 100).toFixed(1)}%</strong></span>
                                     {drawSparkline(dep.history, 'cpu', 100, 'var(--accent-primary)')}
                                   </div>
                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <span>RAM: <strong style={{ color: '#fff' }}>{Math.round(dep.proxmox_status.mem / (1024 * 1024))} MB</strong></span>
                                     {drawSparkline(dep.history, 'mem', dep.memory || 1024, 'var(--accent-info)')}
                                   </div>
                                 </div>
                               ) : (
                                 <span style={{ color: 'var(--text-muted)' }}>—</span>
                               )}
                             </td>

                             {/* Actions */}
                             <td style={{ padding: '1.25rem 0.75rem', textAlign: 'right' }}>
                               <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                 <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }} onClick={() => viewLogs(dep.id)} title="View Build/Terraform Logs">
                                   <Icons.ExternalLink /> Logs
                                 </button>
                                 {dep.status === 'active' && (
                                   <button className="btn btn-secondary" title="Manage Snapshots" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }} onClick={() => openSnapshotsModal(dep)}>
                                     📸 Snapshots
                                   </button>
                                 )}
                                 {dep.archived ? (
                                   <button className="btn btn-secondary" title="Restore from archive" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }} onClick={() => handleUnarchive(dep.id)}>
                                     <Icons.FolderOpen /> Restore
                                   </button>
                                 ) : (
                                   (dep.status === 'failed' || dep.status === 'destroyed') && (
                                     <button className="btn btn-secondary" title="Archive" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }} onClick={() => handleArchive(dep.id)}>
                                       <Icons.Archive /> Archive
                                     </button>
                                   )
                                 )}
                                 {dep.status !== 'destroyed' && dep.status !== 'destroying' && (
                                   <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }} onClick={() => handleDestroy(dep.id)} title="Destroy Container">
                                     <Icons.Trash />
                                   </button>
                                 )}
                               </div>
                             </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Showing {filteredDeployments.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeployments.length)} of {filteredDeployments.length} deployments
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', height: '36px' }}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: '0.9rem', color: '#fff', padding: '0 0.75rem' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', height: '36px' }}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic log viewer overlay */}
            {activeLogId && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff' }}>Terraform Console Pipeline Logs</h3>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setActiveLogId(null)}>Close</button>
                  </div>
                  <pre style={{
                    flex: 1,
                    background: '#04060b',
                    padding: '1.5rem',
                    color: '#86efac',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.4'
                  }}>
                    {logContent}
                  </pre>
                </div>
              </div>
            )}

            {/* Dynamic snapshots manager overlay */}
            {selectedSnapshotDep && (
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: '#fff', margin: 0 }}>Snapshots: {selectedSnapshotDep.hostname}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CT ID: {selectedSnapshotDep.vm_id}</span>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setSelectedSnapshotDep(null)}>Close</button>
                  </div>
                  
                  <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Create Snapshot Form */}
                    <form onSubmit={handleCreateSnapshot} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.015)' }}>
                      <h4 style={{ color: 'var(--accent-primary)', margin: 0 }}>Create New Snapshot</h4>
                      <div className="form-row">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Snapshot Name</label>
                          <input type="text" required placeholder="e.g. pre_upgrade" className="form-control" value={newSnapshotName} onChange={(e) => setNewSnapshotName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                          <input type="text" placeholder="e.g. before apt upgrade" className="form-control" value={newSnapshotDesc} onChange={(e) => setNewSnapshotDesc(e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}>
                        Create Snapshot
                      </button>
                    </form>

                    {/* Snapshots List */}
                    <div>
                      <h4 style={{ color: '#fff', marginBottom: '0.75rem' }}>Snapshot History</h4>
                      {isSnapshotsLoading ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading snapshots...</div>
                      ) : snapshots.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>No snapshots exist for this container.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {snapshots.map(snap => {
                            const isCurrent = snap.name === 'current';
                            return (
                              <div key={snap.name} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isCurrent ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)', borderColor: isCurrent ? 'var(--accent-primary)' : 'var(--glass-border)' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{snap.name}</strong>
                                    {isCurrent && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '3px', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600 }}>Active</span>}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                    {snap.comment || 'No description'} 
                                    {snap.snaptime && ` • ${new Date(snap.snaptime * 1000).toLocaleString()}`}
                                  </div>
                                </div>
                                {!isCurrent && (
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleRollbackSnapshot(snap.name)}>
                                      Rollback
                                    </button>
                                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleDeleteSnapshot(snap.name)}>
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Settings Page */}
        {activeTab === 'settings' && (
          <div className="glass-panel fade-in" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Configuration Settings</h2>
            
            {/* Settings Sub-Tabs Navigation */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0, 0, 0, 0.15)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button type="button" className={`nav-tab-btn ${settingsSubTab === 'credentials' ? 'active' : ''}`} onClick={() => setSettingsSubTab('credentials')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                🔑 API Credentials
              </button>
              <button type="button" className={`nav-tab-btn ${settingsSubTab === 'policies' ? 'active' : ''}`} onClick={() => setSettingsSubTab('policies')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                ⚙️ Defaults & Policies
              </button>
              <button type="button" className={`nav-tab-btn ${settingsSubTab === 'templates' ? 'active' : ''}`} onClick={() => setSettingsSubTab('templates')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                📦 Template Manager
              </button>
              <button type="button" className={`nav-tab-btn ${settingsSubTab === 'ssh' ? 'active' : ''}`} onClick={() => setSettingsSubTab('ssh')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                💻 Default SSH Keys
              </button>
              <button type="button" className={`nav-tab-btn ${settingsSubTab === 'theme' ? 'active' : ''}`} onClick={() => setSettingsSubTab('theme')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                🖥️ Visual Theme
              </button>
            </div>

            <form onSubmit={handleSaveConfig}>
               {/* Section 1: API Connection */}
               {settingsSubTab === 'credentials' && (
                 <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   <div className="form-group" style={{ marginBottom: 0 }}>
                     <label className="form-label">Proxmox API Gateway Hostname or IP Address URL</label>
                     <input type="text" required placeholder="https://192.168.1.100:8006/api2/json" className="form-control" value={config.pm_api_url} onChange={(e) => setConfig({ ...config, pm_api_url: e.target.value })} />
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Ensure the URL points to your Proxmox API node endpoint. Default port is 8006.</span>
                   </div>

                   <div className="form-row">
                     <div className="form-group" style={{ marginBottom: 0 }}>
                       <label className="form-label">Proxmox API Token ID</label>
                       <input type="text" placeholder="e.g. root@pam!terraform" className="form-control" value={config.pm_api_token_id} onChange={(e) => setConfig({ ...config, pm_api_token_id: e.target.value })} />
                     </div>
                     <div className="form-group" style={{ marginBottom: 0 }}>
                       <label className="form-label">Proxmox API Token Secret</label>
                       <input type="password" placeholder="••••••••••••" className="form-control" value={config.pm_api_token_secret} onChange={(e) => setConfig({ ...config, pm_api_token_secret: e.target.value })} />
                     </div>
                   </div>

                   <div className="form-row">
                     <div className="form-group" style={{ marginBottom: 0 }}>
                       <label className="form-label">Target Proxmox Node Name</label>
                       <input type="text" required placeholder="e.g. pve" className="form-control" value={config.node_name} onChange={(e) => setConfig({ ...config, node_name: e.target.value })} />
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>The actual name of the Proxmox host (e.g. pve), NOT the IP address.</span>
                     </div>
                     <div className="form-group" style={{ marginBottom: 0 }}>
                       <label className="form-label">CT Template Storage Pool Name</label>
                       <input type="text" required placeholder="e.g. local" className="form-control" value={config.template_storage} onChange={(e) => setConfig({ ...config, template_storage: e.target.value })} />
                     </div>
                     <div className="form-group" style={{ marginBottom: 0 }}>
                       <label className="form-label">Default Network Bridge</label>
                       <input type="text" required placeholder="e.g. vmbr0" className="form-control" value={config.default_bridge} onChange={(e) => setConfig({ ...config, default_bridge: e.target.value })} />
                     </div>
                   </div>
                 </div>
               )}

               {/* Section 2: Policies & Defaults */}
               {settingsSubTab === 'policies' && (
                 <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div>
                     <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Resource Exclusions</h3>
                     <div className="form-row">
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Excluded Storage Pools</label>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Select storage pools to hide them from the Deploy storage dropdowns.</span>
                         
                         {isAllResourcesLoading ? (
                           <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scanning Proxmox storage pools...</div>
                         ) : (
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                             {allStorages.map(st => {
                               const isExcluded = (config.excluded_storages || '')
                                 .split(',')
                                 .map(s => s.trim().toLowerCase())
                                 .includes(st.name.toLowerCase());
                               return (
                                 <button
                                   key={st.name}
                                   type="button"
                                   onClick={() => {
                                     const currentList = (config.excluded_storages || '')
                                       .split(',')
                                       .map(s => s.trim())
                                       .filter(Boolean);
                                     let newList;
                                     if (isExcluded) {
                                       newList = currentList.filter(s => s.toLowerCase() !== st.name.toLowerCase());
                                     } else {
                                       newList = [...currentList, st.name];
                                     }
                                     setConfig({ ...config, excluded_storages: newList.join(',') });
                                   }}
                                   style={{
                                     background: isExcluded ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                                     border: isExcluded ? '1px solid var(--accent-error)' : '1px solid rgba(16, 185, 129, 0.3)',
                                     borderRadius: 'var(--radius-sm)',
                                     padding: '0.35rem 0.75rem',
                                     color: '#fff',
                                     fontSize: '0.8rem',
                                     cursor: 'pointer',
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: '0.35rem',
                                     transition: 'all 0.2s ease'
                                   }}
                                 >
                                   <span style={{
                                     width: '6px',
                                     height: '6px',
                                     borderRadius: '50%',
                                     background: isExcluded ? 'var(--accent-error)' : 'var(--accent-success)'
                                   }}></span>
                                   {st.name} <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>({st.type})</span>
                                 </button>
                               );
                             })}
                             {allStorages.length === 0 && (
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No storages found. Configure credentials and check network state.</span>
                             )}
                           </div>
                         )}
                         <input type="hidden" name="excluded_storages" value={config.excluded_storages || ''} />
                       </div>

                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Excluded Network Bridges</label>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Select network bridges to hide them from the Deploy bridge dropdowns.</span>
                         
                         {isAllResourcesLoading ? (
                           <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scanning network interfaces...</div>
                         ) : (
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                             {allBridges.map(br => {
                               const isExcluded = (config.excluded_bridges || '')
                                 .split(',')
                                 .map(b => b.trim().toLowerCase())
                                 .includes(br.name.toLowerCase());
                               return (
                                 <button
                                   key={br.name}
                                   type="button"
                                   onClick={() => {
                                     const currentList = (config.excluded_bridges || '')
                                       .split(',')
                                       .map(b => b.trim())
                                       .filter(Boolean);
                                     let newList;
                                     if (isExcluded) {
                                       newList = currentList.filter(b => b.toLowerCase() !== br.name.toLowerCase());
                                     } else {
                                       newList = [...currentList, br.name];
                                     }
                                     setConfig({ ...config, excluded_bridges: newList.join(',') });
                                   }}
                                   style={{
                                     background: isExcluded ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                                     border: isExcluded ? '1px solid var(--accent-error)' : '1px solid rgba(16, 185, 129, 0.3)',
                                     borderRadius: 'var(--radius-sm)',
                                     padding: '0.35rem 0.75rem',
                                     color: '#fff',
                                     fontSize: '0.8rem',
                                     cursor: 'pointer',
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: '0.35rem',
                                     transition: 'all 0.2s ease'
                                   }}
                                 >
                                   <span style={{
                                     width: '6px',
                                     height: '6px',
                                     borderRadius: '50%',
                                     background: isExcluded ? 'var(--accent-error)' : 'var(--accent-success)'
                                   }}></span>
                                   {br.name} {br.comment ? <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>({br.comment})</span> : ''}
                                 </button>
                               );
                             })}
                             {allBridges.length === 0 && (
                               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No network bridges found. Configure credentials and check network state.</span>
                             )}
                           </div>
                         )}
                         <input type="hidden" name="excluded_bridges" value={config.excluded_bridges || ''} />
                       </div>
                     </div>
                   </div>

                   <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />

                   <div>
                     <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Default Deployment Resources</h3>
                     <div className="form-row" style={{ marginBottom: '1rem' }}>
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default CPU Cores</label>
                         <input type="number" className="form-control" min="1" max="64" value={config.default_cpu_cores !== undefined ? config.default_cpu_cores : 1} onChange={(e) => setConfig({ ...config, default_cpu_cores: parseInt(e.target.value) || 1 })} />
                       </div>
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default RAM (MB)</label>
                         <input type="number" className="form-control" min="256" step="128" value={config.default_memory !== undefined ? config.default_memory : 1024} onChange={(e) => setConfig({ ...config, default_memory: parseInt(e.target.value) || 1024 })} />
                       </div>
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default Swap (MB)</label>
                         <input type="number" className="form-control" min="0" step="128" value={config.default_swap !== undefined ? config.default_swap : 512} onChange={(e) => setConfig({ ...config, default_swap: parseInt(e.target.value) || 512 })} />
                       </div>
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default Disk Size (GB)</label>
                         <input type="number" className="form-control" min="1" value={config.default_disk_size !== undefined ? config.default_disk_size : 8} onChange={(e) => setConfig({ ...config, default_disk_size: parseInt(e.target.value) || 8 })} />
                       </div>
                     </div>

                     <div className="form-row">
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default DNS Server</label>
                         <input type="text" placeholder="e.g. 1.1.1.1" className="form-control" value={config.default_dns_server || ''} onChange={(e) => setConfig({ ...config, default_dns_server: e.target.value })} />
                       </div>
                       <div className="form-group" style={{ marginBottom: 0 }}>
                         <label className="form-label">Default Search Domain</label>
                         <input type="text" placeholder="e.g. local.lan" className="form-control" value={config.default_dns_domain || ''} onChange={(e) => setConfig({ ...config, default_dns_domain: e.target.value })} />
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* Section 3: Template Downloader */}
               {settingsSubTab === 'templates' && (
                 <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.015)', position: 'relative', zIndex: 10 }}>
                     <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Download Container Templates</h3>
                     <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1.25rem' }}>
                       Download official container OS templates from Proxmox repositories directly to your template storage pool.
                     </span>
                     
                     <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                       <div className="form-group" style={{ flex: 1, margin: 0 }}>
                         <label className="form-label" style={{ fontSize: '0.75rem' }}>OS Template Catalog</label>
                         <SearchableSelect
                           options={aplinfoTemplates.map(item => ({
                             value: item.template,
                             label: `[${item.section}] ${item.headline || item.template} (v${item.version})`
                           }))}
                           value={selectedDownloadTemplate}
                           onChange={setSelectedDownloadTemplate}
                           placeholder="-- Choose a template to download --"
                           disabled={isDownloadingTemplate || !config.pm_api_url}
                         />
                       </div>

                       <button
                         type="button"
                         disabled={isDownloadingTemplate || !config.pm_api_url}
                         className="btn btn-primary"
                         style={{ height: '42px', padding: '0 1.5rem', flexShrink: 0 }}
                         onClick={() => {
                           const templateVal = selectedDownloadTemplate;
                           const storageVal = config.template_storage || 'local';
                           if (!templateVal) {
                             showNotification('Please select a template to download first.', 'error');
                             return;
                           }
                           setIsDownloadingTemplate(true);

                           const node = config.node_name || 'pve';
                           fetch(`${API_BASE}/proxmox/apldownload/${node}`, {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({ template: templateVal, storage: storageVal })
                           })
                             .then(res => res.json())
                             .then(data => {
                               if (data.success) {
                                 showNotification('Template download task initiated on Proxmox cluster!');
                                 loadProxmoxData();
                               } else {
                                 showNotification(data.error || 'Failed to start download task.', 'error');
                               }
                             })
                             .catch(() => showNotification('Error initiating template download.', 'error'))
                             .finally(() => setIsDownloadingTemplate(false));
                         }}
                       >
                         {isDownloadingTemplate ? 'Downloading...' : 'Download Template'}
                       </button>
                     </div>
                   </div>

                   <div>
                     <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.75rem' }}>Downloaded Container Templates</h4>
                     <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)' }}>
                       {isTemplatesLoading ? (
                         <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading templates...</div>
                       ) : templates.length === 0 ? (
                         <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No container templates downloaded yet on storage pool. Use catalog above to download one.</div>
                       ) : (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                           {templates.map(tmpl => {
                             const name = tmpl.volid.split('/').pop();
                             return (
                               <div key={tmpl.volid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                 <div>
                                   <div style={{ fontWeight: 500, color: '#fff', fontSize: '0.85rem' }}>{name}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Storage: {tmpl.volid.split(':')[0]} • Size: {formatBytes(tmpl.size)}</div>
                                 </div>
                                 <button
                                   type="button"
                                   className="btn btn-danger"
                                   title="Delete template from storage"
                                   style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                   onClick={() => handleDeleteTemplate(tmpl.volid)}
                                 >
                                   <Icons.Trash /> Delete
                                 </button>
                               </div>
                             );
                           })}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               )}

               {/* Section 4: Default SSH Keys */}
               {settingsSubTab === 'ssh' && (
                 <div className="form-group fade-in" style={{ marginBottom: 0 }}>
                   <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Default SSH Public Keys</h3>
                   <label className="form-label">SSH Public Keys (One per line)</label>
                   <textarea rows="6" className="form-control" placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC..." value={config.default_ssh_keys || ''} onChange={(e) => setConfig({ ...config, default_ssh_keys: e.target.value })} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}></textarea>
                 </div>
               )}

               {/* Section 5: Visual Theme Customizer */}
               {settingsSubTab === 'theme' && (
                 <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                   <div>
                     <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Visual Theme Presets</h3>
                     <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1.25rem' }}>
                       Select a visual personality gradient and glassmorphism transparency style for Gantry.
                     </span>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                       {[
                         { id: 'space', name: '🌌 Deep Space', desc: 'Indigo & Slate' },
                         { id: 'violet', name: '⚛️ Cybernetic Violet', desc: 'Purple & Violet Glow' },
                         { id: 'cyberpunk', name: '⚡ Obsidian Cyberpunk', desc: 'Obsidian & Neon Rose' }
                       ].map(t => (
                         <div
                           key={t.id}
                           onClick={() => setSelectedTheme(t.id)}
                           style={{
                             padding: '1.25rem',
                             background: selectedTheme === t.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                             border: selectedTheme === t.id ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                             borderRadius: 'var(--radius-md)',
                             cursor: 'pointer',
                             textAlign: 'center',
                             transition: 'all 0.2s ease',
                             boxShadow: selectedTheme === t.id ? '0 0 15px rgba(99,102,241,0.2)' : 'none'
                           }}
                         >
                           <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t.name}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.desc}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />

                   <div>
                     <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Glassmorphism Intensity</h3>
                     <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1.25rem' }}>
                       Adjust the backdrop blur radius density to control UI transparency.
                     </span>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <input
                         type="range"
                         min="0"
                         max="24"
                         step="2"
                         value={blurIntensity}
                         onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                         style={{
                           flex: 1,
                           height: '6px',
                           borderRadius: '3px',
                           background: 'rgba(255,255,255,0.1)',
                           outline: 'none',
                           cursor: 'pointer'
                         }}
                       />
                       <span style={{
                         fontFamily: 'monospace',
                         fontSize: '1rem',
                         fontWeight: 'bold',
                         color: 'var(--accent-primary)',
                         background: 'rgba(99,102,241,0.1)',
                         padding: '0.25rem 0.75rem',
                         borderRadius: 'var(--radius-sm)',
                         border: '1px solid rgba(99,102,241,0.2)'
                       }}>
                         {blurIntensity}px
                       </span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Action Footer Buttons */}
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                 <button type="button" className="btn btn-danger" onClick={handleClearConfig} style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.25) 100%)', border: '1px solid var(--accent-error)', boxShadow: 'none' }}>
                   Clear All Settings
                 </button>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <button type="button" disabled={isTestingConfig} className="btn btn-secondary" onClick={handleTestConfig}>
                     {isTestingConfig ? 'Testing...' : 'Test Connection'}
                   </button>
                   <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 2rem' }}>
                     Save Changes
                   </button>
                 </div>
               </div>
            </form>
          </div>
        )}

      </main>

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ {confirmDialog.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={confirmDialog.onConfirm}>
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Detailed Deployment Drawer */}
      <div className={`slide-drawer ${selectedDrawerDep ? 'open' : ''}`}>
        {selectedDrawerDep && (
          <>
            <div className="drawer-header">
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0 }}>
                  Container Details
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ID: {selectedDrawerDep.id}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setSelectedDrawerDep(null)}
              >
                Close
              </button>
            </div>
            
            <div className="drawer-body">
              {/* Core Parameters */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  System Configuration
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Hostname</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.hostname}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>VM ID</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.vm_id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Target Node</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.target_node}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CPU Cores</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.cpu_cores} Cores</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>RAM / Memory</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.memory} MB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Storage Pool</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.disk_storage}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Disk Size</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.disk_size} GB</span>
                  </div>
                </div>
              </div>

              <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: 0 }} />

              {/* Networking Config */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  Networking Interfaces
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Bridge</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.network?.bridge || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>IPv4 Allocation</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>
                      {selectedDrawerDep.network?.type === 'static' ? 'Static IP' : 'DHCP (Auto)'}
                    </span>
                  </div>
                  {selectedDrawerDep.network?.type === 'static' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>IPv4 Address</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.network?.ip}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Gateway</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.network?.gateway}</span>
                      </div>
                    </>
                  )}
                  {selectedDrawerDep.network?.vlan && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>VLAN Tag</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{selectedDrawerDep.network.vlan}</span>
                    </div>
                  )}
                </div>
              </div>

              <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: 0 }} />

              {/* Provisioning Details */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  Provisioning Profile
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '0.35rem' }}>Preconfigured Apps</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {selectedDrawerDep.predefined_apps && selectedDrawerDep.predefined_apps.length > 0 ? (
                        selectedDrawerDep.predefined_apps.map(app => (
                          <span key={app} style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {app}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None selected</span>
                      )}
                    </div>
                  </div>
                  
                  {selectedDrawerDep.custom_script && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '0.35rem' }}>Custom Script</span>
                      <pre style={{ margin: 0, padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.75rem', fontFamily: 'monospace', color: '#10b981', maxHeight: '120px' }}>
                        {selectedDrawerDep.custom_script}
                      </pre>
                    </div>
                  )}

                  {selectedDrawerDep.ssh_keys && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '0.35rem' }}>Authorized SSH Keys</span>
                      <pre style={{ margin: 0, padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', maxHeight: '80px' }}>
                        {selectedDrawerDep.ssh_keys}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="drawer-footer">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem' }}
                onClick={() => setSelectedDrawerDep(null)}
              >
                Close Drawer
              </button>
              {selectedDrawerDep.status !== 'destroyed' && selectedDrawerDep.status !== 'destroying' && (
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1.25rem' }}
                  onClick={() => {
                    setSelectedDrawerDep(null);
                    handleDestroy(selectedDrawerDep.id);
                  }}
                >
                  Destroy LXC
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Animated Deployment Pipeline Modal */}
      {selectedPipelineDep && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>
                  Deployment Pipeline
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Hostname: {selectedPipelineDep.hostname} (vmid: {selectedPipelineDep.vm_id})
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setSelectedPipelineDep(null)}
              >
                Dismiss
              </button>
            </div>

            {/* Steps Track */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1rem' }}>
              {/* Vertical connecting line */}
              <div style={{
                position: 'absolute',
                left: '23px',
                top: '15px',
                bottom: '15px',
                width: '2px',
                background: 'rgba(255, 255, 255, 0.08)',
                zIndex: 1
              }} />

              {(deployingLogs[selectedPipelineDep.id] || [
                { id: 1, name: 'Initializing Workspace', status: 'active' },
                { id: 2, name: 'Checking OS Template', status: 'pending' },
                { id: 3, name: 'Allocating System Resources', status: 'pending' },
                { id: 4, name: 'Configuring Network Interface', status: 'pending' },
                { id: 5, name: 'Running Post-Install Provisioning', status: 'pending' }
              ]).map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';
                const isFailed = step.status === 'failed';
                
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 2, position: 'relative' }}>
                    {/* Circle Indicator */}
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--accent-success)' :
                                  isActive ? 'rgba(99, 102, 241, 0.1)' :
                                  isFailed ? 'var(--accent-error)' :
                                  '#080a10',
                      border: isCompleted ? '2px solid var(--accent-success)' :
                              isActive ? '2px solid var(--accent-primary)' :
                              isFailed ? '2px solid var(--accent-error)' :
                              '2px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? 'var(--accent-primary)' :
                             isActive ? 'var(--accent-primary)' :
                             isFailed ? '#fff' :
                             'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      boxShadow: isActive ? '0 0 12px rgba(99,102,241,0.3)' : 'none'
                    }}>
                      {isCompleted ? '✓' : isFailed ? '✗' : isActive ? '●' : step.id}
                    </div>

                    {/* Step Name */}
                    <div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isActive || isCompleted ? '#fff' : 'var(--text-secondary)',
                        transition: 'color 0.3s ease'
                      }}>
                        {step.name}
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: isCompleted ? 'var(--accent-success)' :
                               isActive ? 'var(--accent-primary)' :
                               isFailed ? 'var(--accent-error)' :
                               'var(--text-muted)'
                      }}>
                        {isCompleted ? 'Completed' :
                         isActive ? 'Processing...' :
                         isFailed ? 'Failed' :
                         'Waiting...'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setSelectedPipelineDep(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
