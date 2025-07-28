"use client"

import { useState } from "react"
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Users, Award, Plus, RefreshCw, UserCheck, Target, Star, Building, Clock, AlertCircle } from "lucide-react"

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const mentors = [
    {
      id: "1",
      name: "Dr. Vikram Gupta",
      email: "vikram.gupta@iocl.com",
      phone: "+91-98765-43210",
      department: "Information Technology",
      designation: "Senior Manager",
      experience: "15 years",
      specialization: ["Web Development", "Database Management", "System Architecture"],
      currentInterns: 2,
      maxInterns: 4,
      location: "Mumbai",
      rating: 4.8,
      completedInternships: 25,
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "2",
      name: "Ms. Priya Sharma",
      email: "priya.sharma@iocl.com",
      phone: "+91-98765-43211",
      department: "Engineering",
      designation: "Assistant General Manager",
      experience: "12 years",
      specialization: ["Process Engineering", "Safety Systems", "Project Management"],
      currentInterns: 1,
      maxInterns: 3,
      location: "Delhi",
      rating: 4.9,
      completedInternships: 18,
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "3",
      name: "Mr. Rajesh Kumar",
      email: "rajesh.kumar@iocl.com",
      phone: "+91-98765-43212",
      department: "Research & Development",
      designation: "Principal Scientist",
      experience: "18 years",
      specialization: ["Petroleum Chemistry", "Alternative Fuels", "Innovation"],
      currentInterns: 3,
      maxInterns: 5,
      location: "Bangalore",
      rating: 4.7,
      completedInternships: 32,
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "4",
      name: "Dr. Meera Joshi",
      email: "meera.joshi@iocl.com",
      phone: "+91-98765-43213",
      department: "Operations",
      designation: "Deputy General Manager",
      experience: "14 years",
      specialization: ["Operations Management", "Supply Chain", "Quality Control"],
      currentInterns: 0,
      maxInterns: 3,
      location: "Chennai",
      rating: 4.6,
      completedInternships: 22,
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "5",
      name: "Mr. Amit Patel",
      email: "amit.patel@iocl.com",
      phone: "+91-98765-43214",
      department: "Information Technology",
      designation: "Manager",
      experience: "10 years",
      specialization: ["Data Analytics", "Machine Learning", "Business Intelligence"],
      currentInterns: 1,
      maxInterns: 2,
      location: "Pune",
      rating: 4.5,
      completedInternships: 15,
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "6",
      name: "Ms. Kavya Nair",
      email: "kavya.nair@iocl.com",
      phone: "+91-98765-43215",
      department: "Finance",
      designation: "Senior Manager",
      experience: "13 years",
      specialization: ["Financial Analysis", "Risk Management", "Budget Planning"],
      currentInterns: 2,
      maxInterns: 3,
      location: "Hyderabad",
      rating: 4.4,
      completedInternships: 19,
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ]

  const getAvailabilityBadge = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 100) {
      return <Badge className="bg-red-100 text-red-800 px-3 py-1">Full</Badge>
    } else if (percentage >= 75) {
      return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">Limited</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 px-3 py-1">Available</Badge>
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialization.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDepartment = departmentFilter === "all" || mentor.department === departmentFilter
    
    const matchesAvailability = availabilityFilter === "all" || 
                               (availabilityFilter === "available" && mentor.currentInterns < mentor.maxInterns) ||
                               (availabilityFilter === "full" && mentor.currentInterns >= mentor.maxInterns)
    
    return matchesSearch && matchesDepartment && matchesAvailability
  })

  // Calculate dynamic stats
  const totalMentors = mentors.length
  const availableMentors = mentors.filter(m => m.currentInterns < m.maxInterns).length
  const activeTrainees = mentors.reduce((sum, m) => sum + m.currentInterns, 0)
  const avgRating = mentors.length > 0 ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1) : "0"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header and Stats Section (L&D HoD style) */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600">Manage and assign mentors to internship programs</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              Mentor Management
            </Badge>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid (L&D HoD style, dynamic mentor stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMentors}</p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
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
                  <p className="text-2xl font-bold text-green-600">{availableMentors}</p>
                  <p className="text-xs text-green-600 mt-1">Ready to mentor</p>
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
                  <p className="text-2xl font-bold text-purple-600">{activeTrainees}</p>
                  <p className="text-xs text-purple-600 mt-1">Currently assigned</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{avgRating}</p>
                  <p className="text-xs text-yellow-600 mt-1">Mentor feedback</p>
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
                  placeholder="Search by name, department, or specialization..."
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
                  <SelectItem value="Research & Development">Research & Development</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="full">Full Capacity</SelectItem>
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
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.designation}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>
                  {getAvailabilityBadge(mentor.currentInterns, mentor.maxInterns)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-sm text-gray-900">{mentor.department}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-sm text-gray-900">{mentor.experience}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Specialization</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.specialization.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.specialization.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.specialization.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{mentor.currentInterns}/{mentor.maxInterns}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(mentor.currentInterns / mentor.maxInterns) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="block">Completed</span>
                    <span className="font-medium text-gray-900">{mentor.completedInternships}</span>
                  </div>
                  <div>
                    <span className="block">Location</span>
                    <span className="font-medium text-gray-900">{mentor.location}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
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
