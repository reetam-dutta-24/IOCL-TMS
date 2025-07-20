"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const requests = [
    {
      id: "REQ001",
      traineeName: "Arjun Reddy",
      email: "arjun.reddy@student.edu",
      institution: "IIT Delhi",
      department: "Information Technology",
      status: "SUBMITTED",
      submittedDate: "2024-01-15",
      duration: "6 months",
      mentor: null,
    },
    {
      id: "REQ002",
      traineeName: "Sneha Agarwal",
      email: "sneha.agarwal@student.edu",
      institution: "NIT Trichy",
      department: "Information Technology",
      status: "UNDER_REVIEW",
      submittedDate: "2024-01-14",
      duration: "3 months",
      mentor: null,
    },
    {
      id: "REQ003",
      traineeName: "Rohit Sharma",
      email: "rohit.sharma@student.edu",
      institution: "BITS Pilani",
      department: "Engineering",
      status: "APPROVED",
      submittedDate: "2024-01-12",
      duration: "4 months",
      mentor: "Dr. Vikram Gupta",
    },
    {
      id: "REQ004",
      traineeName: "Priya Patel",
      email: "priya.patel@student.edu",
      institution: "IIT Bombay",
      department: "Research & Development",
      status: "IN_PROGRESS",
      submittedDate: "2024-01-10",
      duration: "6 months",
      mentor: "Dr. Rajesh Kumar",
    },
    {
      id: "REQ005",
      traineeName: "Amit Singh",
      email: "amit.singh@student.edu",
      institution: "NIT Delhi",
      department: "Operations",
      status: "COMPLETED",
      submittedDate: "2023-12-15",
      duration: "3 months",
      mentor: "Ms. Meera Joshi",
    },
    {
      id: "REQ006",
      traineeName: "Kavya Nair",
      email: "kavya.nair@student.edu",
      institution: "IIT Madras",
      department: "Information Technology",
      status: "REJECTED",
      submittedDate: "2024-01-08",
      duration: "4 months",
      mentor: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { variant: "secondary" as const, label: "Submitted", className: "bg-blue-100 text-blue-800" },
      UNDER_REVIEW: { variant: "default" as const, label: "Under Review", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { variant: "default" as const, label: "Approved", className: "bg-green-100 text-green-800" },
      IN_PROGRESS: { variant: "default" as const, label: "In Progress", className: "bg-purple-100 text-purple-800" },
      COMPLETED: { variant: "secondary" as const, label: "Completed", className: "bg-gray-100 text-gray-800" },
      REJECTED: { variant: "destructive" as const, label: "Rejected", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["SUBMITTED"]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || request.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-700">Internship Requests</h1>
            <p className="text-gray-600 mt-1">Manage and track all internship requests</p>
          </div>
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, ID, or institution..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-red-500"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-orange-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48 border-orange-200">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Research & Development">Research & Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-red-700">Requests ({filteredRequests.length})</CardTitle>
            <CardDescription>
              {filteredRequests.length} of {requests.length} requests shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-orange-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium text-red-700">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.traineeName}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.institution}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.mentor ? (
                          <span className="text-sm">{request.mentor}</span>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Documents
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
