#!/usr/bin/env node

console.log('🧪 PDF to Image Node - Final Package Test\n');

const fs = require('fs');
const path = require('path');

// Test 1: Package Structure
console.log('📦 Testing package structure...');
const requiredFiles = [
    'dist/Pdf2Image.node.js',
    'dist/Pdf2Image.node.d.ts', 
    'dist/index.js',
    'package.json',
    'README.md'
];

let structureOk = true;
for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        structureOk = false;
    }
}

// Test 2: Package.json Validation
console.log('\n📋 Testing package.json configuration...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const checks = [
    { key: 'name', expected: 'n8n-nodes-pdf2image', actual: pkg.name },
    { key: 'keywords', expected: true, actual: pkg.keywords?.includes('n8n-community-node-package') },
    { key: 'n8n.nodes', expected: 'dist/Pdf2Image.node.js', actual: pkg.n8n?.nodes?.[0] },
    { key: 'main', expected: 'dist/index.js', actual: pkg.main },
    { key: 'dependencies', expected: true, actual: !!pkg.dependencies?.['pdf-poppler'] }
];

let configOk = true;
for (const check of checks) {
    const passed = check.actual === check.expected || (check.expected === true && check.actual);
    console.log(`   ${passed ? '✅' : '❌'} ${check.key}: ${check.actual}`);
    if (!passed) configOk = false;
}

// Test 3: Node Import Test
console.log('\n🔧 Testing node import...');
try {
    const { Pdf2Image } = require('./dist/Pdf2Image.node.js');
    const node = new Pdf2Image();
    
    if (node.description?.displayName === 'PDF to Image') {
        console.log('   ✅ Node imports successfully');
        console.log('   ✅ Node description loaded');
    } else {
        console.log('   ❌ Node description invalid');
        configOk = false;
    }
} catch (error) {
    console.log(`   ❌ Node import failed: ${error.message}`);
    configOk = false;
}

// Test 4: Test Files Created
console.log('\n🧪 Checking test files...');
const testFiles = ['test-sample.pdf', 'test-sample-pdfkit.pdf'];
for (const file of testFiles) {
    if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        console.log(`   ✅ ${file} (${size} bytes)`);
    } else {
        console.log(`   ⚠️  ${file} - not found (run test-pdf-creation.js to create)`);
    }
}

// Final Results
console.log('\n📊 Test Results Summary:');
console.log(`   Package Structure: ${structureOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   Configuration: ${configOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   Version: ${pkg.version}`);

if (structureOk && configOk) {
    console.log('\n🎉 Package is ready for deployment!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Install in n8n: Settings > Community Nodes > "n8n-nodes-pdf2image"');
    console.log('   2. Ensure poppler-utils is installed on your system');
    console.log('   3. Test with a sample PDF in n8n');
    console.log('\n📖 For deployment help, see: TEST_RESULTS.md');
} else {
    console.log('\n❌ Package has issues that need to be resolved.');
}

console.log('\n🔗 Repository: https://github.com/guziakas/n8n-pdf2image');
console.log(`📦 npm: npm install n8n-nodes-pdf2image@${pkg.version}`);
