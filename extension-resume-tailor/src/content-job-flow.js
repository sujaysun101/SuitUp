// Content script: Scrape job description and send to backend
function getJobDescription() {
  // Example: scrape from LinkedIn/Indeed/Glassdoor
  // Replace selectors as needed
  const title = document.querySelector('h1')?.innerText || '';
  const description = document.querySelector('.jobsearch-jobDescriptionText, .description, .job-desc')?.innerText || '';
  const url = window.location.href;
  return { title, description, url };
}

function sendJobToBackend(jobData) {
  fetch('http://localhost:8000/api/job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  })
    .then(res => res.json())
    .then(data => {
      // Store job_id for webapp
      localStorage.setItem('resume_tailor_job_id', data.job_id);
      // Open/focus webapp dashboard
      window.open('http://localhost:5173/dashboard?job_id=' + data.job_id, '_blank');
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ANALYZE_JOB') {
    const jobData = getJobDescription();
    sendJobToBackend(jobData);
    sendResponse({ status: 'sent' });
  }
});
