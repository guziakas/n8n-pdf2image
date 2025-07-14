# Example Workflow

Here's an example of how to use the PDF to Image converter node in an n8n workflow:

## Basic Workflow

1. **Start Node** → 2. **HTTP Request Node** → 3. **PDF to Image Node** → 4. **HTTP Response Node**

### Configuration Steps:

#### 1. HTTP Request Node (to get a PDF)
```json
{
  "method": "GET",
  "url": "https://example.com/sample.pdf",
  "responseFormat": "file",
  "options": {
    "response": {
      "responseFormat": "file"
    }
  }
}
```

#### 2. PDF to Image Node
```json
{
  "operation": "convert",
  "pdfBinaryProperty": "data",
  "format": "png",
  "density": 150,
  "convertAllPages": true,
  "outputBinaryProperty": "image"
}
```

#### 3. Process Results
The node will output one item per page with:
- `json.pageNumber`: Current page number
- `json.totalPages`: Total number of pages
- `json.fileName`: Generated filename
- `binary.image`: The converted image data

## Advanced Example: Convert Specific Pages

```json
{
  "operation": "convert",
  "pdfBinaryProperty": "data",
  "format": "jpeg",
  "quality": 90,
  "density": 300,
  "width": 1920,
  "convertAllPages": false,
  "pageRange": "1,3,5-7",
  "outputBinaryProperty": "converted_image"
}
```

This will convert pages 1, 3, 5, 6, and 7 to high-quality JPEG images with a width of 1920 pixels.

## Use Cases

1. **Document Processing**: Convert PDF reports to images for web display
2. **Preview Generation**: Create thumbnail previews of PDF documents
3. **Archive Conversion**: Convert PDF archives to searchable image formats
4. **Batch Processing**: Process multiple PDFs in bulk workflows
