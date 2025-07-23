"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Building2,
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
  Target,
  MessageSquare,
  BookOpen,
  Award,
  Upload
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Role-based navigation
  const getNavigationItems = () => {
    const baseItems = [
      { name: "Dashboard", href: user.role === "Trainee" ? "/trainee" : "/dashboard", icon: LayoutDashboard, current: true },
    ]

    if (user.role === "Trainee") {
      return [
        ...baseItems,
        { name: "My Goals", href: "/trainee/goals", icon: Target, current: false },
        { name: "Submissions", href: "/trainee/submissions", icon: Upload, current: false },
        { name: "Messages", href: "/trainee/messages", icon: MessageSquare, current: false },
        { name: "Resources", href: "/trainee/resources", icon: BookOpen, current: false },
        { name: "Certificates", href: "/trainee/certificates", icon: Award, current: false },
      ]
    } else {
      return [
        ...baseItems,
        { name: "Requests", href: "/requests", icon: FileText, current: false },
        { name: "Mentors", href: "/mentors", icon: Users, current: false },
        { name: "Reports", href: "/reports", icon: TrendingUp, current: false },
        { name: "Settings", href: "/settings", icon: Settings, current: false },
      ]
    }
  }

  const navigation = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">IOCL-TMS</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">IOCL-TMS</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.name || user.firstName + ' ' + user.lastName}`} />
                <AvatarFallback>
                  {user.name 
                    ? user.name.split(" ").map((n: string) => n[0]).join("")
                    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')
                  }
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user.name || `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <div className="text-sm text-gray-500">
                Welcome back, <span className="font-medium text-gray-900">
                  {user.name || `${user.firstName} ${user.lastName}`}
                </span>
                {user.role === "Trainee" && user.institutionName && (
                  <span className="text-xs text-gray-400 ml-2">from {user.institutionName}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Role-specific quick actions */}
              {user.role === "Trainee" && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/trainee/submissions">
                      <Upload className="h-4 w-4 mr-1" />
                      Submit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/trainee/messages">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Link>
                  </Button>
                </div>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {user.role === "Trainee" ? "2" : "3"}
                </Badge>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.name || user.firstName + ' ' + user.lastName}`} />
                      <AvatarFallback>
                        {user.name 
                          ? user.name.split(" ").map((n: string) => n[0]).join("")
                          : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-gray-700">
                        {user.name || `${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  {user.role === "Trainee" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/trainee/certificates">View Certificates</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/trainee/progress">Progress Report</Link>
                      </DropdownMenuItem>
                    </>
                  )}
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
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
