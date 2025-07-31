const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Read all files in dist directory
const files = fs.readdirSync(distDir);

// Find content.js and background.js
const contentFile = path.join(distDir, 'content.js');
const backgroundFile = path.join(distDir, 'background.js');
const indexFile = path.join(distDir, 'index.js');

// Function to inline imports and convert to IIFE
function convertToIIFE(filePath, outputPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found, skipping...`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // If there's an index.js file, inline its content
  if (fs.existsSync(indexFile)) {
    const indexContent = fs.readFileSync(indexFile, 'utf8');
    
    // Remove the import statement and inline the content
    content = content.replace(/import\{[^}]+\}from"\.\/index\.js";?/, '');
    
    // Wrap everything in an IIFE
    content = `(function() {
// Inlined from index.js
${indexContent}

// Original content
${content}
})();`;
  } else {
    // Just wrap in IIFE if no index.js
    content = `(function() {
${content}
})();`;
  }
  
  fs.writeFileSync(outputPath, content);
  console.log(`Converted ${filePath} to IIFE format`);
}

// Convert content.js and background.js
convertToIIFE(contentFile, contentFile);
convertToIIFE(backgroundFile, backgroundFile);

console.log('Post-build conversion completed!');
