<p align="center">
  <img src="frontend/public/favicon.svg" alt="Gantry Logo" width="120" />
</p>

# Gantry

**Gantry** is an internal web-based application designed to run on a Proxmox LXC container. It allows you to dynamically deploy new LXC containers on Proxmox cluster hosts by inputting system configurations (CPU, RAM, Swap, Disks, Extra Disks, Networking) and generating/executing Terraform pipelines on-demand.

The interface is built using a modern, premium **dark-themed glassmorphism** style with dynamic layouts, status reporting, and terminal log integration.

---

## Key Features & Visual Upgrades

* **Dynamic Glassmorphic Themes**: Custom visualization options in the **Visual Theme** settings sub-tab, including presets: `Deep Space`, `Cybernetic Violet`, and `Obsidian Cyberpunk` with adjustable background blur density (`0px` to `24px`).
* **Visual OS Template Cards**: Displays beautiful container operating system selection cards dynamically mapping Linux distributions with distinct visual colors and icons.
* **Double Resource Sizing Gauges**:
  - **Gantry Footprint Only**: Displays CPU, RAM, and Disk space allocated by Gantry.
  - **Physical Cluster Load**: Displays total allocated resources across the entire Proxmox cluster environment (including virtual machines/containers created outside of Gantry).
  - **4:1 CPU Overcommit Bound**: Automatically calculates vCPU headroom based on a `4:1` virtual-to-physical cores ratio (`clusterCPU * 4`) across the cluster nodes.
* **Live Deployment Pipeline Tracker**: Features an animated modal progress bar that scans and parses active logs to present task milestones in real-time.
* **Details Side-Drawer**: Quick configuration parameters overlay for each container deployment on row-click.

---

## Architecture & How It Works

1. **Frontend (Vite + React)**: The user interface where you configure your LXC settings, review deployed containers, view real-time resource stats, and read live build logs.
2. **Backend (Express)**: Exposes APIs to query Proxmox VE templates and storages, saves deployment logs, manages state files per container, and spawns the local `terraform` CLI wrapper.
3. **Terraform**: The backend dynamically writes `main.tf` files for each deployment into isolated folders under `/backend/deployments/lxc-<vm_id>-<timestamp>/`. It executes `terraform init` and `terraform apply -auto-approve` inside these isolated directories, ensuring that state files (`terraform.tfstate`) are kept completely separate and local.

---

## LXC Host Recommendations & Sizing

To host this application in a Proxmox LXC container, we suggest the following hardware configuration:

* **CPU**: **1 to 2 vCPUs** (Express and Vite have minimal CPU usage. CPU usage only spikes briefly during Terraform execution).
* **RAM**: **512 MB to 1 GB** (Node.js processes consume ~100MB combined; 1GB leaves comfortable headroom for OS caching and parallel Terraform executions).
* **Disk Setup**:
  - **Root Disk (`/`)**: **4 GB to 5 GB** (sufficient for Debian/Ubuntu OS, Node.js, and Terraform CLI binaries).
  - **Secondary Disk (`/data`)**: **5 GB to 10 GB** mounted inside the container. We recommend running the application and storing state files (`backend/deployments/` and `backend/db.json`) on this drive to separate operational data from the OS.

### Optimization: Terraform Plugin Caching
Because the backend runs `terraform init` independently for every container deployment, it will download the Proxmox provider binary (~100MB) each time. To avoid consuming massive disk space, set up a global provider cache directory in `/data`:

1. Create a cache folder:
   ```bash
   mkdir -p /data/.terraform.d/plugin-cache
   ```
2. Export the environment variable (add this to `/etc/environment` or your backend startup environment):
   ```bash
   TF_PLUGIN_CACHE_DIR="/data/.terraform.d/plugin-cache"
   ```
   *Terraform will now download the provider only once and symlink it for all future containers.*

---

## Prerequisites

1. **Node.js** (v18+) and **npm** installed.
2. **Terraform CLI** installed on the hosting environment (i.e. inside the LXC container where this app runs) and available in the system PATH.
3. **Proxmox VE API Token**:
   You can quickly configure the user, role, and token by running commands on your **Proxmox Host Shell** or through the Proxmox Web UI.

   #### Method A: Proxmox Host CLI (Recommended)
   Run these commands inside your main Proxmox VE node shell:
   ```bash
   # 1. Create a custom role with required permissions for LXC deployment, snapshots, and downloads
   pveum roleadd TerraformLXC -privs "VM.Allocate VM.Config.CPU VM.Config.Memory VM.Config.Disk VM.Config.Network VM.Config.Options VM.Audit VM.PowerMgmt Datastore.AllocateSpace Datastore.Audit Datastore.AllocateTemplate Datastore.Allocate SDN.Use Sys.Config Sys.Audit Sys.Modify VM.Snapshot VM.Snapshot.Rollback"

   # 2. Create the deployer user under the PVE realm
   pveum useradd terraform@pve -password YourSecurePassword

   # 3. Assign the user to the role at the cluster root level (/)
   pveum aclmod / -user terraform@pve -role TerraformLXC

   # 4. Generate the API Token for the user
   pveum usertokenadd terraform@pve gantry --privsep 0
   ```
   *Take note of the Token ID (`terraform@pve!gantry`) and the secret key generated by the final command. You will paste these into the Settings tab of the web app.*

   #### Method B: Proxmox Web UI
   1. **Create Role**: Go to **Datacenter** -> **Permissions** -> **Roles** and click **Create**.
      - Name: `TerraformLXC`
      - Select privileges: `VM.Allocate`, `VM.Config.CPU`, `VM.Config.Memory`, `VM.Config.Disk`, `VM.Config.Network`, `VM.Config.Options`, `VM.Audit`, `VM.PowerMgmt`, `Datastore.AllocateSpace`, `Datastore.Audit`, `Datastore.AllocateTemplate`, `Datastore.Allocate`, `SDN.Use`, `Sys.Config`, `Sys.Audit`, `Sys.Modify`, `VM.Snapshot`, `VM.Snapshot.Rollback`.
   2. **Create User**: Go to **Datacenter** -> **Permissions** -> **Users** and click **Add**.
      - User name: `terraform`, Realm: `pve`, set a password.
   3. **Assign Permissions**: Go to **Datacenter** -> **Permissions** -> click **Add** -> **User Permission**.
      - Path: `/`, User: `terraform@pve`, Role: `TerraformLXC`.
   4. **Create API Token**: Click on the `terraform@pve` user, select **API Tokens** -> click **Add**.
      - Token ID: `gantry`.
      - Uncheck **Require Privilege Separation** (recommended so the token inherits the user's role).
      - Copy the secret token key shown on screen.

---

## Ubuntu 24.04 LXC Provisioning Commands

If you are setting this up inside a fresh **Ubuntu 24.04 LXC container**, run the following commands sequentially to update the system and install all runtime prerequisites:

### 1. Update and Upgrade LXC Packages
```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl wget gpg lsb-release ca-certificates
```

### 2. Install Node.js 20 & npm
```bash
# Add NodeSource APT repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js package
apt-get install -y nodejs
```

### 3. Install Terraform CLI
```bash
# Add HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Add HashiCorp repository configuration
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list

# Update lists and install Terraform
apt-get update && apt-get install -y terraform
```

### 4. Verify Installations
Ensure everything is correctly placed in your PATH:
```bash
node -v
npm -v
terraform -v
```


---

## Getting Started

### 1. Install Dependencies
Run the helper script in the root directory to install dependencies for the root orchestrator, backend, and frontend:
```powershell
npm run install:all
```

### 2. Run in Development Mode
To start both the frontend and backend servers concurrently, run:
```powershell
npm run dev
```
- **Frontend** will be accessible at: `http://localhost:5173`
- **Backend API** will run at: `http://localhost:5000`

---

## Configuration & Usage

1. Open `http://localhost:5173` in your browser.
2. Go to the **Settings** tab.
3. Input your Proxmox API Gateway URL (e.g., `https://10.0.0.10:8006/api2/json`), API Token ID, and Secret.
4. Set the default node name and storage name.
5. Click **Save Changes** and click **Test Connection**. Once successful, the app will automatically populate the dropdowns in the Deploy tab.
6. Configure **Resource Exclusions** (selectively hide storage pools or network bridges from dropdown menus) and default deployment sizes (cores, RAM, disk, DNS, and default SSH keys).
7. Use the **Clear All Settings** button if you want to wipe local configuration parameters and reset to factory defaults.