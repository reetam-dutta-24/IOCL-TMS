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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Requests", href: "/requests", icon: FileText },
    { name: "Mentors", href: "/mentors", icon: Users },
    { name: "Reports", href: "/reports", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  // Function to check if current page matches navigation item
  const isCurrentPage = (href: string) => {
    return pathname === href
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
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.firstName}`} />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
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
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.firstName}`} />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-red-100 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden text-red-600 hover:bg-red-50" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <div className="text-sm text-gray-500">
                Welcome back, <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Home Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
                onClick={() => {
                  setNavigatingTo("Home")
                  setTimeout(() => router.push("/"), 800)
                }}
                disabled={!!navigatingTo}
              >
                {navigatingTo === "Home" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Home className="h-5 w-5" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative text-red-600 hover:bg-red-50">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white">3</Badge>
              </Button>

              {/* Enhanced User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-red-50" disabled={!!navigatingTo}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.firstName}`} />
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&query=${user.firstName}`} />
                        <AvatarFallback className="bg-red-100 text-red-600 text-lg">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.employeeId}</div>
                        <Badge className="mt-1 bg-red-100 text-red-800 text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Profile Details */}
                  <div className="px-2 py-1 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="mr-2 h-4 w-4" />
                      {user.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="mr-2 h-4 w-4" />
                      Employee ID: {user.employeeId}
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  
                  {/* Menu Items */}
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Preferences
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-gray-600 cursor-pointer"
                    onClick={() => {
                      setNavigatingTo("Home")
                      setTimeout(() => router.push("/"), 800)
                    }}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
};