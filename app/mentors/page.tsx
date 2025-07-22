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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Building,
  Star,
  UserCheck,
  Clock,
  Award,
  Target,
  Eye,
  UserPlus,
  Activity,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageLoading } from "@/components/ui/page-loading"

interface Mentor {
  id: string
  name: string
  employeeId: string
  department: string
  email: string
  phone: string
  expertise: string[]
  currentTrainees: number
  maxCapacity: number
  totalMentored: number
  rating: number
  status: "AVAILABLE" | "BUSY" | "UNAVAILABLE"
  specialization: string
  experience: number
  assignedRequests?: string[]
}

export default function MentorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadMentors(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const loadMentors = (currentUser: any) => {
    // Mock data - role-filtered based on permissions
    const allMentors: Mentor[] = [
      {
        id: "M001",
        name: "Vikram Gupta",
        employeeId: "EMP005",
        department: "Information Technology",
        email: "vikram.gupta@iocl.co.in",
        phone: "+91-9876543214",
        expertise: ["Software Development", "Data Analytics", "AI/ML"],
        currentTrainees: 2,
        maxCapacity: 3,
        totalMentored: 15,
        rating: 4.8,
        status: "AVAILABLE",
        specialization: "Full Stack Development",
        experience: 8,
        assignedRequests: ["REQ001", "REQ004"]
      },
      {
        id: "M002",
        name: "Dr. Kavita Sharma",
        employeeId: "EMP006",
        department: "Engineering",
        email: "kavita.sharma@iocl.co.in",
        phone: "+91-9876543215",
        expertise: ["Mechanical Engineering", "Process Optimization", "Quality Management"],
        currentTrainees: 3,
        maxCapacity: 3,
        totalMentored: 22,
        rating: 4.9,
        status: "BUSY",
        specialization: "Process Engineering",
        experience: 12,
        assignedRequests: ["REQ003"]
      },
      {
        id: "M003",
        name: "Rajesh Kumar",
        employeeId: "EMP007",
        department: "Operations",
        email: "rajesh.kumar@iocl.co.in",
        phone: "+91-9876543216",
        expertise: ["Operations Management", "Supply Chain", "Logistics"],
        currentTrainees: 1,
        maxCapacity: 4,
        totalMentored: 18,
        rating: 4.7,
        status: "AVAILABLE",
        specialization: "Operations Excellence",
        experience: 10,
        assignedRequests: ["REQ002"]
      },
      {
        id: "M004",
        name: "Anita Patel",
        employeeId: "EMP008",
        department: "Finance",
        email: "anita.patel@iocl.co.in",
        phone: "+91-9876543217",
        expertise: ["Financial Analysis", "Budgeting", "Risk Management"],
        currentTrainees: 0,
        maxCapacity: 2,
        totalMentored: 8,
        rating: 4.6,
        status: "AVAILABLE",
        specialization: "Financial Planning",
        experience: 6
      },
      {
        id: "M005",
        name: "Suresh Reddy",
        employeeId: "EMP009",
        department: "Information Technology",
        email: "suresh.reddy@iocl.co.in",
        phone: "+91-9876543218",
        expertise: ["Database Management", "System Architecture", "Cloud Computing"],
        currentTrainees: 1,
        maxCapacity: 2,
        totalMentored: 12,
        rating: 4.5,
        status: "AVAILABLE",
        specialization: "Database Systems",
        experience: 9
      }
    ]

    // Filter based on user role and permissions
    let roleFilteredMentors = allMentors

    switch (currentUser.role) {
      case "L&D Coordinator":
        // Can view all mentors for coordination
        roleFilteredMentors = allMentors
        break
        
      case "L&D HoD":
        // Can view all mentors for oversight
        roleFilteredMentors = allMentors
        break
        
      case "Department HoD":
        // Can only view mentors from their department
        roleFilteredMentors = allMentors.filter(mentor => 
          mentor.department === currentUser.department
        )
        break
        
      case "Mentor":
        // Can view other mentors for collaboration (limited info)
        roleFilteredMentors = allMentors.filter(mentor => 
          mentor.employeeId !== currentUser.employeeId
        )
        break
        
      default:
        // Limited view for other roles
        roleFilteredMentors = allMentors.filter(mentor => 
          mentor.status === "AVAILABLE"
        )
    }

    setMentors(roleFilteredMentors)
    setFilteredMentors(roleFilteredMentors)
  }

  // Filter mentors based on search and filters
  useEffect(() => {
    let filtered = mentors

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(mentor => mentor.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(mentor => mentor.status === statusFilter)
    }

    setFilteredMentors(filtered)
  }, [searchTerm, departmentFilter, statusFilter, mentors])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-100 text-green-800"><UserCheck className="h-3 w-3 mr-1" />Available</Badge>
      case "BUSY":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Busy</Badge>
      case "UNAVAILABLE":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Unavailable</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const canAssignMentor = () => {
    return ["L&D Coordinator", "Department HoD"].includes(user?.role)
  }

  const canViewDetails = (mentor: Mentor) => {
    switch (user?.role) {
      case "L&D Coordinator":
      case "L&D HoD":
        return true
      case "Department HoD":
        return mentor.department === user.department
      case "Mentor":
        return mentor.employeeId !== user.employeeId
      default:
        return false
    }
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "All Mentors"
      case "L&D HoD":
        return "Mentor Management"
      case "Department HoD":
        return `${user.department} Mentors`
      case "Mentor":
        return "Fellow Mentors"
      default:
        return "Mentors"
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "Coordinate with mentors across all departments for trainee assignments"
      case "L&D HoD":
        return "Strategic oversight of mentor performance and capacity management"
      case "Department HoD":
        return "Assign and manage mentors within your department"
      case "Mentor":
        return "Connect and collaborate with fellow mentors"
      default:
        return "View available mentors"
    }
  }

  const getActionButton = (mentor: Mentor) => {
    if (!canViewDetails(mentor)) return null

    switch (user?.role) {
      case "L&D Coordinator":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Mail className="h-3 w-3 mr-1" />
              Contact
            </Button>
            <Button size="sm">
              <UserCheck className="h-3 w-3 mr-1" />
              Coordinate
            </Button>
          </div>
        )
      case "L&D HoD":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Review
            </Button>
            <Button size="sm">
              <Award className="h-3 w-3 mr-1" />
              Evaluate
            </Button>
          </div>
        )
      case "Department HoD":
        return mentor.status === "AVAILABLE" ? (
          <Button size="sm">
            <UserPlus className="h-3 w-3 mr-1" />
            Assign
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            Monitor
          </Button>
        )
      case "Mentor":
        return (
          <Button size="sm" variant="outline">
            <Mail className="h-3 w-3 mr-1" />
            Connect
          </Button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <PageLoading message="Loading mentors..." />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Role-based Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="px-3 py-1">
              {user.role}
            </Badge>
            {user.role === "L&D HoD" && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Mentor
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Role-specific Alerts */}
        {user.role === "L&D Coordinator" && (
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Coordination Mode:</strong> View all mentors and their capacity for effective trainee-mentor matching across departments.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Department HoD" && (
          <Alert className="border-green-200 bg-green-50">
            <UserPlus className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Assignment Authority:</strong> Assign mentors from your department and monitor their workload and performance.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Mentor" && (
          <Alert className="border-orange-200 bg-orange-50">
            <Users className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              <strong>Collaboration Network:</strong> Connect with fellow mentors to share experiences and best practices.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mentors.filter(m => m.status === "AVAILABLE").length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trainees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mentors.reduce((sum, m) => sum + m.currentTrainees, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mentors.length > 0 ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1) : "0"}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Mentors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, employee ID, expertise, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BUSY">Busy</SelectItem>
                  <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.employeeId}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(mentor.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-sm text-gray-900">{mentor.department}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Specialization</p>
                  <p className="text-sm text-gray-900">{mentor.specialization}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-sm text-gray-900">{mentor.experience} years</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{mentor.currentTrainees}/{mentor.maxCapacity}</span>
                  </div>
                  <Progress 
                    value={(mentor.currentTrainees / mentor.maxCapacity) * 100} 
                    className="h-2"
                  />
                </div>

                {(user.role === "L&D HoD" || user.role === "L&D Coordinator") && (
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="block">Total Mentored</span>
                      <span className="font-medium text-gray-900">{mentor.totalMentored}</span>
                    </div>
                    <div>
                      <span className="block">Contact</span>
                      <a href={`mailto:${mentor.email}`} className="font-medium text-blue-600 hover:underline">
                        Email
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  {canViewDetails(mentor) && (
                    <Dialog>
                      <div className="flex gap-2">
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <div className="flex-1">
                          {getActionButton(mentor)}
                        </div>
                      </div>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Mentor Profile - {mentor.name}</DialogTitle>
                          <DialogDescription>
                            Complete mentor information and performance details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Employee ID</Label>
                              <p className="text-sm text-gray-600">{mentor.employeeId}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Department</Label>
                              <p className="text-sm text-gray-600">{mentor.department}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Email</Label>
                              <p className="text-sm text-gray-600">{mentor.email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Phone</Label>
                              <p className="text-sm text-gray-600">{mentor.phone}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Experience</Label>
                              <p className="text-sm text-gray-600">{mentor.experience} years</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Rating</Label>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                <span className="text-sm font-medium">{mentor.rating}/5.0</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Specialization</Label>
                            <p className="text-sm text-gray-600 mt-1">{mentor.specialization}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Expertise Areas</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {mentor.expertise.map((skill, index) => (
                                <Badge key={index} variant="outline">{skill}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Current Trainees</Label>
                              <p className="text-sm text-gray-600">{mentor.currentTrainees}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Max Capacity</Label>
                              <p className="text-sm text-gray-600">{mentor.maxCapacity}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Total Mentored</Label>
                              <p className="text-sm text-gray-600">{mentor.totalMentored}</p>
                            </div>
                          </div>

                          {mentor.assignedRequests && mentor.assignedRequests.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Assigned Requests</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {mentor.assignedRequests.map((reqId, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-800">{reqId}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No mentors found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
