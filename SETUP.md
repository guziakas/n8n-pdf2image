# Setup Guide for PDF to Image Converter Node

## Prerequisites

Before you can build and use this n8n node, you need to have the following installed:

### 1. Node.js and npm
Download and install Node.js from https://nodejs.org/ (version 16 or higher recommended)
This will also install npm (Node Package Manager).

### 2. ImageMagick
The pdf2pic library requires ImageMagick to be installed on your system:

#### Windows:
- Download from: https://imagemagick.org/script/download.php#windows
- Install the binary release for Windows
- Make sure to check "Install development headers and libraries for C and C++" during installation

#### macOS:
```bash
brew install imagemagick
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install imagemagick
```

#### Linux (CentOS/RHEL):
```bash
sudo yum install ImageMagick ImageMagick-devel
```

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Install in n8n:**
   
   **Option A: Local n8n installation**
   ```bash
   # Navigate to your n8n installation directory
   cd ~/.n8n/nodes
   # Copy the built files
   cp -r /path/to/pdf2image-converter/dist ./n8n-nodes-pdf2image
   ```

   **Option B: Global installation**
   ```bash
   npm pack
   npm install -g n8n-nodes-pdf2image-1.0.0.tgz
   ```

   **Option C: Development mode**
   ```bash
   # In your n8n custom nodes directory
   npm link /path/to/pdf2image-converter
   ```

4. **Restart n8n**
   After installation, restart your n8n instance to load the new node.

## Verification

1. Start n8n
2. Create a new workflow
3. Look for "PDF to Image" in the node palette
4. Add the node to test functionality

## Troubleshooting

- **"ImageMagick not found" error**: Ensure ImageMagick is properly installed and in your system PATH
- **"Module not found" errors**: Run `npm install` to ensure all dependencies are installed
- **Node not appearing in n8n**: Restart n8n and check the installation path
- **Permission errors**: Ensure proper file permissions for the n8n nodes directory
