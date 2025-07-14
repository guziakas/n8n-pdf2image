# PDF to Image Converter Node for n8n

A custom n8n node that converts PDF files to images using the pdf2pic library.

## Features

- Convert PDF files to PNG or JPEG images
- Support for all pages or specific page ranges
- Configurable output quality and DPI
- Custom width and height settings
- Binary data handling for seamless n8n integration

## Installation

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

- Node.js 14+
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
```

## License

MIT
