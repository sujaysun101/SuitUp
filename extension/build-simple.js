const fs = require('fs-extra');
const path = require('path');

async function buildExtension() {
    console.log('🚀 Building Chrome Extension for Resume Tailor...');
    
    try {
        // Ensure all required files are in place
        const requiredFiles = [
            'dist/manifest.json',
            'dist/popup.html', 
            'dist/popup.js',
            'dist/background.js',
            'dist/content.js'
        ];
        
        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                console.error(`❌ Missing required file: ${file}`);
                return false;
            }
        }
        
        // Validate manifest.json
        const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));
        console.log(`✅ Manifest version: ${manifest.version} (${manifest.manifest_version})`);
        
        // Check file sizes
        const stats = {
            'popup.html': fs.statSync('dist/popup.html').size,
            'popup.js': fs.statSync('dist/popup.js').size,
            'background.js': fs.statSync('dist/background.js').size,
            'content.js': fs.statSync('dist/content.js').size
        };
        
        console.log('📊 File sizes:');
        Object.entries(stats).forEach(([file, size]) => {
            console.log(`   ${file}: ${(size / 1024).toFixed(2)} KB`);
        });
        
        // Create icons directory if it doesn't exist
        if (!fs.existsSync('dist/icons')) {
            fs.ensureDirSync('dist/icons');
            console.log('📁 Created icons directory');
        }
        
        console.log('✅ Extension build completed successfully!');
        console.log('📦 Extension ready at: dist/');
        console.log('🔧 Load in Chrome: chrome://extensions/ > Load unpacked > Select dist folder');
        
        return true;
    } catch (error) {
        console.error('❌ Build failed:', error);
        return false;
    }
}

buildExtension();
