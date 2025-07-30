import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  Search,
  Sparkles,
  Settings,
  User,
  Briefcase
} from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  
  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard'
    },
    {
      href: '/job-analysis',
      label: 'Job Analysis',
      icon: Search,
      active: location.pathname === '/job-analysis'
    },
    {
      href: '/resume-editor',
      label: 'Resume Editor',
      icon: FileText,
      active: location.pathname === '/resume-editor'
    },
    {
      href: '/applications',
      label: 'Applications',
      icon: Briefcase,
      active: location.pathname === '/applications'
    },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gradient">
                Resume Tailor AI
              </h1>
              <p className="text-xs text-slate-400">
                Powered by advanced AI
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2 transition-all duration-200",
                      item.active
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
