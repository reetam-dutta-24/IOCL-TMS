"use client"

import { useState } from "react"
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Award, Plus } from "lucide-react"

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
      department: "Human Resources",
      designation: "Assistant Manager",
      experience: "8 years",
      specialization: ["Talent Management", "Training & Development", "Employee Relations"],
      currentInterns: 2,
      maxInterns: 4,
      location: "Kochi",
      rating: 4.8,
      completedInternships: 12,
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ]

  const getAvailabilityBadge = (current: number, max: number) => {
    const available = max - current
    if (available === 0) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Full</Badge>
    } else if (available === 1) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">1 Slot</Badge>
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">{available} Slots</Badge>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-700">Mentors</h1>
            <p className="text-gray-600 mt-1">
              Manage and assign mentors to internship programs
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                  <p className="text-2xl font-bold text-red-700">{mentors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-green-700">
                    {mentors.reduce((acc, mentor) => acc + (mentor.maxInterns - mentor.currentInterns), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Interns</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {mentors.reduce((acc, mentor) => acc + mentor.currentInterns, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {(mentors.reduce((acc, mentor) => acc + mentor.rating, 0) / mentors.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, department, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-red-500"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48 border-orange-200">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>\
