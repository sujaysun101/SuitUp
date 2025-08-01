import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface JobData {
  title: string;
  company: string;
  description?: string;
  location?: string;
  url?: string;
  timestamp?: number;
}

const PopupApp: React.FC = () => {
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Check authentication by trying to communicate with webapp
  useEffect(() => {
    checkAuthenticationStatus();
    loadJobData();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      // Check if chrome.tabs API is available
      if (!chrome?.tabs?.query) {
        console.error('Chrome tabs API not available');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Try to find if webapp is open and user is signed in  
      chrome.tabs.query({ url: 'http://localhost:5173/*' }, (tabs) => {
        // Check for chrome runtime errors
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        if (tabs && tabs.length > 0) {
          // Webapp is open, assume user is authenticated
          setIsAuthenticated(true);
        } else {
          // Check if user was previously authenticated (simplified approach)
          chrome.storage.local.get(['userWasAuthenticated'], (result) => {
            if (chrome.runtime.lastError) {
              console.error('Chrome storage error:', chrome.runtime.lastError);
              setIsAuthenticated(false);
            } else if (result && result.userWasAuthenticated) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          });
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const loadJobData = async () => {
    try {
      // Check if chrome.tabs API is available
      if (!chrome?.tabs?.query) {
        console.error('Chrome tabs API not available');
        setMessage('Extension APIs not available');
        return;
      }

      // Get current tab and inject content script to get job data
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        // Check for chrome runtime errors
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          setMessage('Could not access current tab');
          return;
        }

        if (tabs && tabs[0]?.id) {
          try {
            // Check if scripting API is available
            if (!chrome?.scripting?.executeScript) {
              console.error('Chrome scripting API not available');
              setMessage('Extension scripting not available');
              return;
            }

            // Execute script to get job data from the page
            const results = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: extractJobData
            });

            if (results && results[0]?.result) {
              const jobData = results[0].result;
              setCurrentJob({
                ...jobData,
                url: tabs[0].url,
                timestamp: Date.now()
              });
            }
          } catch (error) {
            console.error('Error extracting job data:', error);
            setMessage('Could not extract job data from this page');
          }
        } else {
          setMessage('No active tab found');
        }
      });
    } catch (error) {
      console.error('Error loading job data:', error);
      setMessage('Error accessing tab information');
    }
  };

  // Function that runs in the context of the web page to extract job data
  const extractJobData = (): JobData | null => {
    const url = window.location.href;
    let jobData: JobData | null = null;

    // Indeed job extraction
    if (url.includes('indeed.com')) {
      const titleElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"] span[title]') || 
                          document.querySelector('h1.jobsearch-JobInfoHeader-title span') ||
                          document.querySelector('h1[data-testid="job-title"]');
      
      const companyElement = document.querySelector('[data-testid="inlineHeader-companyName"] a') ||
                           document.querySelector('[data-testid="inlineHeader-companyName"]') ||
                           document.querySelector('.icl-u-lg-mr--sm.icl-u-xs-mr--xs a');
      
      const descriptionElement = document.querySelector('#jobDescriptionText') ||
                                document.querySelector('[data-testid="jobsearch-jobDescriptionText"]');
      
      const locationElement = document.querySelector('[data-testid="job-location"]') ||
                            document.querySelector('[data-testid="inlineHeader-companyLocation"]');

      if (titleElement && companyElement) {
        jobData = {
          title: titleElement.textContent?.trim() || '',
          company: companyElement.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || ''
        };
      }
    }

    // LinkedIn job extraction
    else if (url.includes('linkedin.com')) {
      const titleElement = document.querySelector('.jobs-unified-top-card__job-title a') ||
                          document.querySelector('h1.t-24.t-bold.inline') ||
                          document.querySelector('.job-details-jobs-unified-top-card__job-title h1');
      
      const companyElement = document.querySelector('.jobs-unified-top-card__company-name a') ||
                           document.querySelector('.jobs-unified-top-card__subtitle-primary a') ||
                           document.querySelector('[data-anonymize="company-name"]');
      
      const descriptionElement = document.querySelector('.jobs-description-content__text') ||
                                document.querySelector('.jobs-box__html-content') ||
                                document.querySelector('#job-details');
      
      const locationElement = document.querySelector('.jobs-unified-top-card__bullet') ||
                            document.querySelector('.jobs-unified-top-card__subtitle-secondary');

      if (titleElement && companyElement) {
        jobData = {
          title: titleElement.textContent?.trim() || '',
          company: companyElement.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || ''
        };
      }
    }

    // Glassdoor job extraction
    else if (url.includes('glassdoor.com')) {
      const titleElement = document.querySelector('[data-test="job-title"]') ||
                          document.querySelector('h1[data-test="job-title"]');
      
      const companyElement = document.querySelector('[data-test="employer-name"]') ||
                           document.querySelector('.employerName');
      
      const descriptionElement = document.querySelector('[data-test="job-description"]') ||
                                document.querySelector('.jobDescriptionContent');
      
      const locationElement = document.querySelector('[data-test="job-location"]');

      if (titleElement && companyElement) {
        jobData = {
          title: titleElement.textContent?.trim() || '',
          company: companyElement.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || ''
        };
      }
    }

    // Generic fallback for other job sites
    else {
      const titleSelectors = ['h1', '.job-title', '[class*="title"]', '[id*="title"]'];
      const companySelectors = ['.company', '[class*="company"]', '[id*="company"]'];
      
      let titleElement = null;
      let companyElement = null;

      for (const selector of titleSelectors) {
        titleElement = document.querySelector(selector);
        if (titleElement && titleElement.textContent?.trim()) break;
      }

      for (const selector of companySelectors) {
        companyElement = document.querySelector(selector);
        if (companyElement && companyElement.textContent?.trim()) break;
      }

      if (titleElement && companyElement) {
        jobData = {
          title: titleElement.textContent?.trim() || '',
          company: companyElement.textContent?.trim() || '',
          description: document.body.textContent?.substring(0, 2000) || '',
          location: ''
        };
      }
    }

    return jobData;
  };

  const handleAnalyzeJob = async () => {
    if (!currentJob) return;

    setIsAnalyzing(true);
    setMessage('Analyzing job...');

    try {
      // Send job data to backend for analysis
      const response = await fetch('http://localhost:8000/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentJob.title,
          company: currentJob.company,
          description: currentJob.description || '',
          url: currentJob.url || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Store analysis result
      if (chrome?.storage?.local) {
        chrome.storage.local.set({
          lastJobAnalysis: {
            jobData: currentJob,
            analysis: result,
            timestamp: Date.now()
          },
          userWasAuthenticated: true // Remember that user was authenticated
        });
      }

      // Open or focus the webapp tab
      const webappUrl = 'http://localhost:5173';
      if (chrome?.tabs?.query) {
        chrome.tabs.query({ url: 'http://localhost:5173/*' }, (tabs) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
            return;
          }

          if (tabs && tabs.length > 0) {
            // Focus existing tab
            if (chrome?.tabs?.update && tabs[0].id) {
              chrome.tabs.update(tabs[0].id, { active: true });
            }
            if (chrome?.windows?.update && tabs[0].windowId) {
              chrome.windows.update(tabs[0].windowId, { focused: true });
            }
          } else {
            // Create new tab
            if (chrome?.tabs?.create) {
              chrome.tabs.create({ url: webappUrl });
            }
          }
        });

        // Send message to webapp
        setTimeout(() => {
          chrome.tabs.query({ url: 'http://localhost:5173/*' }, (tabs) => {
            if (chrome.runtime.lastError) {
              console.error('Chrome runtime error:', chrome.runtime.lastError);
              return;
            }

            if (tabs && tabs.length > 0 && tabs[0].id && chrome?.tabs?.sendMessage) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'JOB_ANALYSIS_COMPLETE',
                analysis: {
                  jobData: currentJob,
                  analysis: result,
                  status: 'complete',
                  timestamp: Date.now()
                }
              });
            }
          });
        }, 1000);
      }

      setMessage('Analysis complete! Opening webapp...');
      
    } catch (error) {
      console.error('Error analyzing job:', error);
      setMessage('Error analyzing job. Make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openWebApp = () => {
    if (chrome?.tabs?.create) {
      chrome.tabs.create({ url: 'http://localhost:5173' });
    }
    // Mark as authenticated when user opens webapp
    if (chrome?.storage?.local) {
      chrome.storage.local.set({ userWasAuthenticated: true });
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 p-4 bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 p-4 bg-gray-900 text-white">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Resume Tailor</h2>
        
        {currentJob ? (
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-sm truncate">{currentJob.title}</h3>
            <p className="text-gray-400 text-xs truncate">{currentJob.company}</p>
            {currentJob.location && (
              <p className="text-gray-500 text-xs truncate">{currentJob.location}</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm">No job detected on this page</p>
            <p className="text-gray-500 text-xs mt-1">Visit Indeed, LinkedIn, or other job sites</p>
          </div>
        )}

        {message && (
          <div className="bg-blue-900 bg-opacity-50 rounded p-2 mb-4">
            <p className="text-sm text-blue-200">{message}</p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleAnalyzeJob}
            disabled={!currentJob || isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Job & Tailor Resume'}
          </button>
          
          <button
            onClick={openWebApp}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Open Dashboard
          </button>
          
          {!isAuthenticated && (
            <div className="bg-yellow-900 bg-opacity-50 rounded p-2 mt-2">
              <p className="text-xs text-yellow-200">
                💡 Sign in to the dashboard first for full functionality
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Initialize the popup
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}