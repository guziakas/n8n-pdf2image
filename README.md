# PDF to Image Converter Node for n8n

A custom n8n node that converts PDF files to images using the pdf2pic library.

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
- ImageMagick (required by pdf2pic)

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

This project uses automated releases via GitHub Actions. To create a new release:

### Option 1: Use the release script (Recommended)

```bash
# For patch version (1.0.0 -> 1.0.1)
./release.ps1 patch

# For minor version (1.0.0 -> 1.1.0)
./release.ps1 minor

# For major version (1.0.0 -> 2.0.0)
./release.ps1 major
```

### Option 2: Manual release

```bash
# Bump version in package.json
npm version patch  # or minor/major

# Push the tag
git push origin main
git push origin v1.x.x
```

The GitHub Actions workflow will automatically:
1. Build and test the package
2. Publish to npm registry
3. Create a GitHub release with release notes

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
