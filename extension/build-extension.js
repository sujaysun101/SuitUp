const fs = require('fs');
const path = require('path');

// Build script for Chrome extension
console.log('Building Chrome Extension...');

// Copy manifest.json to dist
const manifestSrc = path.join(__dirname, 'public', 'manifest.json');
const manifestDest = path.join(__dirname, 'dist', 'manifest.json');

if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('✓ Copied manifest.json');
} else {
  console.error('✗ manifest.json not found');
}

// Copy icons if they exist
const iconsSrc = path.join(__dirname, 'public', 'icons');
const iconsDest = path.join(__dirname, 'dist', 'icons');

if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDest)) {
    fs.mkdirSync(iconsDest, { recursive: true });
  }
  
  const icons = fs.readdirSync(iconsSrc);
  icons.forEach(icon => {
    fs.copyFileSync(
      path.join(iconsSrc, icon),
      path.join(iconsDest, icon)
    );
  });
  console.log('✓ Copied icons');
}

console.log('Chrome Extension build complete!');
console.log('Load the extension from the "dist" folder in Chrome.');
