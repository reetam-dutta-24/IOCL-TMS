"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  MessageSquare,
  ArrowRight,
  Eye,
  Award,
  Activity,
  RefreshCw,
  Target,
  User
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

export function MentorDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({
    assignedTrainees: 4,      // Direct supervision
    pendingReports: 3,        // Report submission pending
    completedEvaluations: 8,  // Performance evaluations done
    activeProjects: 5,        // Project guidance
    totalSupervisionHours: 156,
    averageRating: 4.7
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const quickActions = [
    {
      title: "My Assigned Trainees",
      description: "Direct supervision of assigned trainees",
      href: "/trainees",
      icon: Users,
      color: "bg-blue-500",
      count: stats.assignedTrainees
    },
    {
      title: "Submit Progress Reports",
      description: "Report submission and documentation",
      href: "/reports/submit",
      icon: FileText,
      color: "bg-red-500",
      count: stats.pendingReports
    },
    {
      title: "Project Guidance",
      description: "Technical support and project oversight",
      href: "/projects",
      icon: Target,
      color: "bg-green-500",
      count: stats.activeProjects
    },
    {
      title: "Performance Evaluations",
      description: "Performance evaluation and feedback",
      href: "/evaluations",
      icon: Award,
      color: "bg-purple-500"
    },
    {
      title: "Training Materials",
      description: "Access training materials and resources",
      href: "/materials",
      icon: BookOpen,
      color: "bg-orange-500"
    },
    {
      title: "Update Project Status",
      description: "Update current project progress",
      href: "/projects/status",
      icon: Activity,
      color: "bg-indigo-500"
    }
  ]

  const assignedTrainees = [
    {
      id: 1,
      name: "Aarav Sharma",
      employeeId: "INT001",
      project: "API Development System",
      startDate: "2024-01-15",
      progress: 75,
      status: "ON_TRACK",
      lastEvaluation: "2024-01-20",
      reportDue: "2024-01-25"
    },
    {
      id: 2,
      name: "Priya Patel", 
      employeeId: "INT002",
      project: "Data Analytics Dashboard",
      startDate: "2024-01-10",
      progress: 60,
      status: "NEEDS_GUIDANCE",
      lastEvaluation: "2024-01-18",
      reportDue: "2024-01-23"
    },
    {
      id: 3,
      name: "Rohit Kumar",
      employeeId: "INT003", 
      project: "Process Automation Tool",
      startDate: "2024-01-08",
      progress: 90,
      status: "EXCELLENT",
      lastEvaluation: "2024-01-19",
      reportDue: "2024-01-26"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      employeeId: "INT004",
      project: "Quality Management System",
      startDate: "2024-01-12",
      progress: 45,
      status: "BEHIND_SCHEDULE",
      lastEvaluation: "2024-01-17",
      reportDue: "2024-01-24"
    }
  ]

  const pendingTasks = [
    {
      id: 1,
      trainee: "Aarav Sharma",
      task: "Weekly Progress Report",
      type: "REPORT_SUBMISSION",
      dueDate: "2024-01-25",
      priority: "HIGH"
    },
    {
      id: 2,
      trainee: "Priya Patel",
      task: "Performance Evaluation",
      type: "EVALUATION",
      dueDate: "2024-01-23",
      priority: "URGENT"
    },
    {
      id: 3,
      trainee: "Rohit Kumar",
      task: "Project Review Meeting",
      type: "GUIDANCE",
      dueDate: "2024-01-26",
      priority: "MEDIUM"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_TRACK":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />On Track</Badge>
      case "NEEDS_GUIDANCE":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Needs Guidance</Badge>
      case "EXCELLENT":
        return <Badge className="bg-blue-100 text-blue-800"><Star className="h-3 w-3 mr-1" />Excellent</Badge>
      case "BEHIND_SCHEDULE":
        return <Badge className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Behind Schedule</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "HIGH":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const monthlySupervisionData = [
    { month: "Jan", hours: 32, evaluations: 4 },
    { month: "Feb", hours: 38, evaluations: 5 },
    { month: "Mar", hours: 28, evaluations: 3 },
    { month: "Apr", hours: 42, evaluations: 6 },
    { month: "May", hours: 35, evaluations: 4 },
    { month: "Jun", hours: 45, evaluations: 7 }
  ]

  const projectStatusData = [
    { name: "Completed", value: 8, color: "#16a34a" },
    { name: "In Progress", value: stats.activeProjects, color: "#3b82f6" },
    { name: "Behind Schedule", value: 2, color: "#dc2626" }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Mentor Dashboard - Direct supervision, project guidance, and performance evaluation
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              Mentor
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{stats.averageRating}/5.0</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Urgent Tasks Alert */}
        {stats.pendingReports > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">
                    {stats.pendingReports} progress reports pending submission
                  </p>
                  <p className="text-sm text-red-600">
                    Submit pending reports and evaluations to maintain trainee supervision records.
                  </p>
                </div>
                <Link href="/reports/submit" className="ml-auto">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Submit Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Mentor Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Trainees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.assignedTrainees}</p>
                  <p className="text-xs text-blue-600 mt-1">Direct supervision</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                  <p className="text-xs text-red-600 mt-1">Need submission</p>
                </div>
                <FileText className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Evaluations Done</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedEvaluations}</p>
                  <p className="text-xs text-green-600 mt-1">Performance reviews</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                  <p className="text-xs text-purple-600 mt-1">Project guidance</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Supervision Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSupervisionHours}</p>
                  <p className="text-xs text-orange-600 mt-1">Total logged</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mentor Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  <p className="text-xs text-yellow-600 mt-1">Trainee feedback</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentor Responsibilities */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Responsibilities</CardTitle>
                <CardDescription>Core mentoring tasks and activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                      {action.count && (
                        <Badge variant="secondary">{action.count}</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Assigned Trainees - Direct Supervision */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Trainees</CardTitle>
                <CardDescription>Direct supervision and guidance of your trainees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedTrainees.map((trainee) => (
                    <div key={trainee.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{trainee.name}</p>
                            <p className="text-xs text-gray-500">ID: {trainee.employeeId}</p>
                          </div>
                          {getStatusBadge(trainee.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Project: {trainee.project}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Project Progress</span>
                            <span>{trainee.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${trainee.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                          <span>Last Evaluation: {new Date(trainee.lastEvaluation).toLocaleDateString()}</span>
                          <span>Report Due: {new Date(trainee.reportDue).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/trainees">
                    <Button variant="outline">
                      View All Trainees
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Tasks & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Mentor Tasks</CardTitle>
            <CardDescription>Reports, evaluations, and guidance sessions requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {task.type === 'REPORT_SUBMISSION' && <FileText className="h-4 w-4 text-red-600" />}
                      {task.type === 'EVALUATION' && <Award className="h-4 w-4 text-purple-600" />}
                      {task.type === 'GUIDANCE' && <Target className="h-4 w-4 text-green-600" />}
                      <span className="text-sm font-medium">{task.task}</span>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Trainee: {task.trainee}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <Button size="sm" className="w-full">
                    Complete Task
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Supervision Activity</CardTitle>
              <CardDescription>Hours spent and evaluations completed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySupervisionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#dc2626" strokeWidth={2} name="Hours" />
                  <Line type="monotone" dataKey="evaluations" stroke="#16a34a" strokeWidth={2} name="Evaluations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Status Overview</CardTitle>
              <CardDescription>Current status of all guided projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mentoring Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Mentoring Excellence Guidelines</CardTitle>
            <CardDescription>Key practices for effective mentorship</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Direct Supervision</h4>
                <p className="text-sm text-blue-700">
                  Provide close guidance and oversight for assigned trainees, ensuring they receive proper technical support.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Project Guidance</h4>
                <p className="text-sm text-green-700">
                  Offer technical expertise and problem-solving support to help trainees successfully complete their projects.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Performance Evaluation</h4>
                <p className="text-sm text-purple-700">
                  Conduct regular evaluations and provide constructive feedback to help trainees improve and grow.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Report Documentation</h4>
                <p className="text-sm text-orange-700">
                  Maintain accurate records and submit timely reports on trainee progress and behavioral observations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}