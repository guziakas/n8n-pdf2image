# PDF to Image Converter Node for n8n

A custom n8n node that converts PDF files to images using the pdf-poppler library.

## ⚠️ System Requirements

This node requires **poppler-utils** to be installed on the system where n8n is running. 

### Quick Setup for Different Environments:

**Docker (Recommended):**
```dockerfile
FROM n8nio/n8n:latest
USER root
RUN apt-get update && apt-get install -y poppler-utils
USER node
```

**Ubuntu/Debian:**
```bash
sudo apt-get update && sudo apt-get install -y poppler-utils
```

**CentOS/RHEL:**
```bash
sudo yum install poppler-utils
```

**macOS:**
```bash
brew install poppler
```

**Windows:**
- Download poppler for Windows and add to PATH
- Or use WSL with Ubuntu setup

## Features

- Convert PDF files to PNG or JPEG images
- Support for all pages or specific page ranges
- Configurable output quality and DPI
- Custom width and height settings
- Binary data handling for seamless n8n integration

## Installation

### Via n8n Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install**
3. Enter: `n8n-nodes-pdf2image`
4. Click **Install**
5. Restart n8n

### Manual Installation

1. Navigate to your n8n installation directory
2. Install the package:
   ```bash
   npm install n8n-nodes-pdf2image
   ```
3. Restart n8n

## Usage

1. Add the "PDF to Image" node to your workflow
2. Configure the input PDF binary property name
3. Set your desired output format (PNG or JPEG)
4. Adjust quality, DPI, and size settings as needed
5. Choose to convert all pages or specify a page range
6. Set the output binary property name for the converted images

## Configuration Options

- **PDF Binary Property**: Name of the binary property containing the PDF file
- **Output Format**: PNG or JPEG
- **Quality**: JPEG quality (1-100, only for JPEG format)
- **DPI**: Output image resolution (72-600)
- **Width/Height**: Custom dimensions (optional)
- **Convert All Pages**: Toggle for all pages vs. specific range
- **Page Range**: Specify pages like "1-5" or "1,3,5"
- **Output Binary Property**: Name for the output image binary data

## Requirements

- Node.js 18+
- n8n
- Poppler utilities (automatically handled by pdf-poppler)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run dev

# Lint the code
npm run lint

# Test package creation
npm pack
```

## Release Process

This project features **fully automated releases** with multiple options:

### Option 1: Local Release Script (Recommended)

```bash
# Automatically bumps version, commits, tags, and triggers release
.\release.ps1 patch   # 1.0.3 → 1.0.4 (bug fixes)
.\release.ps1 minor   # 1.0.3 → 1.1.0 (new features)  
.\release.ps1 major   # 1.0.3 → 2.0.0 (breaking changes)
```

The script automatically:
- ✅ Bumps version in package.json
- ✅ Updates package-lock.json
- ✅ Commits changes with proper message
- ✅ Creates and pushes git tag
- ✅ Triggers automated GitHub release

### Option 2: GitHub Manual Release

1. Go to GitHub Actions → **Manual Release**
2. Click **Run workflow**
3. Select version type (patch/minor/major)
4. Optionally skip npm publish for testing
5. Click **Run workflow**

### Option 3: Manual Git Commands

```bash
# Only if you need full control
npm version patch
git push origin main --tags
```

### Automated Pipeline Features

Both release methods trigger the same automated pipeline:

1. 🔧 **Build & Test**: Compiles TypeScript, runs linting
2. 📦 **Package Validation**: Verifies file structure and n8n config
3. 🚀 **npm Publish**: Publishes to npm registry (if NPM_TOKEN configured)
4. 📋 **GitHub Release**: Creates release with changelog and assets
5. 📎 **Asset Upload**: Attaches .tgz package file

### Setup Requirements for Automated Releases

1. **NPM Token**: Add `NPM_TOKEN` to GitHub repository secrets
   - Go to [npm.com](https://www.npmjs.com/) → Account → Access Tokens
   - Create a new "Automation" token
   - Add it to GitHub: Settings → Secrets → Actions → `NPM_TOKEN`

2. **GitHub Token**: Automatically provided by GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
