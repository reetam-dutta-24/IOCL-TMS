"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Search, Filter, Plus, Mail, Phone, Building } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MentorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const mentors = [
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
      status: "ACTIVE",
    },
    {
      id: "M002",
      name: "Meera Joshi",
      employeeId: "EMP006",
      department: "Operations",
      email: "meera.joshi@iocl.co.in",
      phone: "+91-9876543215",
      expertise: ["Process Engineering", "Quality Control", "Safety Management"],
      currentTrainees: 1,
      maxCapacity: 3,
      totalMentored: 12,
      rating: 4.6,
      status: "ACTIVE",
    },
    {
      id: "M003",
      name: "Kavita Nair",
      employeeId: "EMP008",
      department: "Engineering",
      email: "kavita.nair@iocl.co.in",
      phone: "+91-9876543217",
      expertise: ["Mechanical Engineering", "Project Management", "Design"],
      currentTrainees: 3,
      maxCapacity: 3,
      totalMentored: 20,
      rating: 4.9,
      status: "FULL",
    },
    {
      id: "M004",
      name: "Rajesh Patel",
      employeeId: "EMP009",
      department: "Research & Development",
      email: "rajesh.patel@iocl.co.in",
      phone: "+91-9876543218",
      expertise: ["Chemical Engineering", "Research", "Innovation"],
      currentTrainees: 0,
      maxCapacity: 2,
      totalMentored: 8,
      rating: 4.5,
      status: "AVAILABLE",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: "default" as const, label: "Active" },
      AVAILABLE: { variant: "secondary" as const, label: "Available" },
      FULL: { variant: "destructive" as const, label: "Full Capacity" },
      INACTIVE: { variant: "outline" as const, label: "Inactive" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["ACTIVE"]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Management</h1>
            <p className="text-gray-600">Manage mentors and their assignments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Assign Mentors
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.length}</div>
              <p className="text-xs text-muted-foreground">Active mentors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.filter((m) => m.status === "AVAILABLE").length}</div>
              <p className="text-xs text-muted-foreground">Ready for assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.filter((m) => m.status === "FULL").length}</div>
              <p className="text-xs text-muted-foreground">Full capacity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(mentors.reduce((acc, m) => acc + m.rating, 0) / mentors.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Overall rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Mentors</CardTitle>
            <CardDescription>Find mentors by name, department, or employee ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&query=${mentor.name}`} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.employeeId}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(mentor.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>{mentor.department}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{mentor.email}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{mentor.phone}</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Capacity</span>
                    <span>
                      {mentor.currentTrainees}/{mentor.maxCapacity}
                    </span>
                  </div>
                  <Progress value={(mentor.currentTrainees / mentor.maxCapacity) * 100} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.expertise.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{mentor.totalMentored}</span> mentored
                  </div>
                  <div className="text-sm text-gray-600">
                    ⭐ <span className="font-medium">{mentor.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1" disabled={mentor.status === "FULL"}>
                    Assign Trainee
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
