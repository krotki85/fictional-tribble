# Simple CMMS System for Raspberry Pi 5

A lightweight Computerized Maintenance Management System designed to run on Raspberry Pi 5 over LAN.

## Features

- 📋 **Machine Inventory**: Keep track of all your equipment
- 🔲 **QR Code Generation**: Generate and print QR codes for each machine
- 📱 **Mobile-Friendly Reporting**: Quick malfunction reporting from any mobile device
- 💾 **Local Storage**: All data stored locally using SQLite (no cloud required)
- 🖨️ **Printable QR Codes**: Print QR codes to attach to equipment
- 📊 **Dashboard**: Overview of all machines and pending reports

## Installation on Raspberry Pi 5

### Prerequisites

- Raspberry Pi 5 with Raspberry Pi OS installed
- Node.js 18+ installed
- Network connection (LAN)

### Setup Instructions

1. **Install Node.js** (if not already installed):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone or copy this project to your Raspberry Pi**:
```bash
cd ~
# Copy your project files here
```

3. **Install dependencies**:
```bash
cd /path/to/project
npm install
```

4. **Set up environment variables** (optional):
Create a `.env.local` file for custom configuration:
```bash
# Optional: Set custom base URL for QR codes
# If not set, defaults to http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
```

Replace `192.168.1.100` with your Raspberry Pi's actual IP address on your LAN.

5. **Build the application**:
```bash
npm run build
```

6. **Start the application**:
```bash
npm start
```

The application will be available at `http://localhost:3000` or `http://YOUR_PI_IP:3000`

### Running as a Service (Optional)

To make the application start automatically on boot:

1. Create a systemd service file:
```bash
sudo nano /etc/systemd/system/cmms.service
```

2. Add the following content (adjust paths as needed):
```ini
[Unit]
Description=CMMS System
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/cmms
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:
```bash
sudo systemctl enable cmms.service
sudo systemctl start cmms.service
```

4. Check status:
```bash
sudo systemctl status cmms.service
```

## Usage Guide

### Adding a Machine

1. Go to the dashboard
2. Click "Add Machine" 
3. Fill in the machine details:
   - Name (required)
   - Description (optional)
   - Location (optional)
   - Serial Number (optional)
4. Click "Add Machine"

### Generating QR Codes

1. Navigate to "View All Machines"
2. Click on a machine
3. You'll see the QR code on the right side
4. Click "Print QR Code" to open a print-friendly page
5. Print and attach the QR code to the physical machine

### Reporting Malfunctions

**From Mobile Phone:**
1. Scan the QR code attached to the machine
2. Fill in the issue description
3. Optionally add your name and contact info
4. Submit the report

**From Web Browser:**
1. Navigate to the machine details page
2. Click "Report Malfunction"
3. Fill in the form and submit

### Managing Reports

1. View pending reports on the dashboard
2. Click on a machine to see all its reports
3. Update report status:
   - Pending (default)
   - In Progress
   - Resolved

## Network Access

To access the system from mobile devices on your LAN:

1. Find your Raspberry Pi's IP address:
```bash
hostname -I
```

2. On your mobile device, open a browser and navigate to:
```
http://YOUR_PI_IP:3000
```

3. Bookmark this page for quick access, or scan QR codes directly

## Data Storage

- All data is stored in a local SQLite database (`cmms.db`)
- The database is automatically created on first run
- Database location: project root directory
- To backup: simply copy the `cmms.db` file
- To reset: delete `cmms.db` and restart the application

## Troubleshooting

### Cannot access from mobile device

1. Check if Raspberry Pi firewall allows port 3000:
```bash
sudo ufw allow 3000
```

2. Verify the Pi is accessible on the network:
```bash
ping YOUR_PI_IP
```

### QR codes not working

1. Make sure `NEXT_PUBLIC_BASE_URL` in `.env.local` is set to your Pi's IP
2. Rebuild the application after changing environment variables:
```bash
npm run build
npm start
```

### Database locked error

If you see "database is locked", restart the application:
```bash
# If running manually, press Ctrl+C and restart
npm start

# If running as service
sudo systemctl restart cmms.service
```

## Tech Stack

- **Framework**: Next.js 16 (React)
- **Database**: SQLite (via better-sqlite3)
- **QR Codes**: qrcode library
- **Styling**: Tailwind CSS
- **Runtime**: Node.js

## Development

To run in development mode:

```bash
npm run dev
```

Then open http://localhost:3000

## License

Free to use for personal and commercial projects.
