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
import { PageLoading } from "@/components/ui/loading"
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
  Shield,
  Award,
  Target,
  Home,
  User,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id?: number
    firstName?: string
    lastName?: string
    email?: string
    role?: string
    department?: string
    employeeId?: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    setLoggingOut(true)
    
    // Clear local storage
    localStorage.removeItem("user")
    localStorage.removeItem("userSession")
    
    // Small delay to show loading state
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  const handleNavigation = (href: string, name: string) => {
    if (pathname !== href) {
      setNavigatingTo(name)
      router.push(href)
    }
    setSidebarOpen(false)
  }

  // Role-based navigation - FIXED to use only existing pages
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
          { name: "All Requests", href: "/requests", icon: FileText },
          { name: "All Mentors", href: "/mentors", icon: Users },
          { name: "System Reports", href: "/reports", icon: TrendingUp },
          { name: "Settings", href: "/settings", icon: Settings }
        ]

      case "L&D HoD":
        return [
          ...baseNavigation,
          { name: "L&D Overview", href: "/lnd-hod", icon: Shield },
          { name: "Quality Assurance", href: "/lnd-hod/quality", icon: Award },
          { name: "Resource Allocation", href: "/lnd-hod/resources", icon: Target },
          { name: "All Requests", href: "/requests", icon: FileText },
          { name: "All Mentors", href: "/mentors", icon: Users },
          { name: "Executive Reports", href: "/reports", icon: TrendingUp },
          { name: "L&D Configuration", href: "/lnd-hod/settings", icon: Settings }
        ]

      case "L&D Coordinator":
        return [
          ...baseNavigation,
          { name: "All Requests", href: "/requests", icon: FileText },
          { name: "All Mentors", href: "/mentors", icon: Users },
          { name: "Coordination Reports", href: "/reports", icon: TrendingUp },
          { name: "Settings", href: "/settings", icon: Settings }
        ]

      case "Department HoD":
        return [
          ...baseNavigation,
          { name: "Department Requests", href: "/requests", icon: FileText },
          { name: "Department Mentors", href: "/mentors", icon: Users },
          { name: "Department Reports", href: "/reports", icon: TrendingUp },
          { name: "Settings", href: "/settings", icon: Settings }
        ]

      case "Mentor":
        return [
          ...baseNavigation,
          { name: "My Requests", href: "/requests", icon: FileText },
          { name: "Fellow Mentors", href: "/mentors", icon: Users },
          { name: "My Reports", href: "/reports", icon: TrendingUp },
          { name: "Settings", href: "/settings", icon: Settings }
        ]

      default:
        return [
          ...baseNavigation,
          { name: "My Requests", href: "/requests", icon: FileText },
          { name: "Settings", href: "/settings", icon: Settings }
        ]
    }
  }

  const navigationItems = getNavigationItems()

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
        <div className="relative flex w-full max-w-xs flex-col bg-white pb-4 pt-5">
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex shrink-0 items-center px-4">
            <IndianOilLogo />
            <span className="ml-2 text-xl font-semibold text-gray-900">TAMS</span>
          </div>
          <nav className="mt-5 h-full overflow-y-auto px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href, item.name)}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-red-600" : "text-gray-500"}`} />
                    {item.name}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <IndianOilLogo />
            <span className="ml-2 text-xl font-semibold text-gray-900">TAMS</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.href, item.name)}
                          className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive
                              ? "bg-red-50 text-red-600"
                              : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-red-600" : "text-gray-400 group-hover:text-red-600"}`} />
                          {item.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-red-100 text-red-600">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Your profile</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                    <Badge className={`text-xs w-fit ${getRoleBadgeColor()}`}>
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Top bar */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center gap-x-4">
                <div className="hidden lg:block">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {user?.role === "Admin" || user?.role === "System Administrator" ? "System Administration" :
                     user?.role === "L&D HoD" ? "Learning & Development Leadership" :
                     user?.role === "L&D Coordinator" ? "L&D Coordination Center" :
                     user?.role === "Department HoD" ? "Department Management" :
                     user?.role === "Mentor" ? "Mentor Dashboard" :
                     "User Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-500">{getRoleDescription()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <NotificationSystem />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={`${user?.firstName} ${user?.lastName}`} />
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="pt-1">
                        <Badge className={`text-xs ${getRoleBadgeColor()}`}>
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/settings", "Settings")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/dashboard", "Dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}