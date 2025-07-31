const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/JobAnalysis.tsx', 
  'src/pages/ResumeEditor.tsx'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace @ imports with relative imports for pages
    content = content.replace(/@\/components\/ui\//g, '../components/ui/');
    content = content.replace(/@\/lib\//g, '../lib/');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in ${filePath}`);
  }
});

console.log('Import fixes completed!');
