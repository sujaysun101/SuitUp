// Listen for Clerk token from webapp and store in chrome.storage.local
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CLERK_TOKEN') {
    chrome.storage.local.set({ clerkToken: message.token });
  }
});

// Utility to get token for API requests
export function getClerkToken(callback) {
  chrome.storage.local.get(['clerkToken'], (result) => {
    callback(result.clerkToken);
  });
}
