import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { 
  FileText,
  Save,
  Download,
  Eye,
  Edit3,
  Sparkles,
  Share,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Cloud
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ResumeSection {
  id: string
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects'
  title: string
  content: any
  aiOptimized?: boolean
}

interface Resume {
  id: string
  name: string
  sections: ResumeSection[]
  jobTargeted?: string
  lastModified: number
  driveFileId?: string
}

export default function ResumeEditor() {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const [activeTab, setActiveTab] = useState('editor')
  const [isSaving, setIsSaving] = useState(false)
  const [isAiOptimizing, setIsAiOptimizing] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)

  useEffect(() => {
    // Load or create a new resume
    loadResume()
    checkGoogleDriveConnection()
  }, [])

  const loadResume = () => {
    // Mock resume data
    setCurrentResume({
      id: '1',
      name: 'Software Engineer Resume',
      sections: [
        {
          id: '1',
          type: 'personal',
          title: 'Personal Information',
          content: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe'
          }
        },
        {
          id: '2',
          type: 'summary',
          title: 'Professional Summary',
          content: {
            text: 'Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams.',
          },
          aiOptimized: true
        },
        {
          id: '3',
          type: 'experience',
          title: 'Work Experience',
          content: {
            jobs: [
              {
                title: 'Senior Software Engineer',
                company: 'TechCorp Inc.',
                location: 'San Francisco, CA',
                startDate: '2021-03',
                endDate: 'Present',
                description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%.',
                achievements: [
                  'Increased application performance by 40% through optimization',
                  'Mentored 3 junior developers and established code review processes',
                  'Designed and implemented RESTful APIs used by 50+ internal services'
                ]
              }
            ]
          }
        }
      ],
      lastModified: Date.now(),
      driveFileId: 'sample-drive-id'
    })
  }

  const checkGoogleDriveConnection = () => {
    // Check if Google Drive is connected
    setDriveConnected(false) // Mock: not connected initially
  }

  const handleConnectGoogleDrive = async () => {
    // Implement Google Drive OAuth flow
    console.log('Connecting to Google Drive...')
    // Mock connection
    setTimeout(() => {
      setDriveConnected(true)
    }, 2000)
  }

  const handleSaveResume = async () => {
    setIsSaving(true)
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false)
      console.log('Resume saved successfully')
    }, 1500)
  }

  const handleAiOptimize = async (sectionId: string) => {
    setIsAiOptimizing(true)
    
    // Simulate AI optimization
    setTimeout(() => {
      if (currentResume) {
        const updatedResume = {
          ...currentResume,
          sections: currentResume.sections.map(section => 
            section.id === sectionId 
              ? { ...section, aiOptimized: true }
              : section
          )
        }
        setCurrentResume(updatedResume)
      }
      setIsAiOptimizing(false)
    }, 2500)
  }

  const handleExportToPDF = () => {
    console.log('Exporting to PDF...')
    // Implement PDF export
  }

  const handleSaveToGoogleDocs = async () => {
    if (!driveConnected) {
      await handleConnectGoogleDrive()
      return
    }
    
    console.log('Saving to Google Docs...')
    // Implement Google Docs integration
  }

  if (!currentResume) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Resume Editor</h1>
          <p className="text-slate-300">Create and optimize your resume with AI assistance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!driveConnected ? (
            <Button 
              onClick={handleConnectGoogleDrive}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Connect Google Drive
            </Button>
          ) : (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Cloud className="w-3 h-3 mr-1" />
              Drive Connected
            </Badge>
          )}
          
          <Button 
            onClick={handleSaveResume}
            disabled={isSaving}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Resume
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="editor" className="data-[state=active]:bg-slate-700">
            <Edit3 className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-slate-700">
            <Share className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Resume Name */}
          <Card className="glass-effect border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Input
                  value={currentResume.name}
                  onChange={(e) => setCurrentResume({
                    ...currentResume,
                    name: e.target.value
                  })}
                  className="text-xl font-semibold bg-transparent border-none p-0 text-white"
                />
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-slate-400">
                    Last modified: {new Date(currentResume.lastModified).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Sections */}
          <div className="space-y-4">
            {currentResume.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-effect border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                        {section.aiOptimized && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAiOptimize(section.id)}
                          disabled={isAiOptimizing}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {isAiOptimizing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {section.type === 'personal' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Full Name"
                          value={section.content.name}
                          className="bg-slate-800/50 border-slate-700"
                        />
                        <Input
                          placeholder="Email"
                          value={section.content.email}
                          className="bg-slate-800/50 border-slate-700"
                        />
                        <Input
                          placeholder="Phone"
                          value={section.content.phone}
                          className="bg-slate-800/50 border-slate-700"
                        />
                        <Input
                          placeholder="Location"
                          value={section.content.location}
                          className="bg-slate-800/50 border-slate-700"
                        />
                        <Input
                          placeholder="LinkedIn"
                          value={section.content.linkedin}
                          className="bg-slate-800/50 border-slate-700"
                        />
                        <Input
                          placeholder="GitHub"
                          value={section.content.github}
                          className="bg-slate-800/50 border-slate-700"
                        />
                      </div>
                    )}

                    {section.type === 'summary' && (
                      <Textarea
                        placeholder="Write a compelling professional summary..."
                        value={section.content.text}
                        rows={4}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    )}

                    {section.type === 'experience' && (
                      <div className="space-y-6">
                        {section.content.jobs.map((job: any, jobIndex: number) => (
                          <div key={jobIndex} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <Input
                                placeholder="Job Title"
                                value={job.title}
                                className="bg-slate-800/50 border-slate-700"
                              />
                              <Input
                                placeholder="Company"
                                value={job.company}
                                className="bg-slate-800/50 border-slate-700"
                              />
                              <Input
                                placeholder="Location"
                                value={job.location}
                                className="bg-slate-800/50 border-slate-700"
                              />
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Start Date"
                                  value={job.startDate}
                                  className="bg-slate-800/50 border-slate-700"
                                />
                                <Input
                                  placeholder="End Date"
                                  value={job.endDate}
                                  className="bg-slate-800/50 border-slate-700"
                                />
                              </div>
                            </div>
                            <Textarea
                              placeholder="Job description..."
                              value={job.description}
                              rows={3}
                              className="bg-slate-800/50 border-slate-700 text-white mb-4"
                            />
                            <div className="space-y-2">
                              <label className="text-sm text-slate-400">Key Achievements:</label>
                              {job.achievements.map((achievement: string, achIndex: number) => (
                                <Input
                                  key={achIndex}
                                  placeholder="Achievement..."
                                  value={achievement}
                                  className="bg-slate-800/50 border-slate-700"
                                />
                              ))}
                              <Button variant="ghost" size="sm" className="text-cyan-400 mt-2">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Achievement
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add Section */}
            <Card className="glass-effect border-white/10 border-dashed">
              <CardContent className="p-6 text-center">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="glass-effect border-white/10">
            <CardContent className="p-8">
              <div className="max-w-4xl mx-auto bg-white text-black p-8 rounded-lg">
                {/* Resume Preview */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">{currentResume.sections[0]?.content.name}</h1>
                  <div className="text-gray-600 space-x-4">
                    <span>{currentResume.sections[0]?.content.email}</span>
                    <span>{currentResume.sections[0]?.content.phone}</span>
                    <span>{currentResume.sections[0]?.content.location}</span>
                  </div>
                </div>

                {currentResume.sections.slice(1).map((section) => (
                  <div key={section.id} className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
                      {section.title.toUpperCase()}
                    </h2>
                    
                    {section.type === 'summary' && (
                      <p className="text-gray-700 leading-relaxed">{section.content.text}</p>
                    )}

                    {section.type === 'experience' && (
                      <div className="space-y-4">
                        {section.content.jobs.map((job: any, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold">{job.title}</h3>
                                <p className="text-gray-600">{job.company} - {job.location}</p>
                              </div>
                              <span className="text-gray-500 text-sm">
                                {job.startDate} - {job.endDate}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{job.description}</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {job.achievements.map((achievement: string, achIndex: number) => (
                                <li key={achIndex}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <div className="space-y-6">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Export Options</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleExportToPDF}
                    className="h-20 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                  >
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-1" />
                      <span>Export as PDF</span>
                    </div>
                  </Button>

                  <Button
                    onClick={handleSaveToGoogleDocs}
                    disabled={!driveConnected}
                    className="h-20 bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                  >
                    <div className="text-center">
                      <Cloud className="w-6 h-6 mx-auto mb-1" />
                      <span>Save to Google Docs</span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 border-slate-600 text-slate-300 hover:bg-slate-800/50"
                  >
                    <div className="text-center">
                      <Copy className="w-6 h-6 mx-auto mb-1" />
                      <span>Copy as Text</span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 border-slate-600 text-slate-300 hover:bg-slate-800/50"
                  >
                    <div className="text-center">
                      <Share className="w-6 h-6 mx-auto mb-1" />
                      <span>Share Link</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {driveConnected && (
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Cloud className="w-5 h-5 mr-2 text-blue-400" />
                    Google Drive Integration
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white">{currentResume.name}.docx</p>
                          <p className="text-sm text-slate-400">Google Docs</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-400">
                        <Eye className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                    </div>
                    
                    <p className="text-sm text-slate-400">
                      Your resume is automatically synced with Google Docs. Any changes made here will be reflected in your Google Drive.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
