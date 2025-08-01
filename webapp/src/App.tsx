

import React, { useEffect, useState } from "react";
import GoogleDocsPanel from "./components/GoogleDocsPanel";
import LLMChatPanel from "./components/LLMChatPanel";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

// Job Analysis Types
interface JobAnalysis {
  status: string;
  analysis: any;
  jobData: {
    title: string;
    company: string;
    description: string;
    url: string;
  };
  timestamp: number;
}

// Placeholder components for now
const Sidebar = () => (
  <aside className="w-64 min-h-full bg-white/10 backdrop-blur-lg rounded-xl m-4 p-6 flex flex-col gap-8 border border-white/20 shadow-lg">
    <div className="text-lg font-bold text-white mb-4">Dashboard</div>
    <div className="text-white/80">Job History</div>
    <div className="text-white/80">Resume Versions</div>
    <div className="text-white/80">Suggested Improvements</div>
  </aside>
);

const JobAnalysisPanel = ({ analysis }: { analysis: JobAnalysis | null }) => {
  if (!analysis) return null;

  return (
    <div className="mx-4 my-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6">
      <div className="text-white/80 text-xl mb-4">📊 Job Analysis Results</div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{analysis.jobData.title}</h3>
          <p className="text-white/70 mb-2">at {analysis.jobData.company}</p>
          <a 
            href={analysis.jobData.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View Original Job Posting →
          </a>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">AI Analysis:</h4>
          <div className="text-white/80 text-sm">
            {typeof analysis.analysis === 'string' ? (
              <pre className="whitespace-pre-wrap">{analysis.analysis}</pre>
            ) : (
              <div className="space-y-2">
                {analysis.analysis.keySkills && (
                  <div>
                    <strong>Key Skills:</strong> {JSON.stringify(analysis.analysis.keySkills)}
                  </div>
                )}
                {analysis.analysis.keywords && (
                  <div>
                    <strong>Keywords:</strong> {JSON.stringify(analysis.analysis.keywords)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};






const App: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);

  // Check onboarding status after sign-in
  useEffect(() => {
    if (isSignedIn && user) {
      const completed = user.publicMetadata?.onboardingComplete;
      setShowOnboarding(!completed);
      setCheckingOnboarding(false);
    } else {
      setShowOnboarding(false);
      setCheckingOnboarding(false);
    }
  }, [isSignedIn, user]);

  // Listen for job analysis results from extension
  useEffect(() => {
    // Send ready message to content script
    window.postMessage({ type: 'WEBAPP_READY' }, window.location.origin);
    
    const handleJobAnalysis = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'JOB_ANALYSIS_COMPLETE') {
        console.log('Received job analysis:', event.data.analysis);
        setJobAnalysis(event.data.analysis);
      }
    };

    window.addEventListener('message', handleJobAnalysis);
    return () => window.removeEventListener('message', handleJobAnalysis);
  }, []);

  // Mark onboarding as complete in Clerk metadata
  const handleOnboardingComplete = async () => {
    if (user) {
      try {
        await fetch("http://localhost:8000/api/mark-onboarding-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id })
        });
        setShowOnboarding(false);
      } catch (e) {
        console.log("Marking onboarding complete in localStorage instead");
        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <span className="text-3xl font-extrabold text-white tracking-tight">Resume Tailor</span>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Sign In</button>
          </SignInButton>
        </SignedOut>
      </header>
      
      {/* Main Layout */}
      <SignedIn>
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            {/* Job Analysis Results (if available) */}
            {jobAnalysis && <JobAnalysisPanel analysis={jobAnalysis} />}
            
            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              <GoogleDocsPanel />
              <LLMChatPanel jobAnalysis={jobAnalysis} />
            </div>
          </main>
        </div>
      </SignedIn>
      
      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/80 text-xl">Sign in to access your dashboard</div>
        </div>
      </SignedOut>
      
      {isSignedIn && showOnboarding && !checkingOnboarding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Resume Tailor! 🎯</h2>
            <div className="text-white/90 space-y-3 mb-6">
              <p>Here's how to get started:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Visit a job posting on Indeed, LinkedIn, or similar sites</li>
                <li>Click our Chrome extension icon to analyze the job</li>
                <li>Return here to see AI-powered resume suggestions</li>
                <li>Edit your resume directly in Google Docs</li>
              </ol>
            </div>
            <button
              onClick={handleOnboardingComplete}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Got it! Let's start
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
