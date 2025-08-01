// Content script for Resume Tailor Chrome Extension
// Runs on job posting websites to detect and extract job information

import { openResumeTailorModal } from "./content-magic-modal";

console.log('Resume Tailor content script loaded');

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'JOB_ANALYSIS_COMPLETE') {
    // Forward the message to the webapp via postMessage
    window.postMessage({
      type: 'JOB_ANALYSIS_COMPLETE',
      analysis: message.analysis
    }, window.location.origin);
    
    sendResponse({ success: true });
  }
  
  return true; // Keep the messaging channel open for async response
});

// Listen for messages from the webapp
window.addEventListener('message', (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'WEBAPP_READY') {
    console.log('Webapp is ready, checking for stored job analysis');
    
    // Check if there's a recent job analysis in storage
    chrome.storage.local.get(['lastJobAnalysis'], (result) => {
      if (result.lastJobAnalysis) {
        const analysis = result.lastJobAnalysis;
        const timeDiff = Date.now() - analysis.timestamp;
        
        // If analysis is less than 5 minutes old, use it
        if (timeDiff < 5 * 60 * 1000) {
          window.postMessage({
            type: 'JOB_ANALYSIS_COMPLETE',
            analysis: {
              jobData: analysis.jobData,
              analysis: analysis.analysis,
              status: 'complete',
              timestamp: analysis.timestamp
            }
          }, window.location.origin);
        }
      }
    });
  }
});

// Send webapp ready message when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.postMessage({ type: 'WEBAPP_READY' }, window.location.origin);
    }, 1000);
  });
} else {
  setTimeout(() => {
    window.postMessage({ type: 'WEBAPP_READY' }, window.location.origin);
  }, 1000);
}

// Enhanced job extraction logic with modern selectors and dynamic detection
function extractAndExposeJob() {
  let job: { title?: string; company?: string; location?: string; description?: string } = {};
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  if (hostname.includes('linkedin.com') && pathname.includes('/jobs/')) {
    // LinkedIn job detection
    const titleElement = document.querySelector('h1.t-24, h1.jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title h1');
    const companyElement = document.querySelector('.jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name a');
    const locationElement = document.querySelector('.jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__bullet');
    
    if (titleElement && companyElement) {
      job.title = titleElement.textContent?.trim() || '';
      job.company = companyElement.textContent?.trim() || '';
      job.location = locationElement?.textContent?.trim() || '';
    }
  } else if (hostname.includes('indeed.com')) {
    // Modern Indeed job detection - updated selectors for 2025
    const titleElement = document.querySelector([
      'h1[data-jk]',
      'h1.jobsearch-JobInfoHeader-title',
      '[data-testid="job-title"]',
      '.jobsearch-JobInfoHeader-title span[title]',
      'h1 span[title]',
      '.jobsearch-JobComponent-description h1'
    ].join(', '));
    
    const companyElement = document.querySelector([
      'div[data-testid="inlineHeader-companyName"] a',
      '.jobsearch-InlineCompanyRating a',
      '[data-testid="company-name"]',
      '.jobsearch-JobInfoHeader-subtitle a',
      'a[data-testid="company-name"]',
      '.jobsearch-CompanyReview--heading a'
    ].join(', '));
    
    const locationElement = document.querySelector([
      '[data-testid="job-location"]',
      '.jobsearch-JobInfoHeader-subtitle div',
      '.companyLocation'
    ].join(', '));
    
    if (titleElement && companyElement) {
      job.title = titleElement.textContent?.trim() || titleElement.getAttribute('title') || '';
      job.company = companyElement.textContent?.trim() || '';
      job.location = locationElement?.textContent?.trim() || '';
    }
  } else if (hostname.includes('jobs.google.com')) {
    // Google Jobs detection
    const titleElement = document.querySelector('h2[jsname="r4nke"], .VfPpkd-WsjYwc-OWXEXe-INsAgc h2');
    const companyElement = document.querySelector('div[jsname="qXLe6d"] span, .VfPpkd-WsjYwc-OWXEXe-INsAgc .BjJfJf');
    
    if (titleElement && companyElement) {
      job.title = titleElement.textContent?.trim() || '';
      job.company = companyElement.textContent?.trim() || '';
    }
  } else if (hostname.includes('glassdoor.com')) {
    // Glassdoor detection
    const titleElement = document.querySelector('h1[data-test="job-title"], .JobDetails_jobTitle__Rw_gn');
    const companyElement = document.querySelector('div[data-test="employer-name"], .JobDetails_companyName__t12ci a');
    
    if (titleElement && companyElement) {
      job.title = titleElement.textContent?.trim() || '';
      job.company = companyElement.textContent?.trim() || '';
    }
  }
  
  if (job.title && job.company) {
    (window as any).__RESUME_TAILOR_JOB__ = job;
    console.log('Resume Tailor: Job detected', job);
  } else {
    console.log('Resume Tailor: No job detected on this page');
  }
}

// Enhanced detection with retry logic and mutation observer
function initJobDetection() {
  let retryCount = 0;
  const maxRetries = 10;
  
  function detectJob() {
    extractAndExposeJob();
    
    // If no job found and we haven't exceeded retries, try again
    if (!(window as any).__RESUME_TAILOR_JOB__ && retryCount < maxRetries) {
      retryCount++;
      setTimeout(detectJob, 500); // Wait 500ms before retrying
    }
  }
  
  // Initial detection
  detectJob();
  
  // Watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    let shouldRecheck = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain job-related content
        for (let node of mutation.addedNodes) {
          if (node instanceof Element) {
            if (node.querySelector('h1, [data-testid="job-title"], [data-jk]') || 
                node.matches('h1, [data-testid="job-title"], [data-jk]')) {
              shouldRecheck = true;
              break;
            }
          }
        }
      }
    });
    
    if (shouldRecheck) {
      setTimeout(() => {
        console.log('Resume Tailor: Page content changed, re-detecting job...');
        extractAndExposeJob();
      }, 1000);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJobDetection);
} else {
  initJobDetection();
}

// Listen for messages from the popup to open the modal
chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === 'OPEN_ANALYSIS_PANEL') {
    openResumeTailorModal((window as any).__RESUME_TAILOR_JOB__ || { title: 'Job Title', company: 'Company' });
  }
});

// Auto-fill functionality with enhanced features
class AutoFillManager {
  private resumeData: any = null;
  private currentResumeVersion: any = null;
  private appliedJobs: any[] = [];
  
  constructor() {
    this.loadResumeData();
    this.loadAppliedJobs();
  }
  
  private async loadResumeData() {
    try {
      const result = await chrome.storage.sync.get(['currentResume', 'selectedVersion']);
      this.resumeData = result.currentResume;
      this.currentResumeVersion = result.selectedVersion;
    } catch (error) {
      console.log('No resume data found');
    }
  }

  private async loadAppliedJobs() {
    try {
      const result = await chrome.storage.sync.get(['appliedJobs']);
      this.appliedJobs = result.appliedJobs || [];
    } catch (error) {
      console.log('No applied jobs history found');
    }
  }

  private async saveApplicationRecord(jobData: any, resumeVersion: any) {
    const applicationRecord = {
      id: Date.now().toString(),
      jobTitle: jobData.title,
      company: jobData.company,
      location: jobData.location,
      appliedAt: Date.now(),
      resumeVersion: resumeVersion,
      url: window.location.href,
      status: 'applied'
    };

    this.appliedJobs.push(applicationRecord);
    
    try {
      await chrome.storage.sync.set({ appliedJobs: this.appliedJobs });
      console.log('Application recorded:', applicationRecord);
    } catch (error) {
      console.error('Error saving application record:', error);
    }
  }
  
  public detectJobApplicationForm(): boolean {
    const formSelectors = [
      'form[class*="application"]',
      'form[class*="apply"]',
      'form[id*="job"]',
      'form[id*="application"]',
      '.application-form',
      '.job-application',
      '[data-testid*="apply"]',
      '[class*="apply-form"]',
      // Add more specific selectors for major job sites
      '.jobs-apply-form', // LinkedIn
      '#apply-form', // Indeed
      '.application-form-container',
      '[data-cy="job-apply-form"]'
    ];
    
    return formSelectors.some(selector => document.querySelector(selector));
  }
  
  public analyzeFormFields(): any[] {
    const fields: any[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input: any) => {
      // Skip hidden inputs and non-relevant fields
      if (input.type === 'hidden' || input.style.display === 'none') return;
      
      const field = {
        element: input,
        type: input.type || input.tagName.toLowerCase(),
        name: input.name || input.id,
        placeholder: input.placeholder,
        label: this.getFieldLabel(input),
        value: input.value,
        confidence: this.calculateFieldConfidence(input)
      };
      
      fields.push(field);
    });
    
    return fields.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateFieldConfidence(input: Element): number {
    const fieldName = (input.getAttribute('name') || input.getAttribute('id') || '').toLowerCase();
    const fieldLabel = this.getFieldLabel(input).toLowerCase();
    const fieldText = (fieldName + ' ' + fieldLabel).toLowerCase();

    // Higher confidence for exact matches
    const patterns = [
      { pattern: /^(first.?name|fname|firstname)$/, score: 100 },
      { pattern: /^(last.?name|lname|lastname|surname)$/, score: 100 },
      { pattern: /^(full.?name|name)$/, score: 95 },
      { pattern: /^email$/, score: 100 },
      { pattern: /^phone$/, score: 100 },
      { pattern: /^(address|location)$/, score: 90 },
      { pattern: /linkedin/, score: 85 },
      { pattern: /github/, score: 85 },
      { pattern: /(cover.?letter|message)/, score: 80 },
      { pattern: /(resume|cv)/, score: 75 }
    ];

    for (const { pattern, score } of patterns) {
      if (pattern.test(fieldText)) {
        return score;
      }
    }

    return 0;
  }
  
  private getFieldLabel(input: Element): string {
    // Try to find associated label
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
    }
    
    // Look for nearby label text
    const parent = input.parentElement;
    if (parent) {
      const label = parent.querySelector('label');
      if (label) return label.textContent?.trim() || '';
      
      // Check for text content in parent
      const textContent = parent.textContent?.trim() || '';
      if (textContent.length < 100) return textContent;
    }
    
    return '';
  }
  
  public async autoFillForm(fields: any[]) {
    if (!this.resumeData && !this.currentResumeVersion) {
      this.showNotification('No resume data available. Please set up your resume first.', 'error');
      return;
    }

    const resumeData = this.currentResumeVersion || this.resumeData;
    const personalInfo = resumeData.sections?.find((s: any) => s.type === 'personal')?.content || {};
    let fillCount = 0;
    
    for (const field of fields) {
      if (field.confidence === 0) continue;

      const fieldName = field.name?.toLowerCase() || '';
      const fieldLabel = field.label?.toLowerCase() || '';
      const fieldText = (fieldName + ' ' + fieldLabel).toLowerCase();
      
      let value = '';
      
      // Enhanced field mapping with better pattern matching
      if (fieldText.includes('first') && fieldText.includes('name')) {
        value = personalInfo.name?.split(' ')[0] || '';
      } else if (fieldText.includes('last') && fieldText.includes('name')) {
        value = personalInfo.name?.split(' ').slice(1).join(' ') || '';
      } else if (fieldText.includes('full') && fieldText.includes('name') || fieldText === 'name') {
        value = personalInfo.name || '';
      } else if (fieldText.includes('email')) {
        value = personalInfo.email || '';
      } else if (fieldText.includes('phone')) {
        value = personalInfo.phone || '';
      } else if (fieldText.includes('address') || fieldText.includes('location')) {
        value = personalInfo.location || '';
      } else if (fieldText.includes('linkedin')) {
        value = personalInfo.linkedin || '';
      } else if (fieldText.includes('github')) {
        value = personalInfo.github || '';
      } else if (fieldText.includes('website') || fieldText.includes('portfolio')) {
        value = personalInfo.website || '';
      } else if (fieldText.includes('cover') && fieldText.includes('letter')) {
        const summary = resumeData.sections?.find((s: any) => s.type === 'summary')?.content?.text || '';
        const jobData = (window as any).__RESUME_TAILOR_JOB__;
        value = this.generateCoverLetter(personalInfo, summary, jobData);
      }
      
      if (value && field.element) {
        await this.simulateTyping(field.element, value);
        fillCount++;
        
        // Add small delay between fields for more natural behavior
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      }
    }
    
    if (fillCount > 0) {
      this.showNotification(`Successfully filled ${fillCount} fields with your resume data!`, 'success');
      
      // Record application
      const jobData = (window as any).__RESUME_TAILOR_JOB__;
      if (jobData) {
        await this.saveApplicationRecord(jobData, this.currentResumeVersion);
      }
    } else {
      this.showNotification('No matching fields found to fill.', 'error');
    }
  }

  private generateCoverLetter(personalInfo: any, summary: string, jobData: any): string {
    if (!jobData) {
      return `Dear Hiring Manager,\n\n${summary}\n\nI am excited about the opportunity to contribute to your team.\n\nBest regards,\n${personalInfo.name}`;
    }

    return `Dear ${jobData.company} Hiring Team,

I am writing to express my strong interest in the ${jobData.title} position at ${jobData.company}. 

${summary}

I am particularly drawn to ${jobData.company} because of your commitment to innovation and excellence. I believe my skills and experience make me a strong candidate for this role, and I would welcome the opportunity to contribute to your team's continued success.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${personalInfo.name}`;
  }
  
  private async simulateTyping(element: any, text: string) {
    element.focus();
    element.value = '';
    
    // Dispatch input events to trigger any JavaScript listeners
    element.dispatchEvent(new Event('focus'));
    
    // Type character by character for more realistic behavior
    for (let i = 0; i < text.length; i++) {
      element.value += text[i];
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Random typing speed (30-80ms per character)
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
    }
    
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur'));
  }
  
  public showAutofillButton() {
    if (document.getElementById('resume-tailor-autofill-btn')) return;
    
    const button = document.createElement('div');
    button.id = 'resume-tailor-autofill-btn';
    button.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
      ">
        <button id="autofill-btn" style="
          background: linear-gradient(135deg, #0ea5e9, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          🤖 Auto-fill Resume
        </button>
        
        <button id="resume-upload-btn" style="
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        ">
          📎 Attach Resume
        </button>
      </div>
    `;
    
    const autofillBtn = button.querySelector('#autofill-btn')!;
    const uploadBtn = button.querySelector('#resume-upload-btn')!;
    
    autofillBtn.addEventListener('click', () => {
      const fields = this.analyzeFormFields();
      this.autoFillForm(fields);
    });

    uploadBtn.addEventListener('click', () => {
      this.attachResumeFile();
    });
    
    // Hover effects
    [autofillBtn, uploadBtn].forEach(btn => {
      btn.addEventListener('mouseenter', (e: any) => {
        e.target.style.transform = 'scale(1.05)';
      });
      
      btn.addEventListener('mouseleave', (e: any) => {
        e.target.style.transform = 'scale(1)';
      });
    });
    
    document.body.appendChild(button);
  }

  private attachResumeFile() {
    // Look for file upload inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    let resumeInput = null;

    for (const input of fileInputs) {
      const inputElement = input as HTMLInputElement;
      const name = inputElement.name || inputElement.id || '';
      const label = this.getFieldLabel(inputElement);
      
      if (name.toLowerCase().includes('resume') || 
          name.toLowerCase().includes('cv') ||
          label.toLowerCase().includes('resume') ||
          label.toLowerCase().includes('cv')) {
        resumeInput = inputElement;
        break;
      }
    }

    if (resumeInput) {
      // Trigger the file input click
      resumeInput.click();
      this.showNotification('File picker opened. Please select your resume file.', 'success');
    } else {
      this.showNotification('No resume upload field found on this page.', 'error');
    }
  }
  
  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// Initialize auto-fill manager
const autoFillManager = new AutoFillManager();

// Check for job application forms
function checkForJobApplicationForm() {
  if (autoFillManager.detectJobApplicationForm()) {
    console.log('Resume Tailor: Job application form detected');
    autoFillManager.showAutofillButton();
  }
}

// Run checks on page load and navigation
setTimeout(checkForJobApplicationForm, 2000); // Delay to ensure page is fully loaded

// Also check after any DOM changes (for SPA navigation)
const formObserver = new MutationObserver(() => {
  setTimeout(checkForJobApplicationForm, 1000);
});

formObserver.observe(document.body, {
  childList: true,
  subtree: true
});
