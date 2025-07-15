const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');

async function testPdfPoppler() {
    console.log('🧪 Testing pdf-poppler directly...\n');
    
    const pdfPath = path.join(__dirname, 'test-sample.pdf');
    const outputDir = path.join(__dirname, 'direct-test-output');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`📄 PDF: ${pdfPath}`);
    console.log(`📁 Output: ${outputDir}\n`);
    
    try {
        // Test basic conversion
        console.log('🔄 Testing basic conversion...');
        const options = {
            format: 'png',
            out_dir: outputDir,
            out_prefix: 'page'
        };
        
        console.log('Options:', JSON.stringify(options, null, 2));
        
        const result = await pdf.convert(pdfPath, options);
        
        console.log('✅ Conversion result:', result);
        
        // Check if files were created
        if (result && result.length > 0) {
            for (const filePath of result) {
                const exists = fs.existsSync(filePath);
                const size = exists ? fs.statSync(filePath).size : 0;
                console.log(`   📸 ${path.basename(filePath)}: ${exists ? '✅' : '❌'} (${size} bytes)`);
            }
        } else {
            console.log('❌ No files returned from conversion');
        }
        
    } catch (error) {
        console.log('❌ Error during conversion:');
        console.log('   Message:', error.message);
        console.log('   Stack:', error.stack);
        
        // Check if it's a specific pdf-poppler error
        if (error.message.includes('poppler') || error.message.includes('pdftoppm')) {
            console.log('\n💡 This might be a poppler installation issue.');
            console.log('   pdf-poppler requires poppler-utils to be installed on the system.');
            console.log('   On Windows, you might need to install poppler-utils or use a different approach.');
        }
    }
}

// Also test pdf-poppler info
async function testPdfInfo() {
    console.log('\n🔍 Testing PDF info...');
    
    try {
        const pdfPath = path.join(__dirname, 'test-sample.pdf');
        const info = await pdf.info(pdfPath);
        console.log('✅ PDF Info:', JSON.stringify(info, null, 2));
    } catch (error) {
        console.log('❌ Error getting PDF info:', error.message);
    }
}

async function main() {
    await testPdfPoppler();
    await testPdfInfo();
    
    console.log('\n📋 Summary:');
    console.log('If conversion failed with poppler errors, the library requires system dependencies.');
    console.log('Consider using a different PDF library like pdf2pic with pdf-img-convert instead.');
}

main().catch(console.error);
