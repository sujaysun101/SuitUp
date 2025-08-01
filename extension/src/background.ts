// Background service worker for Resume Tailor Chrome Extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Resume Tailor extension installed:', details);
  
  // Set default settings
  chrome.storage.sync.set({
    isEnabled: true,
    aiProvider: 'openai',
    autoDetectJobs: true,
    savedResumes: []
  });
});

// Track webapp authentication state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if user is on webapp
    if (tab.url.includes('localhost:5173')) {
      // User opened webapp, assume they will authenticate
      chrome.storage.local.set({ userWasAuthenticated: true });
    }
    
    // Check if we're on a supported job site
    const jobSites = [
      'linkedin.com/jobs',
      'indeed.com',
      'jobs.google.com',
      'glassdoor.com'
    ];
    
    const isJobSite = jobSites.some(site => tab.url!.includes(site));
    
    if (isJobSite) {
      // Inject content script if not already present
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      }).catch(err => {
        // Script might already be injected
        console.log('Content script injection skipped:', err.message);
      });
    }
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'JOB_DETECTED':
      if (sender.tab) {
        handleJobDetection(message.data, sender.tab);
      }
      break;

    case 'ANALYZE_RESUME':
      handleResumeAnalysis(message.data);
      break;

    case 'SAVE_TAILORED_RESUME':
      handleSaveTailoredResume(message.data);
      break;

    case 'GET_STORAGE_DATA':
      chrome.storage.sync.get(message.keys, (result) => {
        sendResponse(result);
      });
      return true; // Keep message channel open for async response

    case 'CLERK_TOKEN':
      if (message.token) {
        chrome.storage.local.set({ clerkToken: message.token });
        console.log('Clerk token saved to storage');
      }
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
});

async function handleJobDetection(jobData: any, tab: chrome.tabs.Tab) {
  console.log('Job detected:', jobData);
  
  // Store job data
  const storageKey = `job_${Date.now()}`;
  await chrome.storage.local.set({
    [storageKey]: {
      ...jobData,
      url: tab?.url,
      timestamp: Date.now()
    }
  });
  
  // Show notification badge
  chrome.action.setBadgeText({
    text: '!',
    tabId: tab?.id
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: '#4CAF50'
  });
}

async function handleResumeAnalysis(data: any) {
  console.log('Analyzing resume:', data);
  
  // This would integrate with your AI backend
  // For now, we'll simulate the analysis
  const analysisResult = {
    matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
    missingKeywords: ['collaboration', 'data visualization', 'agile'],
    suggestions: [
      {
        original: 'Developed internal dashboards using React',
        improved: 'Built data visualization dashboards using React, collaborating with cross-functional teams to enhance internal reporting'
      }
    ]
  };
  
  // Store analysis result
  await chrome.storage.local.set({
    [`analysis_${Date.now()}`]: analysisResult
  });
}

async function handleSaveTailoredResume(resumeData: any) {
  console.log('Saving tailored resume:', resumeData);
  
  // Get existing saved resumes
  const result = await chrome.storage.sync.get(['savedResumes']);
  const savedResumes = result.savedResumes || [];
  
  // Add new tailored resume
  savedResumes.push({
    ...resumeData,
    id: Date.now(),
    timestamp: Date.now()
  });
  
  // Save back to storage
  await chrome.storage.sync.set({ savedResumes });
}
