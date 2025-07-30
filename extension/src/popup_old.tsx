import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardHeader, CardContent, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

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

const PopupApp: React.FC = () => {
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isLoading, setIsLoading] = useState(true);

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
    // Send message to content script to open analysis panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { type: 'OPEN_ANALYSIS_PANEL' });
    });
    window.close();
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
      <div className="w-96 h-64 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-96 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Resume Tailor</h1>
            <p className="text-blue-100 text-sm">AI-Powered Job Assistant</p>
          </div>
          <div className="bg-white/10 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
        </div>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'current' | 'history')} className="w-full">
        <TabsList className="flex border-b bg-white">
          <TabsTrigger value="current" className="flex-1">Current Job</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History ({savedResumes.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <CardContent>
            {currentJob ? (
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900 mb-2">Job Detected</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <p className="text-gray-900">{currentJob.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Company:</span>
                      <p className="text-gray-900">{currentJob.company}</p>
                    </div>
                    {currentJob.location && (
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-900">{currentJob.location}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Button onClick={handleAnalyzeResume} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <span>🤖</span>
                  <span>Analyze & Tailor Resume</span>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">View Job Details</Button>
                  <Button variant="outline" onClick={handleOpenSettings}>Settings</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Detected</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Navigate to a job posting on LinkedIn, Indeed, or other supported sites to get started.
                </p>
                <Button onClick={loadData} className="bg-blue-600 text-white">Refresh</Button>
              </div>
            )}
          </CardContent>
        </TabsContent>
        <TabsContent value="history">
          <CardContent>
            {savedResumes.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Tailored Resumes</h3>
                {savedResumes.slice(0, 5).map((resume) => (
                  <Card key={resume.id} className="bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <CardHeader className="flex flex-row justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{resume.title}</h4>
                        <p className="text-gray-600 text-xs">{resume.company}</p>
                      </div>
                      <span className="text-gray-500 text-xs">{formatDate(resume.timestamp)}</span>
                    </CardHeader>
                    <CardContent className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 text-white">View</Button>
                      <Button size="sm" className="bg-green-600 text-white">Download</Button>
                    </CardContent>
                  </Card>
                ))}
                {savedResumes.length > 5 && (
                  <Button variant="link" className="w-full text-blue-600">View All ({savedResumes.length})</Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Resumes</h3>
                <p className="text-gray-600 text-sm">
                  Start tailoring resumes to build your history.
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      <CardFooter className="border-t bg-gray-50 p-3 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500 w-full">
          <span>Resume Tailor v1.0.0</span>
          <div className="flex space-x-2">
            <Button variant="link" size="sm">Help</Button>
            <Button variant="link" size="sm">Feedback</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Initialize the popup
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
