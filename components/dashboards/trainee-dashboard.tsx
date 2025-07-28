"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Users, 
  Activity,
  RefreshCw,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Star,
  GraduationCap,
  UserPlus,
  BarChart3,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  MessageSquare,
  Bell,
  Info
} from "lucide-react"

export function TraineeDashboard({ user: propUser }: { user?: any }) {
  const [user, setUser] = useState<any>(propUser || null)
  const [loading, setLoading] = useState(!propUser)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [internshipData, setInternshipData] = useState<any>(null)
  const [mentorInfo, setMentorInfo] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
        loadTraineeData(JSON.parse(userData))
      }
      setLoading(false)
    } else {
      loadTraineeData(user)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [])

  const loadTraineeData = async (currentUser: any) => {
    try {
      setIsRefreshing(true)
      
      // Fetch real data from API
      const response = await fetch(`/api/trainee?traineeId=${currentUser.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch trainee data')
      }
      
      const data = await response.json()
      
      setInternshipData(data.internshipData || {
        programType: "Internship Program",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "ACTIVE",
        progress: 25,
        daysRemaining: 45,
        totalDays: 60,
        projectTitle: "Software Development Internship",
        department: "Information Technology",
        institution: "IIT Delhi"
      })
      setMentorInfo(data.mentorInfo || {
        name: "Vikram Gupta",
        employeeId: "EMP004",
        department: "Information Technology",
        email: "vikram.gupta@iocl.co.in",
        phone: "+91-9876543213",
        expertise: ["Software Development", "Web Technologies"],
        rating: 4.8,
        experience: 8,
        specialization: "Full Stack Development"
      })
    } catch (error) {
      console.error("Error loading trainee data:", error)
      // Set default data on error
      setInternshipData({
        programType: "Internship Program",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "ACTIVE",
        progress: 25,
        daysRemaining: 45,
        totalDays: 60,
        projectTitle: "Software Development Internship",
        department: "Information Technology",
        institution: "IIT Delhi"
      })
      setMentorInfo({
        name: "Vikram Gupta",
        employeeId: "EMP004",
        department: "Information Technology",
        email: "vikram.gupta@iocl.co.in",
        phone: "+91-9876543213",
        expertise: ["Software Development", "Web Technologies"],
        rating: 4.8,
        experience: 8,
        specialization: "Full Stack Development"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      "ACTIVE": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "PENDING": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "COMPLETED": { color: "bg-blue-100 text-blue-800", icon: Award },
      "ON_HOLD": { color: "bg-red-100 text-red-800", icon: Clock }
    }
    
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-gray-600">Welcome to your internship dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <GraduationCap className="h-4 w-4 mr-2" />
              {user.role}
            </Badge>
            <Button 
              onClick={() => loadTraineeData(user)}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role Description Banner */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Your Role:</strong> As a Trainee, you are participating in an internship program to gain practical experience and develop professional skills. Focus on your project objectives and maintain regular communication with your mentor through scheduled meetings.
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Submit Report</h3>
                  <p className="text-sm text-gray-600">Update your progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Schedule Meeting</h3>
                  <p className="text-sm text-gray-600">Book time with mentor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Internship Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Internship Progress
              </CardTitle>
              <CardDescription>Your current program status and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Program Type</span>
                  <span className="font-medium">{internshipData?.programType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Department</span>
                  <span className="font-medium">{internshipData?.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Institution</span>
                  <span className="font-medium">{internshipData?.institution}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Project Title</span>
                  <span className="font-medium">{internshipData?.projectTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span>{getStatusBadge(internshipData?.status)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{internshipData?.progress}%</span>
                </div>
                <Progress value={internshipData?.progress || 0} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span>Days Remaining</span>
                <span className="font-medium">{internshipData?.daysRemaining} days</span>
              </div>
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Project Description
              </CardTitle>
              <CardDescription>Detailed overview of your assigned project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Overview</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    You have been assigned to work on a comprehensive software development project focused on building 
                    a modern web application using React.js and Node.js. This project aims to develop a scalable 
                    enterprise-level system that will enhance the organization's digital infrastructure.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Objectives</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <Target className="h-3 w-3 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      Develop a responsive user interface with modern design principles
                    </li>
                    <li className="flex items-start">
                      <Target className="h-3 w-3 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      Implement secure authentication and authorization systems
                    </li>
                    <li className="flex items-start">
                      <Target className="h-3 w-3 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      Create RESTful APIs for data management and integration
                    </li>
                    <li className="flex items-start">
                      <Target className="h-3 w-3 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      Optimize application performance and database queries
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">React.js</Badge>
                    <Badge variant="secondary" className="text-xs">Node.js</Badge>
                    <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                    <Badge variant="secondary" className="text-xs">PostgreSQL</Badge>
                    <Badge variant="secondary" className="text-xs">Docker</Badge>
                    <Badge variant="secondary" className="text-xs">AWS</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      Gain hands-on experience with modern web development frameworks
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      Learn industry best practices for software development
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      Understand the complete software development lifecycle
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      Develop problem-solving and critical thinking skills
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Mentor Information
            </CardTitle>
            <CardDescription>Your assigned mentor and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {mentorInfo?.name?.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{mentorInfo?.name}</h3>
                <p className="text-sm text-gray-600">{mentorInfo?.specialization}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{mentorInfo?.rating}/5.0</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span>{mentorInfo?.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span>{mentorInfo?.experience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <a href={`mailto:${mentorInfo?.email}`} className="text-blue-600 hover:underline">
                  {mentorInfo?.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <a href={`tel:${mentorInfo?.phone}`} className="text-blue-600 hover:underline">
                  {mentorInfo?.phone}
                </a>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Latest updates and important information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Progress report approved</p>
                  <p className="text-xs text-gray-500">Your latest progress report has been reviewed and approved</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="mt-1">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Meeting scheduled</p>
                  <p className="text-xs text-gray-500">Weekly review meeting scheduled for tomorrow at 2 PM</p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 