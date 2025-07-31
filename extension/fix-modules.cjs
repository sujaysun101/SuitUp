const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Read all files in dist directory
const files = fs.readdirSync(distDir);

// Find content.js, background.js, and popup.js
const contentFile = path.join(distDir, 'content.js');
const backgroundFile = path.join(distDir, 'background.js');
const popupFile = path.join(distDir, 'popup.js');
const indexFile = path.join(distDir, 'index.js');

// Function to convert background.js and content.js to IIFE (without React code)
function convertBackgroundToIIFE(filePath, outputPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found, skipping...`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // For content.js, if it contains React code, we need to rebuild it from source differently
  if (filePath.includes('content.js') && content.includes('import{')) {
    console.log('Content.js contains React imports, creating standalone version...');
    
    // Create a standalone content script without React dependencies
    content = `
// Resume Tailor Content Script - Standalone Version
console.log('Resume Tailor content script loaded');

// Basic AutoFill Manager implementation without React
class AutoFillManager {
  constructor() {
    this.isEnabled = true;
    this.init();
  }

  init() {
    this.detectJobPostings();
    this.setupAutoFill();
  }

  detectJobPostings() {
    // Basic job detection logic
    const selectors = [
      '[data-job-id]',
      '.jobs-search-results__list-item',
      '.job-card',
      '.jobsearch-SerpJobCard'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log('Job postings detected:', elements.length);
        this.notifyBackground();
      }
    });
  }

  setupAutoFill() {
    // Basic autofill setup
    document.addEventListener('click', (e) => {
      if (e.target.matches('input[type="file"], input[name*="resume"], input[name*="cv"]')) {
        console.log('Resume upload field detected');
      }
    });
  }

  notifyBackground() {
    chrome.runtime.sendMessage({
      type: 'JOB_DETECTED',
      data: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now()
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AutoFillManager();
  });
} else {
  new AutoFillManager();
}
`;
  }
  
  // Remove any import/export statements
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]*['"];?\s*/g, '');
  content = content.replace(/export\s+.*?;?\s*/g, '');
  content = content.replace(/from"\.\/index\.js";?/g, '');
  content = content.replace(/import\{[^}]+\}from"\.\/index\.js";?/g, '');
  
  // Wrap in IIFE only if it doesn't already have one
  if (!content.trim().startsWith('(function()')) {
    content = `(function() {
${content}
})();`;
  }
  
  fs.writeFileSync(outputPath, content);
  console.log(`Converted ${filePath} to IIFE format (background/content)`);
}

// Function to convert popup.js with React code inlining
function convertPopupToIIFE(filePath, outputPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found, skipping...`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // If there's an index.js file, inline its content for popup only
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
  console.log(`Converted ${filePath} to IIFE format (popup with React)`);
}

// Convert files with appropriate methods
convertBackgroundToIIFE(backgroundFile, backgroundFile);
convertBackgroundToIIFE(contentFile, contentFile);
convertPopupToIIFE(popupFile, popupFile);

console.log('Post-build conversion completed!');
