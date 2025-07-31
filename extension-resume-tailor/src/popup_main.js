
import { getClerkToken } from './clerk-session-listener.js';

const root = document.getElementById('root');

getClerkToken((token) => {
  if (!token) {
    root.innerHTML = `<div class="p-4 text-center">Please sign in via the webapp first.</div>`;
  } else {
    root.innerHTML = `<div class="p-4 flex flex-col items-center">
      <h2 class="font-bold mb-2">Resume Tailor</h2>
      <button id="analyzeBtn" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition mb-2">Analyze Job and Tailor Resume</button>
      <div id="status" class="text-gray-500 text-sm"></div>
    </div>`;
    document.getElementById('analyzeBtn').onclick = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'ANALYZE_JOB' }, (resp) => {
          document.getElementById('status').innerText = 'Job sent! Check the webapp.';
        });
      });
    };
  }
});
