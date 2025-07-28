"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Search, 
  Filter, 
  Building,
  Star,
  UserCheck,
  Clock,
  Award,
  Target,
  Eye,
  Activity,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  FileText,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Loader2,
  Mail,
  Phone,
  UserPlus,
  MapPin,
  Zap,
  Shield,
  Briefcase
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageLoading } from "@/components/ui/page-loading"

interface Mentor {
  id: number
  employeeId: string
  name: string
  email: string
  phone?: string
  activeAssignments: number
  maxCapacity: number
  availability: number
  workloadPercentage: number
  availabilityStatus: "AVAILABLE" | "BUSY" | "MODERATE" | "FULL"
  availabilityColor: string
  recentReports: number
  lastActive: string
  currentTrainees: Array<{
    name: string
    program: string
  }>
}

interface Department {
  department: string
  departmentCode: string
  mentors: Mentor[]
}

interface DepartmentStats {
  department: string
  departmentCode: string
  totalMentors: number
  availableMentors: number
  busyMentors: number
  fullMentors: number
  totalAssignments: number
  totalCapacity: number
  utilizationRate: number
}

interface DepartmentMentorsData {
  departments: Department[]
  departmentStats: DepartmentStats[]
  totalMentors: number
  totalDepartments: number
  lastUpdated: string
}

export default function DepartmentMentorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState<DepartmentMentorsData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadDepartmentMentorsData()
    setLoading(false)
  }, [router])

  const loadDepartmentMentorsData = async () => {
    try {
      setIsRefreshing(true)
      
      const response = await fetch('/api/mentors/department')
      
      if (!response.ok) {
        throw new Error('Failed to fetch department mentors data')
      }
      
      const mentorData = await response.json()
      setData(mentorData)
      
    } catch (error) {
      console.error('Error loading department mentors data:', error)
      setData(null)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getAvailabilityBadge = (status: string, color: string) => {
    const colorClasses = {
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800"
    }

    const icons = {
      AVAILABLE: <UserCheck className="h-3 w-3 mr-1" />,
      BUSY: <Activity className="h-3 w-3 mr-1" />,
      MODERATE: <Clock className="h-3 w-3 mr-1" />,
      FULL: <XCircle className="h-3 w-3 mr-1" />
    }

    return (
      <Badge className={colorClasses[color as keyof typeof colorClasses]}>
        {icons[status as keyof typeof icons]}
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

  const filteredDepartments = data?.departments.filter(dept => {
    const deptMatch = departmentFilter === "all" || dept.department === departmentFilter
    const mentorMatch = dept.mentors.some(mentor => {
      const searchMatch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const availabilityMatch = availabilityFilter === "all" || mentor.availabilityStatus === availabilityFilter
      return searchMatch && availabilityMatch
    })
    return deptMatch && mentorMatch
  }) || []

  const getDepartmentOptions = () => {
    if (!data) return []
    return data.departments.map(dept => dept.department)
  }

  if (loading) {
    return <PageLoading message="Loading department mentors..." />
  }

  if (!user) {
    return null
  }

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
              All Department Mentors - Real-time availability and capacity tracking
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              All Department Mentors
            </Badge>
            <Button 
              onClick={loadDepartmentMentorsData} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role Information */}
        <Alert className="border-purple-200 bg-purple-50">
          <Users className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-700">
            <strong>📊 Real-time Mentor Tracking:</strong> View all mentors across departments with their current availability, workload, and active assignments. This helps in efficient mentor assignment and resource planning.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search mentors by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {getDepartmentOptions().map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-40">
                <UserCheck className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="BUSY">Busy</SelectItem>
                <SelectItem value="FULL">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                    <p className="text-2xl font-bold text-gray-900">{data.totalMentors}</p>
                    <p className="text-xs text-blue-600 mt-1">Across {data.totalDepartments} departments</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Mentors</p>
                    <p className="text-2xl font-bold text-green-600">
                      {data.departmentStats.reduce((sum, stat) => sum + stat.availableMentors, 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Ready for assignments</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {data.departmentStats.reduce((sum, stat) => sum + stat.totalAssignments, 0)}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Current trainees</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(data.lastUpdated).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Real-time data</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Department Mentors */}
        {filteredDepartments.map((department) => (
          <Card key={department.department}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    {department.department}
                  </CardTitle>
                  <CardDescription>
                    {department.mentors.length} mentors • {department.mentors.filter(m => m.availabilityStatus === "AVAILABLE").length} available
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {department.departmentCode}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.mentors.map((mentor) => (
                  <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">{mentor.name}</h4>
                            <p className="text-sm text-gray-500">{mentor.employeeId}</p>
                          </div>
                        </div>
                        {getAvailabilityBadge(mentor.availabilityStatus, mentor.availabilityColor)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Workload:</span>
                          <span className="font-medium">{mentor.workloadPercentage}%</span>
                        </div>
                        <Progress value={mentor.workloadPercentage} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Active:</span>
                          <span className="font-medium">{mentor.activeAssignments}/{mentor.maxCapacity}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium text-green-600">{mentor.availability} slots</span>
                        </div>

                        {mentor.currentTrainees.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500 mb-2">Current Trainees:</p>
                            <div className="space-y-1">
                              {mentor.currentTrainees.slice(0, 2).map((trainee, idx) => (
                                <div key={idx} className="text-xs text-gray-600">
                                  • {trainee.name} ({trainee.program})
                                </div>
                              ))}
                              {mentor.currentTrainees.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{mentor.currentTrainees.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMentor(mentor)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Mentor Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information about {mentor.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      {mentor.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">{mentor.name}</h3>
                                    <p className="text-sm text-gray-500">{mentor.employeeId}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Email:</span>
                                    <p className="font-medium">{mentor.email}</p>
                                  </div>
                                  {mentor.phone && (
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <p className="font-medium">{mentor.phone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-gray-600">Status:</span>
                                    <div className="mt-1">
                                      {getAvailabilityBadge(mentor.availabilityStatus, mentor.availabilityColor)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Last Active:</span>
                                    <p className="font-medium">
                                      {new Date(mentor.lastActive).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <span className="text-gray-600 text-sm">Workload Progress:</span>
                                    <div className="mt-2">
                                      <Progress value={mentor.workloadPercentage} className="h-2" />
                                      <p className="text-xs text-gray-500 mt-1">
                                        {mentor.activeAssignments} active / {mentor.maxCapacity} capacity
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {mentor.currentTrainees.length > 0 && (
                                    <div>
                                      <span className="text-gray-600 text-sm">Current Trainees:</span>
                                      <div className="mt-2 space-y-1">
                                        {mentor.currentTrainees.map((trainee, idx) => (
                                          <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                                            <p className="font-medium">{trainee.name}</p>
                                            <p className="text-xs text-gray-500">{trainee.program}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Mail className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDepartments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentors Found</h3>
              <p className="text-gray-600">
                No mentors match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 