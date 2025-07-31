import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  FileText, 
  Search,
  TrendingUp,
  Zap,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  History,
  Lightbulb,
  Bot
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/clerk-react';

// Mock Components
const GoogleDocViewer = () => (
  <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
    <p className="text-slate-500">Google Docs Iframe / Editor will be here</p>
  </div>
);

const ChatPanel = () => (
    <div className="w-full h-full flex flex-col bg-slate-800/30 border-l border-slate-700/50">
        <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Assistant
            </h2>
        </div>
        <div className="flex-grow p-4 text-sm text-slate-400 overflow-y-auto">
            {/* Chat messages will go here */}
            <p>Welcome! Paste a job description below to get started.</p>
        </div>
        <div className="p-4 border-t border-slate-700">
            <textarea 
                placeholder="Paste job description here..." 
                className="w-full h-24 bg-slate-800 border border-slate-600 rounded-md p-2 text-white resize-none mb-2"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
              Analyze
            </button>
        </div>
    </div>
);

interface JobData {
  id: string
  title: string
  company: string
  location: string
  url: string
  status: 'analyzing' | 'completed' | 'pending'
  matchScore?: number
  timestamp: number
}

interface ResumeData {
  id: string
  name: string
  lastModified: number
  matchScore?: number
  status: 'draft' | 'optimized' | 'applied'
}

export default function Dashboard() {
  const { user } = useUser();
  const [recentJobs, setRecentJobs] = useState<JobData[]>([])
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([])
  const [stats, setStats] = useState({
    totalResumes: 0,
    jobsAnalyzed: 0,
    avgMatchScore: 0,
    applicationsSubmitted: 0
  })

  useEffect(() => {
    // Load data from API or storage
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Mock data for demonstration
    setRecentJobs([
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        url: 'https://example.com/job1',
        status: 'completed',
        matchScore: 92,
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        url: 'https://example.com/job2',
        status: 'analyzing',
        timestamp: Date.now() - 1800000
      }
    ])

    setSavedResumes([
      {
        id: '1',
        name: 'Frontend Developer Resume',
        lastModified: Date.now() - 7200000,
        matchScore: 92,
        status: 'optimized'
      },
      {
        id: '2',
        name: 'Full Stack Resume',
        lastModified: Date.now() - 14400000,
        status: 'draft'
      }
    ])

    setStats({
      totalResumes: 5,
      jobsAnalyzed: 23,
      avgMatchScore: 87,
      applicationsSubmitted: 12
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor(diff / 60000)
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  return (
    <div className="flex h-screen w-full bg-slate-900 text-white font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">Resume Tailor</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <a href="#" className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
            <History className="w-5 h-5 mr-3" />
            Job History
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
            <FileText className="w-5 h-5 mr-3" />
            Resume Versions
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
            <Lightbulb className="w-5 h-5 mr-3" />
            Suggestions
          </a>
        </nav>
        <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
                <img src={user?.imageUrl} alt={user?.fullName || 'User'} className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                    <p className="font-semibold text-sm">{user?.fullName}</p>
                    <p className="text-xs text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-200">Welcome, {user?.firstName}!</h2>
          <p className="text-slate-400">Let's get your resume tailored for your next big opportunity.</p>
        </header>
        <div className="flex-1">
          <GoogleDocViewer />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-96 flex-shrink-0">
        <ChatPanel />
      </aside>
    </div>
  )
}
