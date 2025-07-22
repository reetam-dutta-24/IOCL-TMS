import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { IndianOilLogo } from "@/components/ui/logo"
import { PageLoading } from "@/components/ui/page-loading"
import { NotificationSystem } from "@/components/ui/notification-system"
import {
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Loader2,
  Database,
  Activity,
  BarChart3,
  UserCheck,
  ClipboardList,
  Award,
  BookOpen,
  CheckCircle,
  Eye,
  MessageSquare
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    setLoggingOut(true)
    localStorage.removeItem("user")
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const handleNavigation = (href: string, name: string) => {
    if (pathname !== href) {
      setNavigatingTo(name)
      setTimeout(() => {
        router.push(href)
      }, 800)
    }
  }

  // Role-based navigation
  const getNavigationItems = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
    ]

    switch (user?.role) {
      case "Admin":
      case "System Administrator":
        return [
          ...baseNavigation,
          { name: "Access Requests", href: "/admin", icon: Shield },
          { name: "User Management", href: "/admin/users", icon: Users },
          { name: "System Analytics", href: "/admin/analytics", icon: BarChart3 },
          { name: "Audit Logs", href: "/admin/audit", icon: Activity },
          { name: "Database", href: "/admin/database", icon: Database },
          { name: "System Settings", href: "/admin/settings", icon: Settings }
        ]

      case "L&D HoD":
        return [
          ...baseNavigation,
          { name: "Final Approvals", href: "/approvals", icon: Award },
          { name: "All L&D Data", href: "/requests", icon: FileText },
          { name: "Closure Approvals", href: "/closures", icon: CheckCircle },
          { name: "Policy Management", href: "/policies", icon: BookOpen },
          { name: "Executive Reports", href: "/reports", icon: TrendingUp },
          { name: "System Configuration", href: "/config", icon: Settings }
        ]

      case "L&D Coordinator":
        return [
          ...baseNavigation,
          { name: "All Requests", href: "/requests", icon: FileText },
          { name: "Process Requests", href: "/requests/process", icon: ClipboardList },
          { name: "Monitor Progress", href: "/monitoring", icon: Eye },
          { name: "Department Routing", href: "/routing", icon: Users },
          { name: "Communication Hub", href: "/communication", icon: MessageSquare },
          { name: "Generate Reports", href: "/reports", icon: TrendingUp }
        ]

      case "Department HoD":
        return [
          ...baseNavigation,
          { name: "Department Requests", href: "/requests/department", icon: FileText },
          { name: "Assign Mentors", href: "/mentors/assign", icon: UserCheck },
          { name: "Resource Allocation", href: "/resources", icon: Building },
          { name: "Mentor Workload", href: "/mentors/workload", icon: Users },
          { name: "Dept Reports", href: "/reports/department", icon: TrendingUp }
        ]

      case "Mentor":
        return [
          ...baseNavigation,
          { name: "My Trainees", href: "/trainees", icon: Users },
          { name: "Submit Reports", href: "/reports/submit", icon: FileText },
          { name: "Project Status", href: "/projects", icon: Activity },
          { name: "Training Materials", href: "/materials", icon: BookOpen },
          { name: "Performance Reviews", href: "/reviews", icon: Award }
        ]

      default:
        return [
          ...baseNavigation,
          { name: "Requests", href: "/requests", icon: FileText },
          { name: "Settings", href: "/settings", icon: Settings }
        ]
    }
  }

  const navigation = getNavigationItems()

  // Function to check if current page matches navigation item
  const isCurrentPage = (href: string) => {
    return pathname === href
  }

  // Get role-specific badge color
  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case "Admin":
      case "System Administrator":
        return "bg-red-100 text-red-800"
      case "L&D HoD":
        return "bg-purple-100 text-purple-800"
      case "L&D Coordinator":
        return "bg-blue-100 text-blue-800"
      case "Department HoD":
        return "bg-green-100 text-green-800"
      case "Mentor":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get role-specific description
  const getRoleDescription = () => {
    switch (user?.role) {
      case "Admin":
      case "System Administrator":
        return "Full system administration and management"
      case "L&D HoD":
        return "Learning & Development leadership and policy oversight"
      case "L&D Coordinator":
        return "Training coordination and initial request processing"
      case "Department HoD":
        return "Departmental coordination and mentor assignment"
      case "Mentor":
        return "Trainee guidance and progress monitoring"
      default:
        return "System user"
    }
  }

  if (loggingOut) {
    return <PageLoading message="Logging out..." />
  }

  if (navigatingTo) {
    return <PageLoading message={`Loading ${navigatingTo}...`} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-red-100 tams-gradient">
            <div className="flex items-center">
              <IndianOilLogo width={32} height={32} />
              <span className="ml-2 text-xl font-bold text-white">IOCL TAMS</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-red-500">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Role Badge */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Badge className={`${getRoleBadgeColor()} px-3 py-1 text-xs font-medium`}>
              {user?.role}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{getRoleDescription()}</p>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const current = isCurrentPage(item.href)
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    current 
                      ? "bg-red-100 text-red-900 border border-red-200" 
                      : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                  }`}
                  disabled={navigatingTo === item.name}
                >
                  {navigatingTo === item.name ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin text-red-600" />
                  ) : (
                    <item.icon className={`mr-3 h-5 w-5 ${current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'}`} />
                  )}
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Mobile User info at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-red-100 shadow-sm">
          <div className="flex h-16 items-center px-4 border-b border-red-100 tams-gradient">
            <IndianOilLogo width={32} height={32} />
            <span className="ml-2 text-xl font-bold text-white">IOCL TAMS</span>
          </div>

          {/* Role Badge */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Badge className={`${getRoleBadgeColor()} px-3 py-1 text-xs font-medium`}>
              {user?.role}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{getRoleDescription()}</p>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const current = isCurrentPage(item.href)
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    current 
                      ? "bg-red-100 text-red-900 border border-red-200" 
                      : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                  }`}
                  disabled={navigatingTo === item.name}
                >
                  {navigatingTo === item.name ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin text-red-600" />
                  ) : (
                    <item.icon className={`mr-3 h-5 w-5 ${current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'}`} />
                  )}
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* User info at bottom */}
          <div className="flex-shrink-0 border-t border-red-100 p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
                {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
                    <Avatar className="h-8 w-8" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                      <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: user.profileColor || '#ef4444' }}>
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <NotificationSystem />
    </div>
  )
}