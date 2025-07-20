"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone, Plus, UserPlus, Calendar, CheckCircle } from "lucide-react"

export default function MentorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const mentors = [
    {
      id: "MEN001",
      name: "Dr. Rajesh Kumar",
      designation: "Senior Manager",
      department: "Information Technology",
      email: "rajesh.kumar@iocl.co.in",
      phone: "+91 9876543210",
      experience: "15 years",
      specialization: "Software Development, AI/ML",
      activeTrainees: 3,
      totalTrainees: 25,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40&query=RK"
    },
    {
      id: "MEN002",
      name: "Ms. Priya Sharma",
      designation: "Deputy Manager",
      department: "Operations",
      email: "priya.sharma@iocl.co.in",
      phone: "+91 9876543211",
      experience: "12 years",
      specialization: "Process Optimization, Safety Management",
      activeTrainees: 2,
      totalTrainees: 18,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40&query=PS"
    },
    {
      id: "MEN003",
      name: "Mr. Amit Singh",
      designation: "Assistant Manager",
      department: "Engineering",
      email: "amit.singh@iocl.co.in",
      phone: "+91 9876543212",
      experience: "8 years",
      specialization: "Mechanical Engineering, Project Management",
      activeTrainees: 1,
      totalTrainees: 12,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40&query=AS"
    },
    {
      id: "MEN004",
      name: "Dr. Meera Joshi",
      designation: "Senior Manager",
      department: "Research & Development",
      email: "meera.joshi@iocl.co.in",
      phone: "+91 9876543213",
      experience: "18 years",
      specialization: "Chemical Engineering, R&D",
      activeTrainees: 4,
      totalTrainees: 35,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40&query=MJ"
    },
    {
      id: "MEN005",
      name: "Mr. Vikram Gupta",
      designation: "Manager",
      department: "Finance",
      email: "vikram.gupta@iocl.co.in",
      phone: "+91 9876543214",
      experience: "10 years",
      specialization: "Financial Analysis, Budgeting",
      activeTrainees: 0,
      totalTrainees: 8,
      status: "Available",
      avatar: "/placeholder.svg?height=40&width=40&query=VG"
    },
  ]

  const stats = [
    {
      title: "Total Mentors",
      value: mentors.length.toString(),
      icon: Users,
      description: "Registered mentors",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Active Mentors",
      value: mentors.filter(m => m.status === "Active").length.toString(),
      icon: CheckCircle,
      description: "Currently mentoring",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Available Mentors",
      value: mentors.filter(m => m.status === "Available").length.toString(),
      icon: UserPlus,
      description: "Ready for assignment",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Total Assignments",
      value: mentors.reduce((sum, m) => sum + m.totalTrainees, 0).toString(),
      icon: Calendar,
      description: "All time mentorships",
      color: "bg-purple-100 text-purple-600"
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: "bg-green-100 text-green-800",
      Available: "bg-yellow-100 text-yellow-800",
      Unavailable: "bg-red-100 text-red-800"
    }
    
    return <Badge className={statusConfig[status as keyof typeof statusConfig]}>{status}</Badge>
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Management</h1>
            <p className="text-gray-600 mt-1">Manage mentors and their trainee assignments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Mentor
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback className="bg-red-100 text-red-600">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">{mentor.name}</CardTitle>
                      {getStatusBadge(mentor.status)}
                    </div>
                    <p className="text-sm text-gray-600">{mentor.designation}</p>
                    <p className="text-sm text-gray-500">{mentor.department}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specialization</h4>
                  <p className="text-sm text-gray-600">{mentor.specialization}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Experience:</span>
                    <p className="text-gray-600">{mentor.experience}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Active Trainees:</span>
                    <p className="text-gray-600">{mentor.activeTrainees}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-red-400" />
                    <span className="truncate">{mentor.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-red-400" />
                    <span>{mentor.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Mentorships</span>
                    <span className="font-medium text-gray-900">{mentor.totalTrainees}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    Assign Trainee
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">Quick Actions</CardTitle>
            <CardDescription>Common mentor management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col border-red-200 text-red-600 hover:bg-red-50">
                <UserPlus className="h-6 w-6 mb-2" />
                Bulk Assign Mentors
              </Button>
              <Button variant="outline" className="h-20 flex-col border-red-200 text-red-600 hover:bg-red-50">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Meetings
              </Button>
              <Button variant="outline" className="h-20 flex-col border-red-200 text-red-600 hover:bg-red-50">
                <CheckCircle className="h-6 w-6 mb-2" />
                Performance Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
