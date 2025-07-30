import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from "../../extension/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../extension/src/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../extension/src/components/ui/tabs";
import { Badge } from "../../extension/src/components/ui/badge";
import { Separator } from "../../extension/src/components/ui/separator";
import { Switch } from "../../extension/src/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../extension/src/components/ui/tooltip";
import { Progress } from "../../extension/src/components/ui/progress";
import { Alert, AlertDescription } from "../../extension/src/components/ui/alert";

interface JobData {
  title: string;
  company: string;
  description: string;
  location?: string;
  url?: string;
  timestamp?: number;
}

interface SavedResume {
  id: number;
  title: string;
  company: string;
  content: string;
  timestamp: number;
}

const PopupApp = () => {
  const [currentJob, setCurrentJob] = useState(null as JobData | null);
  const [savedResumes, setSavedResumes] = useState<Array<SavedResume>>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current tab URL to check if we're on a job site
      await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Get saved resumes
      const result = await chrome.storage.sync.get(['savedResumes']);
      setSavedResumes(result.savedResumes || []);
      
      // Get recent job data from local storage
      const localData = await chrome.storage.local.get();
      const jobEntries = Object.entries(localData)
        .filter(([key]) => key.startsWith('job_'))
        .map(([, value]) => value as JobData)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      
      if (jobEntries.length > 0) {
        setCurrentJob(jobEntries[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleAnalyzeResume = () => {
    // Simulate analysis progress
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Send message to content script to open analysis panel
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { type: 'OPEN_ANALYSIS_PANEL' });
          });
          window.close();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`w-96 h-64 flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`w-96 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} transition-colors duration-200`}>
        {/* Header */}
        <div className={`${isDarkMode 
          ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <span className="text-cyan-400">⚡</span>
                Resume Tailor
              </h1>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'} text-sm`}>
                AI-Powered Job Assistant
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">🌙</span>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle dark mode</p>
                </TooltipContent>
              </Tooltip>
              <div className={`${isDarkMode ? 'bg-slate-600/50' : 'bg-white/10'} rounded-full w-10 h-10 flex items-center justify-center`}>
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'current' | 'history')} className="w-full">
          <TabsList className={`w-full grid grid-cols-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100'}`}>
            <TabsTrigger 
              value="current" 
              className={`${isDarkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' : ''}`}
            >
              Current Job
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className={`${isDarkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' : ''} flex items-center gap-2`}
            >
              History 
              <Badge variant={isDarkMode ? "secondary" : "outline"} className={`${isDarkMode ? 'bg-slate-600 text-slate-200' : ''}`}>
                {savedResumes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="p-4">
            <TabsContent value="current">
              {currentJob ? (
                <div className="space-y-4">
                  <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg ${isDarkMode ? 'text-slate-100' : 'text-gray-900'} flex items-center gap-2`}>
                          <span className="text-green-500">✓</span>
                          Job Detected
                        </CardTitle>
                        <Badge variant="secondary" className={`${isDarkMode ? 'bg-cyan-900/50 text-cyan-300' : 'bg-blue-100 text-blue-800'}`}>
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3">
                        <div>
                          <span className={`font-medium text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Position:</span>
                          <p className={`${isDarkMode ? 'text-slate-100' : 'text-gray-900'} font-medium`}>{currentJob.title}</p>
                        </div>
                        <Separator className={isDarkMode ? 'bg-slate-700' : ''} />
                        <div>
                          <span className={`font-medium text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Company:</span>
                          <p className={`${isDarkMode ? 'text-slate-100' : 'text-gray-900'} font-medium`}>{currentJob.company}</p>
                        </div>
                        {currentJob.location && (
                          <>
                            <Separator className={isDarkMode ? 'bg-slate-700' : ''} />
                            <div>
                              <span className={`font-medium text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Location:</span>
                              <p className={`${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{currentJob.location}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {analysisProgress > 0 && (
                    <Alert className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : ''}`}>
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Analyzing job requirements...</span>
                            <span className={`font-medium ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{analysisProgress}%</span>
                          </div>
                          <Progress 
                            value={analysisProgress} 
                            className={`h-2 ${isDarkMode ? 'bg-slate-700' : ''}`}
                          />
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={handleAnalyzeResume}
                          className={`${isDarkMode 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          } text-white border-0 transition-all duration-200`}
                          size="lg"
                        >
                          <span className="mr-2">🚀</span>
                          Analyze & Tailor Resume
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI-powered resume optimization for this job</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleOpenSettings}
                      className={`${isDarkMode 
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100' 
                        : ''
                      }`}
                    >
                      ⚙️ Settings
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className={`text-center py-8 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                      No Job Detected
                    </h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Navigate to a job posting on LinkedIn, Indeed, or other supported sites.
                    </p>
                    <Badge variant="secondary" className={`${isDarkMode ? 'bg-slate-700 text-slate-300' : ''}`}>
                      Supported: LinkedIn, Indeed, Glassdoor, Google Jobs
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              {savedResumes.length > 0 ? (
                <div className="space-y-3">
                  {savedResumes.slice(0, 5).map((resume) => (
                    <Card key={resume.id} className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium text-sm truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                                {resume.title}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${isDarkMode ? 'border-slate-600 text-slate-400' : ''}`}>
                                v{resume.id}
                              </Badge>
                            </div>
                            <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {resume.company}
                            </p>
                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                              {formatDate(resume.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Separator className={`my-3 ${isDarkMode ? 'bg-slate-700' : ''}`} />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`flex-1 ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : ''}`}
                          >
                            📄 View
                          </Button>
                          <Button 
                            size="sm" 
                            className={`flex-1 ${isDarkMode 
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            📥 Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {savedResumes.length > 5 && (
                    <Button 
                      variant="ghost" 
                      className={`w-full ${isDarkMode 
                        ? 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800' 
                        : 'text-blue-600 hover:text-blue-700'
                      } transition-colors`}
                    >
                      View All ({savedResumes.length})
                    </Button>
                  )}
                </div>
              ) : (
                <Card className={`text-center py-8 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                      No Resume History
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Start tailoring resumes to build your history.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>

          {/* Footer */}
          <div className={`border-t p-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>Resume Tailor</span>
                <Badge variant="outline" className={`text-xs ${isDarkMode ? 'border-slate-600 text-slate-400' : ''}`}>
                  v1.0.0
                </Badge>
              </div>
              <div className="flex gap-3">
                <button className={`${isDarkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
                  Help
                </button>
                <button className={`${isDarkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
                  Feedback
                </button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

// Initialize the popup
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
