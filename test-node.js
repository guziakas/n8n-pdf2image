const fs = require('fs').promises;
const path = require('path');
const { Pdf2Image } = require('./dist/Pdf2Image.node.js');

// Mock n8n execution context
function createMockExecutionContext(pdfPath, options = {}) {
    const pdfBuffer = require('fs').readFileSync(pdfPath);
    
    return {
        getInputData: () => [{
            json: { filename: path.basename(pdfPath) },
            binary: {
                data: {
                    data: pdfBuffer.toString('base64'),
                    mimeType: 'application/pdf',
                    fileName: path.basename(pdfPath),
                    fileExtension: 'pdf'
                }
            }
        }],
        
        getNodeParameter: (name, index, defaultValue) => {
            const params = {
                operation: 'convert',
                pdfBinaryProperty: 'data',
                format: options.format || 'png',
                quality: options.quality || 85,
                density: options.density || 150,
                width: options.width || '',
                height: options.height || '',
                convertAllPages: options.convertAllPages !== false,
                pageRange: options.pageRange || '1-5',
                outputBinaryProperty: options.outputBinaryProperty || 'image',
                ...options
            };
            return params[name] !== undefined ? params[name] : defaultValue;
        },
        
        helpers: {
            assertBinaryData: (index, propertyName) => {
                return {
                    data: pdfBuffer.toString('base64'),
                    mimeType: 'application/pdf',
                    fileName: path.basename(pdfPath),
                    fileExtension: 'pdf'
                };
            },
            
            getBinaryDataBuffer: async (index, propertyName) => {
                return pdfBuffer;
            }
        },
        
        continueOnFail: () => false,
        
        getNode: () => ({ name: 'PDF to Image Test' })
    };
}

async function testPdfConversion(pdfPath, testName, options = {}) {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log(`📄 PDF: ${path.basename(pdfPath)}`);
    console.log(`⚙️  Options:`, JSON.stringify(options, null, 2));
    
    try {
        const node = new Pdf2Image();
        const context = createMockExecutionContext(pdfPath, options);
        
        // Bind the context to the node's execute method
        const result = await node.execute.call(context);
        
        if (result && result[0] && result[0].length > 0) {
            console.log(`✅ Success! Converted ${result[0].length} page(s)`);
            
            // Save the converted images for verification
            const outputDir = path.join(__dirname, 'test-output', testName.replace(/\s+/g, '-'));
            await fs.mkdir(outputDir, { recursive: true });
            
            for (let i = 0; i < result[0].length; i++) {
                const item = result[0][i];
                const imageProperty = options.outputBinaryProperty || 'image';
                
                if (item.binary && item.binary[imageProperty]) {
                    const imageData = item.binary[imageProperty];
                    const fileName = imageData.fileName || `page_${i + 1}.${options.format || 'png'}`;
                    const outputPath = path.join(outputDir, fileName);
                    
                    const buffer = Buffer.from(imageData.data, 'base64');
                    await fs.writeFile(outputPath, buffer);
                    
                    console.log(`   📸 Saved: ${fileName} (${buffer.length} bytes)`);
                    console.log(`   📊 Page ${item.json.pageNumber}/${item.json.totalPages}`);
                }
            }
            
            console.log(`   💾 Output folder: ${outputDir}`);
        } else {
            console.log(`❌ No images were generated`);
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        console.log(`   Stack: ${error.stack}`);
    }
}

async function runAllTests() {
    console.log('🚀 Starting PDF to Image Node Tests\n');
    
    // Create test PDFs first
    console.log('📝 Creating test PDFs...');
    require('./test-pdf-creation.js');
    
    // Wait a moment for PDFs to be created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const testCases = [
        {
            name: 'Basic PNG Conversion',
            pdf: 'test-sample.pdf',
            options: { format: 'png', convertAllPages: true }
        },
        {
            name: 'JPEG with Quality',
            pdf: 'test-sample.pdf',
            options: { format: 'jpeg', quality: 90, convertAllPages: true }
        },
        {
            name: 'High DPI PNG',
            pdf: 'test-sample.pdf',
            options: { format: 'png', density: 300, convertAllPages: true }
        },
        {
            name: 'Custom Size',
            pdf: 'test-sample.pdf',
            options: { format: 'png', width: 800, height: 600, convertAllPages: true }
        },
        {
            name: 'Single Page',
            pdf: 'test-sample.pdf',
            options: { format: 'png', convertAllPages: false, pageRange: '1' }
        }
    ];
    
    // Test with PDFKit PDF if it exists
    const pdfkitPath = path.join(__dirname, 'test-sample-pdfkit.pdf');
    try {
        await fs.access(pdfkitPath);
        testCases.push({
            name: 'Multi-page PDFKit PDF',
            pdf: 'test-sample-pdfkit.pdf',
            options: { format: 'png', convertAllPages: true }
        });
    } catch (error) {
        console.log('📝 PDFKit PDF not available, skipping multi-page test');
    }
    
    // Run all tests
    for (const testCase of testCases) {
        const pdfPath = path.join(__dirname, testCase.pdf);
        try {
            await fs.access(pdfPath);
            await testPdfConversion(pdfPath, testCase.name, testCase.options);
        } catch (error) {
            console.log(`⏭️  Skipping ${testCase.name}: PDF not found (${testCase.pdf})`);
        }
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('📁 Check the test-output folder for generated images');
}

// Check if this is being run directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { testPdfConversion, createMockExecutionContext };
