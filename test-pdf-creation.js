const fs = require('fs');
const path = require('path');

// Create a simple PDF manually using basic PDF structure
function createSimplePDF() {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 85
>>
stream
BT
/F1 24 Tf
100 700 Td
(Hello World!) Tj
100 650 Td
(This is a test PDF) Tj
100 600 Td
(for n8n PDF to Image conversion) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000100 00000 n 
0000000249 00000 n 
0000000384 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
450
%%EOF`;

    const outputPath = path.join(__dirname, 'test-sample.pdf');
    fs.writeFileSync(outputPath, pdfContent);
    console.log(`✅ Simple PDF created: ${outputPath}`);
    return outputPath;
}

// Alternative: Create PDF using PDFKit if available
async function createPDFWithPDFKit() {
    try {
        const PDFDocument = require('pdfkit');
        const outputPath = path.join(__dirname, 'test-sample-pdfkit.pdf');
        
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(outputPath));
        
        doc.fontSize(24).text('Hello World!', 100, 100);
        doc.fontSize(16).text('This is a test PDF created with PDFKit', 100, 150);
        doc.fontSize(16).text('for testing n8n PDF to Image conversion', 100, 180);
        doc.fontSize(14).text('Page 1 of 2', 100, 250);
        
        // Add a second page
        doc.addPage();
        doc.fontSize(20).text('Second Page', 100, 100);
        doc.fontSize(14).text('This PDF has multiple pages to test conversion', 100, 140);
        doc.fontSize(12).text('Testing different font sizes and formatting', 100, 180);
        
        doc.end();
        
        return new Promise((resolve) => {
            doc.on('end', () => {
                console.log(`✅ PDFKit PDF created: ${outputPath}`);
                resolve(outputPath);
            });
        });
    } catch (error) {
        console.log('PDFKit not available, using simple PDF instead');
        return null;
    }
}

async function main() {
    console.log('🔨 Creating test PDFs...\n');
    
    // Create simple PDF (always works)
    const simplePDF = createSimplePDF();
    
    // Try to create a more complex PDF with PDFKit
    const pdfkitPDF = await createPDFWithPDFKit();
    
    console.log('\n📋 Test PDFs created:');
    console.log(`- Simple PDF: test-sample.pdf`);
    if (pdfkitPDF) {
        console.log(`- PDFKit PDF: test-sample-pdfkit.pdf`);
    }
    
    console.log('\n🧪 You can now test these PDFs with your n8n node!');
}

main().catch(console.error);
