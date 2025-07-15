# System Dependencies Installation Guide

This guide covers how to install the required system dependencies (poppler-utils) for the n8n PDF to Image node.

## 🚀 Quick Start (Automated Installation)

We provide automated setup scripts for easy installation:

### Linux/macOS
```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/guziakas/n8n-pdf2image/main/setup-poppler.sh | bash

# Or if you have the package installed:
./node_modules/n8n-nodes-pdf2image/setup-poppler.sh
```

### Windows (PowerShell)
```powershell
# Download and run the setup script
iwr -useb https://raw.githubusercontent.com/guziakas/n8n-pdf2image/main/setup-poppler.ps1 | iex

# Or if you have the package installed:
./node_modules/n8n-nodes-pdf2image/setup-poppler.ps1
```

## 📖 Manual Installation Instructions

### 🐳 Docker n8n (Most Common)

If you're running n8n in Docker, you need to create a custom Docker image:

#### Option 1: Custom Dockerfile
```dockerfile
FROM n8nio/n8n:latest

# Switch to root to install system packages
USER root

# Install poppler-utils
RUN apk add --no-cache poppler-utils

# Switch back to node user
USER node
```

Build and run:
```bash
docker build -t n8n-with-poppler .
docker run -it --rm --name n8n -p 5678:5678 n8n-with-poppler
```

#### Option 2: Docker Compose
```yaml
version: '3.7'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin
    volumes:
      - n8n_data:/home/node/.n8n
    # Install poppler-utils on container start
    command: sh -c "apk add --no-cache poppler-utils && n8n start"
    user: root

volumes:
  n8n_data:
```

#### Option 3: Multi-stage Docker Build
```dockerfile
FROM n8nio/n8n:latest as base

FROM base as dependencies
USER root
RUN apk add --no-cache poppler-utils

FROM dependencies as final
USER node
COPY --from=base /usr/local/lib/node_modules/n8n /usr/local/lib/node_modules/n8n
```

### 🖥️ Linux Systems

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install poppler-utils

# Verify installation
pdftoppm --version
```

#### Red Hat/CentOS/Fedora
```bash
# RHEL/CentOS 7/8
sudo yum install poppler-utils

# CentOS Stream/RHEL 9
sudo dnf install poppler-utils

# Fedora
sudo dnf install poppler-utils

# Verify installation
pdftoppm --version
```

#### Alpine Linux
```bash
sudo apk add poppler-utils

# Verify installation
pdftoppm --version
```

#### Arch Linux
```bash
sudo pacman -S poppler

# Verify installation
pdftoppm --version
```

### 🍎 macOS

#### Using Homebrew (Recommended)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install poppler
brew install poppler

# Verify installation
pdftoppm --version
```

#### Using MacPorts
```bash
sudo port install poppler

# Verify installation
pdftoppm --version
```

### 🪟 Windows

#### Method 1: Pre-compiled Binaries (Easiest)
1. **Download poppler**: Go to https://github.com/oschwartz10612/poppler-windows/releases
2. **Download** the latest `poppler-xx.xx.x_x64.7z` file
3. **Extract** to `C:\poppler` (or your preferred location)
4. **Add to PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Add `C:\poppler\Library\bin` to your system PATH
   - Restart your terminal/command prompt
5. **Verify**: Open new command prompt and run `pdftoppm --version`

#### Method 2: Using Chocolatey
```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install poppler
choco install poppler

# Verify installation
pdftoppm --version
```

#### Method 3: Using WSL (Windows Subsystem for Linux)
```bash
# Enable WSL and install Ubuntu
wsl --install

# Inside WSL, install poppler
sudo apt update
sudo apt install poppler-utils

# Run n8n in WSL environment
```

### ☁️ Cloud Platforms

#### Self-hosted Cloud (AWS/Azure/GCP)
Use the appropriate Linux installation method based on your distribution:

**Amazon Linux:**
```bash
sudo yum install poppler-utils
```

**Ubuntu on AWS/Azure/GCP:**
```bash
sudo apt update && sudo apt install poppler-utils
```

#### n8n Cloud
❌ **Not supported** - You cannot install system dependencies on n8n Cloud. The node will not work in hosted n8n environments unless they add poppler-utils to their base image.

#### Railway/Heroku/Render
Add a buildpack or use a custom Docker image with poppler-utils pre-installed.

## 🧪 Testing Installation

After installing poppler-utils, verify it works:

```bash
# Test poppler installation
pdftoppm --help

# Should show version and options like:
# pdftoppm version 21.03.0
# Copyright 2005-2021 The Poppler Developers...

# Test with a simple command
echo "✅ poppler-utils installed successfully!"
```

## 🔧 Automated Setup Scripts

### Linux/macOS Setup Script
```bash
#!/bin/bash
# setup-poppler.sh

echo "🔧 Installing poppler-utils for n8n PDF to Image node..."

# Detect OS and install accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v apt &> /dev/null; then
        echo "📦 Installing on Ubuntu/Debian..."
        sudo apt update && sudo apt install -y poppler-utils
    elif command -v yum &> /dev/null; then
        echo "📦 Installing on RHEL/CentOS..."
        sudo yum install -y poppler-utils
    elif command -v dnf &> /dev/null; then
        echo "📦 Installing on Fedora..."
        sudo dnf install -y poppler-utils
    elif command -v apk &> /dev/null; then
        echo "📦 Installing on Alpine..."
        sudo apk add poppler-utils
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📦 Installing on macOS..."
    if command -v brew &> /dev/null; then
        brew install poppler
    else
        echo "❌ Please install Homebrew first: https://brew.sh"
        exit 1
    fi
else
    echo "❌ Unsupported OS. Please install poppler-utils manually."
    exit 1
fi

echo "✅ Testing installation..."
if command -v pdftoppm &> /dev/null; then
    echo "🎉 poppler-utils installed successfully!"
    pdftoppm -v
else
    echo "❌ Installation failed. Please install manually."
    exit 1
fi
```

### PowerShell Setup Script (Windows)
```powershell
# setup-poppler.ps1

Write-Host "🔧 Installing poppler-utils for n8n PDF to Image node..." -ForegroundColor Cyan

# Check if Chocolatey is installed
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "📦 Installing poppler via Chocolatey..." -ForegroundColor Green
    choco install poppler -y
} else {
    Write-Host "❌ Chocolatey not found. Please install manually:" -ForegroundColor Red
    Write-Host "1. Download from: https://github.com/oschwartz10612/poppler-windows/releases" -ForegroundColor Yellow
    Write-Host "2. Extract to C:\poppler" -ForegroundColor Yellow
    Write-Host "3. Add C:\poppler\Library\bin to your PATH" -ForegroundColor Yellow
    exit 1
}

# Test installation
Write-Host "✅ Testing installation..." -ForegroundColor Green
try {
    & pdftoppm --version
    Write-Host "🎉 poppler-utils installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed. Please install manually." -ForegroundColor Red
    exit 1
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"pdftoppm: command not found"**
   - poppler-utils not installed or not in PATH
   - Solution: Follow installation steps for your OS

2. **Permission denied errors**
   - Missing sudo privileges
   - Solution: Run with appropriate permissions or contact system administrator

3. **Docker container crashes**
   - User permissions issue
   - Solution: Ensure you switch back to `USER node` after installing packages

4. **n8n Cloud limitations**
   - Cannot install system dependencies
   - Solution: Use self-hosted n8n with custom Docker image

### Getting Help

If you encounter issues:
1. Check the error message in n8n workflow execution
2. Verify poppler-utils installation: `pdftoppm --version`
3. Check the [GitHub Issues](https://github.com/guziakas/n8n-pdf2image/issues) for similar problems
4. Create a new issue with your system details and error message

## 📋 Quick Reference

| Platform | Command |
|----------|---------|
| Ubuntu/Debian | `sudo apt install poppler-utils` |
| RHEL/CentOS | `sudo yum install poppler-utils` |
| Fedora | `sudo dnf install poppler-utils` |
| Alpine | `apk add poppler-utils` |
| macOS | `brew install poppler` |
| Windows | Download from GitHub releases |
| Docker | `RUN apk add poppler-utils` |

Remember: **poppler-utils must be installed on the same system where n8n is running!**
