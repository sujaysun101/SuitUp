import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardHeader, CardContent } from "./components/ui/card.tsx";
import { Button } from "./components/ui/button.tsx";
import { Badge } from "./components/ui/badge.tsx";
import { Switch } from "./components/ui/switch.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip.tsx";
import { Progress } from "./components/ui/progress.tsx";
import { Alert, AlertDescription } from "./components/ui/alert.tsx";

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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check for Clerk token on mount
  useEffect(() => {
    chrome.storage.local.get(['clerkToken'], (result) => {
      if (result.clerkToken) {
        setIsAuthenticated(true);
        loadJobData();
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
  }, []);

  const loadJobData = async () => {
    try {
      // Get current tab and inject content script to get job data
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0]?.id) {
          try {
            // Execute script to get job data from the page
            const results = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                return (window as any).__RESUME_TAILOR_JOB__;
              }
            });
            
            if (results[0]?.result) {
              setCurrentJob(results[0].result);
              console.log('Job detected:', results[0].result);
            } else {
              console.log('No job data found in page');
            }
          } catch (error) {
            console.log('Could not execute script:', error);
          }
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!currentJob) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 200);

    try {
      // Send job data to backend for analysis
      const response = await fetch('http://127.0.0.1:8000/api/jobs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `job_${Date.now()}`,
          title: currentJob.title,
          company: currentJob.company,
          location: currentJob.location || '',
          description: currentJob.description || '',
          url: currentJob.url || ''
        }),
      });
      
      if (response.ok) {
        const analysisResult = await response.json();
        
        // Open webapp with analysis results
        const webappUrl = `http://localhost:3000/job-analysis?jobId=${analysisResult.job_id}&analysis=${encodeURIComponent(JSON.stringify(analysisResult))}`;
        chrome.tabs.create({ url: webappUrl });
        
        setAnalysisProgress(100);
        setIsAnalyzing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Analysis failed');
      }
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      
      // Fallback: still open webapp but without analysis
      const webappUrl = `http://localhost:3000/job-analysis?job=${encodeURIComponent(JSON.stringify(currentJob))}`;
      chrome.tabs.create({ url: webappUrl });
    }
  };


  if (isLoading) {
    return (
      <div className="w-96 h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-sm">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="w-96 h-[500px] flex flex-col items-center justify-center bg-white rounded-lg shadow">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
        <p className="mb-4 text-gray-600">Please sign in to the Resume Tailor webapp first.</p>
        <a
          href="http://localhost:3000/sign-in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Sign In / Sign Up
        </a>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`w-96 min-h-[500px] transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}>
        
        {/* Gemini-inspired Header */}
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-purple-500/5 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/5 to-transparent"></div>
          
          <div className="relative p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">✨</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Resume Tailor AI
                  </h1>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Powered by advanced AI
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Toggle theme</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 space-y-6">
          {showSuccess && (
            <Alert className="border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
              <AlertDescription className="text-green-400 flex items-center space-x-2">
                <span>✨</span>
                <span>Analysis complete! Check the job page for tailored suggestions.</span>
              </AlertDescription>
            </Alert>
          )}

          {currentJob ? (
            <Card className={`border-0 shadow-2xl overflow-hidden ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-700/80 backdrop-blur-xl' 
                : 'bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 backdrop-blur-xl'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        LIVE JOB DETECTED
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight pr-4">{currentJob.title}</h3>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} font-medium`}>
                        {currentJob.company}
                      </span>
                      {currentJob.location && (
                        <>
                          <span className={isDarkMode ? 'text-slate-600' : 'text-gray-400'}>•</span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            📍 {currentJob.location}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 flex items-center justify-center">
                      <span className="text-2xl">💼</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} flex items-center space-x-2`}>
                        <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                        <span>Analyzing job requirements...</span>
                      </span>
                      <span className="text-cyan-400 font-semibold">
                        {Math.round(analysisProgress)}%
                      </span>
                    </div>
                    <Progress 
                      value={analysisProgress} 
                      className="h-3 bg-slate-700/50"
                    />
                  </div>
                )}
                
                <Button
                  onClick={handleAnalyzeJob}
                  disabled={isAnalyzing}
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing with AI...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🤖</span>
                      <span>Tailor Resume with AI</span>
                      <span className="text-lg">✨</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className={`border-0 shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-700/50 backdrop-blur-xl' 
                : 'bg-gradient-to-br from-white/80 via-white/60 to-gray-50/80 backdrop-blur-xl'
            }`}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-600/20 to-slate-700/20 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="font-semibold text-lg mb-3">No Job Detected</h3>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm mb-6 leading-relaxed max-w-sm mx-auto`}>
                  Navigate to a specific job posting to get AI-powered resume tailoring suggestions
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <Badge variant="outline" className="text-xs px-3 py-1">LinkedIn</Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">Indeed</Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">Google Jobs</Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">Glassdoor</Badge>
                </div>
                <Button
                  onClick={loadJobData}
                  variant="outline"
                  size="sm"
                  className={`${
                    isDarkMode 
                      ? 'border-slate-600 hover:bg-slate-700/50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } transition-all duration-200`}
                >
                  🔄 Refresh
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Grid */}
          <div className="space-y-4">
            <h4 className={`font-medium text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Quick Actions
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => chrome.tabs.create({ url: 'http://localhost:3000/resume-editor' })}
                className={`h-12 rounded-xl ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300' 
                    : 'border-gray-300 bg-white/50 hover:bg-gray-50 text-gray-700'
                } transition-all duration-200 backdrop-blur-sm`}
              >
                <span className="mr-2">📄</span>
                Resume Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => chrome.tabs.create({ url: 'http://localhost:3000/dashboard' })}
                className={`h-12 rounded-xl ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300' 
                    : 'border-gray-300 bg-white/50 hover:bg-gray-50 text-gray-700'
                } transition-all duration-200 backdrop-blur-sm`}
              >
                <span className="mr-2">📊</span>
                Dashboard
              </Button>
            </div>
          </div>

          {/* Status Footer */}
          <div className="pt-4 border-t border-slate-700/30">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                  Backend Connected
                </span>
              </div>
              <span className={`${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                v2.0 • Powered by AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
