
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { sendClerkTokenToExtension } from "./lib/clerk-extension-sync";
import { EXTENSION_ID } from "./lib/extension-id";


import React from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ResumePanel from './components/dashboard/ResumePanel';
import LLMChatPanel from './components/chat/LLMChatPanel';
import OnboardingJobSiteModal from './components/OnboardingJobSiteModal';


import { useState, useEffect } from 'react';


const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { sessionId, getToken } = useAuth();

  useEffect(() => {
    // Show onboarding popup after sign-in (simulate first-time or every sign-in)
    setShowOnboarding(true);
  }, []);

  // Send Clerk token to extension after sign-in
  useEffect(() => {
    if (sessionId && getToken) {
      getToken().then(token => {
        if (token) {
          sendClerkTokenToExtension(EXTENSION_ID, token);
        }
      });
    }
  }, [sessionId, getToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-950 flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-black bg-opacity-60 border-b border-gray-800">
        <span className="text-2xl font-extrabold text-white tracking-tight">Resume Tailor</span>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Sign in</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-950 to-gray-900">
          <ResumePanel />
        </div>
        <LLMChatPanel />
      </main>

      {showOnboarding && (
        <OnboardingJobSiteModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};

export default App;
