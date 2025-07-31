import { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  TrendingUp,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ApplicationRecord {
  id: string
  jobTitle: string
  company: string
  location?: string
  appliedAt: number
  status: 'applied' | 'interview' | 'rejected' | 'offer' | 'accepted'
  matchScore: number
  resumeVersion: any
  url: string
  notes?: string
}

export default function ApplicationTracking() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [analytics, setAnalytics] = useState({
    totalApplied: 0,
    interviews: 0,
    offers: 0,
    avgMatchScore: 0,
    successRate: 0
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    // In a real app, this would come from the backend
    const mockApplications: ApplicationRecord[] = [
      {
        id: '1',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        appliedAt: Date.now() - 86400000 * 2,
        status: 'interview',
        matchScore: 88,
        resumeVersion: { id: 'v1', name: 'TechCorp Version' },
        url: 'https://example.com/job1',
        notes: 'Phone interview scheduled for Friday'
      },
      {
        id: '2',
        jobTitle: 'React Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        appliedAt: Date.now() - 86400000 * 5,
        status: 'applied',
        matchScore: 92,
        resumeVersion: { id: 'v2', name: 'React Specialist Version' },
        url: 'https://example.com/job2'
      },
      {
        id: '3',
        jobTitle: 'Full Stack Engineer',
        company: 'MegaCorp',
        location: 'New York, NY',
        appliedAt: Date.now() - 86400000 * 7,
        status: 'rejected',
        matchScore: 76,
        resumeVersion: { id: 'v3', name: 'Full Stack Version' },
        url: 'https://example.com/job3',
        notes: 'Feedback: Need more backend experience'
      },
      {
        id: '4',
        jobTitle: 'UI/UX Developer',
        company: 'DesignStudio',
        location: 'Los Angeles, CA',
        appliedAt: Date.now() - 86400000 * 10,
        status: 'offer',
        matchScore: 95,
        resumeVersion: { id: 'v4', name: 'Design-Focused Version' },
        url: 'https://example.com/job4',
        notes: 'Offer expires next week'
      }
    ]

    setApplications(mockApplications)
    
    // Calculate analytics
    const analytics = {
      totalApplied: mockApplications.length,
      interviews: mockApplications.filter(a => a.status === 'interview').length,
      offers: mockApplications.filter(a => a.status === 'offer' || a.status === 'accepted').length,
      avgMatchScore: Math.round(mockApplications.reduce((sum, a) => sum + a.matchScore, 0) / mockApplications.length),
      successRate: Math.round((mockApplications.filter(a => ['interview', 'offer', 'accepted'].includes(a.status)).length / mockApplications.length) * 100)
    }
    
    setAnalytics(analytics)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'interview': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'offer': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'accepted': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-3 h-3" />
      case 'interview': return <AlertCircle className="w-3 h-3" />
      case 'offer': case 'accepted': return <CheckCircle className="w-3 h-3" />
      case 'rejected': return <AlertCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Application Tracking
        </h1>
        <p className="text-slate-400">Monitor your job applications and success metrics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Applied</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalApplied}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Interviews</p>
                  <p className="text-2xl font-bold text-white">{analytics.interviews}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Offers</p>
                  <p className="text-2xl font-bold text-white">{analytics.offers}</p>
                </div>
                <Star className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Match</p>
                  <p className="text-2xl font-bold text-white">{analytics.avgMatchScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{analytics.successRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="glass-effect border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs or companies..."
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'applied' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('applied')}
                size="sm"
              >
                Applied
              </Button>
              <Button
                variant={statusFilter === 'interview' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('interview')}
                size="sm"
              >
                Interview
              </Button>
              <Button
                variant={statusFilter === 'offer' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('offer')}
                size="sm"
              >
                Offers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="glass-effect border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{app.jobTitle}</h3>
                      <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </div>
                    <p className="text-slate-300 font-medium">{app.company}</p>
                    {app.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {app.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {app.matchScore}% match
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open job posting for ${app.jobTitle} at ${app.company}`}
                          title={`Open job posting for ${app.jobTitle} at ${app.company}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Resume: {app.resumeVersion.name}</span>
                  </div>
                  {app.notes && (
                    <div className="flex-1 mx-4">
                      <p className="text-sm text-slate-300 italic">"{app.notes}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="glass-effect border-white/10">
          <CardContent className="pt-6 text-center">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No applications found</h3>
            <p className="text-slate-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start applying to jobs to track your progress here'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
