"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, Eye, Edit, Download } from "lucide-react"

export default function RequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const requests = [
    {
      id: "REQ001",
      traineeName: "Arjun Reddy",
      institution: "IIT Delhi",
      department: "Information Technology",
      status: "SUBMITTED",
      submittedDate: "2024-01-15",
      duration: "3 months",
      priority: "High"
    },
    {
      id: "REQ002",
      traineeName: "Sneha Agarwal",
      institution: "NIT Trichy",
      department: "Information Technology",
      status: "UNDER_REVIEW",
      submittedDate: "2024-01-14",
      duration: "6 months",
      priority: "Medium"
    },
    {
      id: "REQ003",
      traineeName: "Rohit Sharma",
      institution: "BITS Pilani",
      department: "Engineering",
      status: "APPROVED",
      submittedDate: "2024-01-12",
      duration: "4 months",
      priority: "High"
    },
    {
      id: "REQ004",
      traineeName: "Priya Mishra",
      institution: "IISC Bangalore",
      department: "Operations",
      status: "APPROVED",
      submittedDate: "2024-01-10",
      duration: "2 months",
      priority: "Low"
    },
    {
      id: "REQ005",
      traineeName: "Vikram Gupta",
      institution: "IIT Bombay",
      department: "Finance",
      status: "REJECTED",
      submittedDate: "2024-01-08",
      duration: "3 months",
      priority: "Medium"
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { 
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", 
        label: "Submitted" 
      },
      UNDER_REVIEW: { 
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
        label: "Under Review" 
      },
      APPROVED: { 
        className: "bg-green-100 text-green-800 hover:bg-green-200", 
        label: "Approved" 
      },
      REJECTED: { 
        className: "bg-red-100 text-red-800 hover:bg-red-200", 
        label: "Rejected" 
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["SUBMITTED"]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800"
    }
    
    return <Badge className={priorityConfig[priority as keyof typeof priorityConfig]}>{priority}</Badge>
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Internship Requests</h1>
            <p className="text-gray-600 mt-1">Manage and review trainee internship applications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">Search & Filter</CardTitle>
            <CardDescription>Find and filter requests based on your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by trainee name, institution, or request ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-900">All Requests ({filteredRequests.length})</CardTitle>
            <CardDescription>Complete list of internship requests with details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-red-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-red-50">
                  <TableRow className="hover:bg-red-100">
                    <TableHead className="font-semibold text-red-900">Request ID</TableHead>
                    <TableHead className="font-semibold text-red-900">Trainee</TableHead>
                    <TableHead className="font-semibold text-red-900">Institution</TableHead>
                    <TableHead className="font-semibold text-red-900">Department</TableHead>
                    <TableHead className="font-semibold text-red-900">Duration</TableHead>
                    <TableHead className="font-semibold text-red-900">Priority</TableHead>
                    <TableHead className="font-semibold text-red-900">Status</TableHead>
                    <TableHead className="font-semibold text-red-900">Date</TableHead>
                    <TableHead className="text-right font-semibold text-red-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-red-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{request.id}</TableCell>
                      <TableCell className="text-gray-700">{request.traineeName}</TableCell>
                      <TableCell className="text-gray-700">{request.institution}</TableCell>
                      <TableCell className="text-gray-700">{request.department}</TableCell>
                      <TableCell className="text-gray-600">{request.duration}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-gray-600">{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
