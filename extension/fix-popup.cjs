const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Fix popup.js if it has the IIFE import syntax error
const popupFile = path.join(distDir, 'popup.js');

if (fs.existsSync(popupFile)) {
  let content = fs.readFileSync(popupFile, 'utf8');
  
  // Check for the specific syntax error pattern
  if (content.includes('(function() {\nimport{')) {
    console.log('Fixing popup.js IIFE import syntax error...');
    
    // Remove the problematic IIFE wrapper and fix the import structure
    content = content
      .replace(/^\(function\(\) \{\s*/, '') // Remove opening IIFE
      .replace(/\s*\}\)\(\);?\s*$/, ''); // Remove closing IIFE
    
    // Write the fixed content
    fs.writeFileSync(popupFile, content);
    console.log('Fixed popup.js syntax error');
  } else {
    console.log('popup.js appears to be correct');
  }
}

console.log('Post-build fix completed!');
