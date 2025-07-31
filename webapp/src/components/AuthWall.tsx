import React from 'react'
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'

interface AuthWallProps {
  children: React.ReactNode
}

export const AuthWall: React.FC<AuthWallProps> = ({ children }) => {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="glass-effect border-white/10 bg-slate-800/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold text-gradient mb-2">
                    Resume Tailor AI
                  </h1>
                  <p className="text-slate-300 text-sm">
                    Sign in to access your AI-powered resume optimization tools
                  </p>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50",
                        formButtonPrimary: "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700",
                        formFieldInput: "bg-slate-800/50 border-slate-700 text-white",
                        identityPreviewEditButton: "text-cyan-400"
                      }
                    }}
                    routing="hash"
                    signUpUrl="#/sign-up"
                  />
                </div>
              </CardContent>
            </Card>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <a href="#/sign-up" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Sign up here
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Navigation bar with user button */}
          <nav className="bg-slate-800/80 backdrop-blur-xl border-b border-white/10 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold text-gradient">Resume Tailor AI</h1>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </nav>
          
          {/* Main content */}
          <main className="container mx-auto p-4">
            {children}
          </main>
        </div>
      </SignedIn>
    </>
  )
}

export const AuthSignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/10 bg-slate-800/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Join Resume Tailor AI
            </h1>
            <p className="text-slate-300 text-sm">
              Create your account to get started
            </p>
          </CardHeader>
          <CardContent>
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50",
                  formButtonPrimary: "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700",
                  formFieldInput: "bg-slate-800/50 border-slate-700 text-white"
                }
              }}
              routing="hash"
              signInUrl="#/"
            />
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <a href="#/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign in here
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
