import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardHeader, CardContent } from "./components/ui/card.tsx";
import { Button } from "./components/ui/button.tsx";
import { Badge } from "./components/ui/badge.tsx";
import { Textarea } from "./components/ui/textarea.tsx";
import { Input } from "./components/ui/input.tsx";
import { Progress } from "./components/ui/progress.tsx";
import { Alert, AlertDescription } from "./components/ui/alert.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx";
import { 
  Sparkles, 
  Target, 
  CheckCircle, 
  Save,
  Copy,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface JobData {
  title: string;
  company: string;
  description?: string;
  location?: string;
  url?: string;
  timestamp?: number;
}

interface AIAnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  keywordFrequency: { [key: string]: number };
  suggestions: BulletPointSuggestion[];
}

interface BulletPointSuggestion {
  id: string;
  original: string;
  suggested: string;
  reason: string;
  accepted: boolean;
}

interface ResumeVersion {
  id: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  createdAt: number;
  bullets: BulletPointSuggestion[];
}

const PopupApp: React.FC = () => {
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('detect');
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    loadJobData();
    loadResumeVersions();
    loadSavedResume();
  }, []);

  const loadJobData = async () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0]?.id) {
          try {
            const results = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => (window as any).__RESUME_TAILOR_JOB__
            });
            
            if (results[0]?.result) {
              setCurrentJob(results[0].result);
            }
          } catch (error) {
            console.log('Could not detect job data');
          }
        }
      });
    } catch (error) {
      console.error('Error loading job data:', error);
    }
  };

  const loadSavedResume = async () => {
    try {
      const result = await chrome.storage.sync.get(['savedResume']);
      if (result.savedResume) {
        setResumeText(result.savedResume);
      }
    } catch (error) {
      console.error('Error loading saved resume:', error);
    }
  };

  const saveResume = async () => {
    try {
      await chrome.storage.sync.set({ savedResume: resumeText });
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const loadResumeVersions = async () => {
    try {
      const result = await chrome.storage.sync.get(['resumeVersions']);
      if (result.resumeVersions) {
        setResumeVersions(result.resumeVersions);
      }
    } catch (error) {
      console.error('Error loading resume versions:', error);
    }
  };

  const analyzeResume = async () => {
    if (!currentJob || !resumeText) return;

    setIsAnalyzing(true);
    setActiveTab('analysis');

    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const mockAnalysis: AIAnalysisResult = {
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        missingKeywords: ['React', 'TypeScript', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1),
        keywordFrequency: {
          'JavaScript': 5,
          'React': 3,
          'TypeScript': 2,
          'CSS': 4
        },
        suggestions: [
          {
            id: '1',
            original: 'Developed web applications using modern technologies',
            suggested: `Developed ${currentJob.company}-specific web applications using React, TypeScript, and modern web technologies`,
            reason: 'More specific to the role and includes key technologies',
            accepted: false
          },
          {
            id: '2',
            original: 'Improved user experience and performance',
            suggested: 'Enhanced user experience by 40% and improved application performance through optimization techniques',
            reason: 'Added quantifiable metrics and specific outcomes',
            accepted: false
          }
        ]
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const acceptSuggestion = (id: string) => {
    if (!analysis) return;
    
    const updatedSuggestions = analysis.suggestions.map(s => 
      s.id === id ? { ...s, accepted: true } : s
    );
    
    setAnalysis({ ...analysis, suggestions: updatedSuggestions });
  };

  const editSuggestion = (id: string, newText: string) => {
    if (!analysis) return;
    
    const updatedSuggestions = analysis.suggestions.map(s => 
      s.id === id ? { ...s, suggested: newText } : s
    );
    
    setAnalysis({ ...analysis, suggestions: updatedSuggestions });
  };

  const saveTailoredVersion = async () => {
    if (!currentJob || !analysis) return;

    const newVersion: ResumeVersion = {
      id: Date.now().toString(),
      jobTitle: currentJob.title,
      company: currentJob.company,
      matchScore: analysis.matchScore,
      createdAt: Date.now(),
      bullets: analysis.suggestions
    };

    const updatedVersions = [...resumeVersions, newVersion];
    setResumeVersions(updatedVersions);
    
    try {
      await chrome.storage.sync.set({ resumeVersions: updatedVersions });
      setActiveTab('versions');
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  const openWebApp = () => {
    chrome.tabs.create({ url: 'http://localhost:5173/job-analysis' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target?.result as string);
        saveResume();
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-96 min-h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Resume Tailor
        </h1>
        <p className="text-sm text-slate-300">AI-powered job application assistant</p>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="detect">Detect</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>

          {/* Job Detection Tab */}
          <TabsContent value="detect" className="space-y-3">
            {currentJob ? (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Job Detected</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold text-white">{currentJob.title}</h3>
                  <p className="text-sm text-slate-300">{currentJob.company}</p>
                  {currentJob.location && (
                    <p className="text-xs text-slate-400">{currentJob.location}</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Alert className="bg-yellow-500/10 border-yellow-500/20">
                <AlertDescription className="text-yellow-200">
                  Navigate to a job posting on LinkedIn, Indeed, or other supported sites
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={analyzeResume} 
                disabled={!currentJob || !resumeText || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={openWebApp} className="px-3">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Resume Upload Tab */}
          <TabsContent value="upload" className="space-y-3">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Resume</label>
                <Input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Or Paste Resume Text</label>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="bg-white/5 border-white/10 min-h-[200px] text-sm"
                />
              </div>

              <Button onClick={saveResume} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Resume
              </Button>
            </div>
          </TabsContent>

          {/* Analysis Results Tab */}
          <TabsContent value="analysis" className="space-y-3">
            {analysis ? (
              <div className="space-y-4">
                {/* Match Score */}
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Match Score</span>
                      <Badge variant={analysis.matchScore >= 80 ? "default" : analysis.matchScore >= 60 ? "secondary" : "destructive"}>
                        {analysis.matchScore}%
                      </Badge>
                    </div>
                    <Progress value={analysis.matchScore} className="h-2" />
                  </CardContent>
                </Card>

                {/* Missing Keywords */}
                {analysis.missingKeywords.length > 0 && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                      <h4 className="text-sm font-medium">Missing Keywords</h4>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Bullet Point Suggestions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Suggestions</h4>
                  {analysis.suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="bg-white/5 border-white/10">
                      <CardContent className="pt-4 space-y-3">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Original:</p>
                          <p className="text-sm text-slate-300">{suggestion.original}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Suggested:</p>
                          <Textarea
                            value={suggestion.suggested}
                            onChange={(e) => editSuggestion(suggestion.id, e.target.value)}
                            className="bg-white/10 border-white/20 text-sm min-h-[60px]"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-blue-300">{suggestion.reason}</p>
                          <Button
                            size="sm"
                            onClick={() => acceptSuggestion(suggestion.id)}
                            variant={suggestion.accepted ? "default" : "outline"}
                            className="text-xs"
                          >
                            {suggestion.accepted ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accepted
                              </>
                            ) : (
                              'Accept'
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button onClick={saveTailoredVersion} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Tailored Version
                </Button>
              </div>
            ) : (
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertDescription className="text-blue-200">
                  Run analysis from the Detect tab to see results here
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Resume Versions Tab */}
          <TabsContent value="versions" className="space-y-3">
            {resumeVersions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Tailored Versions</h4>
                {resumeVersions.map((version) => (
                  <Card 
                    key={version.id} 
                    className={`bg-white/5 border-white/10 cursor-pointer transition-colors ${
                      selectedVersion === version.id ? 'bg-blue-500/20 border-blue-500/30' : ''
                    }`}
                    onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="text-sm font-medium">{version.jobTitle}</h5>
                          <p className="text-xs text-slate-400">{version.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={version.matchScore >= 80 ? "default" : "outline"} className="text-xs">
                            {version.matchScore}%
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(version.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {selectedVersion === version.id && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="bg-slate-500/10 border-slate-500/20">
                <AlertDescription className="text-slate-300">
                  No tailored versions yet. Analyze a job to create your first version.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>v2.0.0</span>
          <Button variant="ghost" size="sm" onClick={openWebApp} className="text-xs">
            Open Full App
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}
