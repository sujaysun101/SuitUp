// Utility to send Clerk session token to Chrome extension

declare const chrome: any;

// Call this function from your React component after sign-in, passing the token and extensionId
export function sendClerkTokenToExtension(extensionId: string, token: string) {
  if (token && chrome?.runtime?.sendMessage) {
    chrome.runtime.sendMessage(extensionId, {
      type: 'CLERK_TOKEN',
      token,
    });
  }
}
