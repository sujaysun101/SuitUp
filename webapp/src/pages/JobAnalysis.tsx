import { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
// If the Progress component exists at a different path, update the import accordingly.
// Example: If it is at 'src/components/Progress.tsx', use:
import { Progress } from '../components/ui/progress'
// Or, if you need to create the component, create 'src/components/ui/progress.tsx' with a basic Progress component.
import { 
  Search,
  Link as LinkIcon,
  MapPin,
  Building,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'

interface JobAnalysisResult {
  title: string
  company: string
  location: string
  salary?: string
  url: string
  description: string
  requirements: string[]
  skills: string[]
  matchScore: number
  missingSkills: string[]
  recommendations: string[]
  keyInsights: {
    experienceLevel: string
    industryFocus: string
    remoteOptions: string
    growthPotential: string
  }
}

export default function JobAnalysis() {
  const [jobUrl, setJobUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null)

  const handleAnalyzeJob = async () => {
    if (!jobUrl.trim()) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15 + 5
      })
    }, 300)

    // Simulate API call
    setTimeout(() => {
      setAnalysisProgress(100)
      setIsAnalyzing(false)
      
      // Mock analysis result
      setAnalysisResult({
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA (Remote)',
        salary: '$120,000 - $160,000',
        url: jobUrl,
        description: 'We are seeking a talented Senior Frontend Developer to join our dynamic team...',
        requirements: [
          '5+ years of experience with React/Next.js',
          'Strong proficiency in TypeScript',
          'Experience with modern CSS frameworks',
          'Knowledge of state management (Redux, Zustand)',
          'Familiarity with testing frameworks (Jest, Cypress)'
        ],
        skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'JavaScript', 'HTML', 'Git', 'REST APIs'],
        matchScore: 87,
        missingSkills: ['GraphQL', 'Docker', 'AWS'],
        recommendations: [
          'Highlight your React and TypeScript experience prominently',
          'Include specific projects that demonstrate Next.js proficiency',
          'Mention any experience with testing frameworks',
          'Consider learning GraphQL to improve your match score'
        ],
        keyInsights: {
          experienceLevel: 'Senior (5+ years)',
          industryFocus: 'Technology/SaaS',
          remoteOptions: 'Fully Remote',
          growthPotential: 'High - Growing company'
        }
      })
      
      clearInterval(progressInterval)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            AI Job Analysis
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Paste any job posting URL and get detailed insights to optimize your resume
          </p>
        </motion.div>
      </div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Paste job posting URL (LinkedIn, Indeed, etc.)"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 h-12"
                />
              </div>
              <Button
                onClick={handleAnalyzeJob}
                disabled={isAnalyzing || !jobUrl.trim()}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold px-8 h-12 rounded-xl transition-all duration-300"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Analyze Job</span>
                  </div>
                )}
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Analyzing job requirements...</span>
                  <span className="text-cyan-400 font-semibold">
                    {Math.round(analysisProgress)}%
                  </span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Job Overview */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">{analysisResult.title}</h2>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>{analysisResult.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{analysisResult.location}</span>
                    </div>
                    {analysisResult.salary && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{analysisResult.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-3xl font-bold text-gradient">
                    {analysisResult.matchScore}%
                  </div>
                  <p className="text-sm text-slate-400">Match Score</p>
                  <Button variant="ghost" size="sm" className="text-cyan-400">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Original
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-cyan-400" />
                  Key Insights
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysisResult.keyInsights).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <Badge variant="outline" className="text-white border-slate-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Required Skills
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Missing Skills */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Skills to Improve
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.missingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge 
                        variant="outline"
                        className="text-yellow-400 border-yellow-500/30"
                      >
                        {skill}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs text-cyan-400">
                        Learn More
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  AI Recommendations
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <p className="text-sm text-slate-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Requirements */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Job Requirements</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl"
            >
              <FileText className="w-5 h-5 mr-2" />
              Tailor Resume for This Job
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50 px-8 py-3 rounded-xl"
            >
              Save Analysis
            </Button>
          </div>
        </motion.div>
      )}

      {/* Sample URLs */}
      {!analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Supported Platforms</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                {['LinkedIn', 'Indeed', 'Glassdoor', 'Google Jobs'].map((platform) => (
                  <div key={platform} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 flex items-center justify-center mx-auto mb-2">
                      <LinkIcon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">{platform}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
