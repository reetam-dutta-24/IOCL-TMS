"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function RequestsPage() {
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

  const requests = [
    {
      id: "REQ001",
      traineeName: "Arjun Reddy",
      institution: "IIT Delhi",
      course: "Computer Science Engineering",
      department: "Information Technology",
      duration: "60 days",
      status: "SUBMITTED",
      submittedDate: "2024-01-15",
      priority: "HIGH",
    },
    {
      id: "REQ002",
      traineeName: "Sneha Agarwal",
      institution: "NIT Trichy",
      course: "Information Technology",
      department: "Information Technology",
      duration: "90 days",
      status: "UNDER_REVIEW",
      submittedDate: "2024-01-14",
      priority: "MEDIUM",
    },
    {
      id: "REQ003",
      traineeName: "Rohit Sharma",
      institution: "BITS Pilani",
      course: "Mechanical Engineering",
      department: "Engineering",
      duration: "120 days",
      status: "MENTOR_ASSIGNED",
      submittedDate: "2024-01-12",
      priority: "LOW",
    },
    {
      id: "REQ004",
      traineeName: "Priya Singh",
      institution: "IIT Bombay",
      course: "Chemical Engineering",
      department: "Operations",
      duration: "90 days",
      status: "APPROVED",
      submittedDate: "2024-01-10",
      priority: "HIGH",
    },
    {
      id: "REQ005",
      traineeName: "Vikash Kumar",
      institution: "NIT Warangal",
      course: "Electronics Engineering",
      department: "Engineering",
      duration: "60 days",
      status: "COMPLETED",
      submittedDate: "2024-01-08",
      priority: "MEDIUM",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { variant: "secondary" as const, label: "Submitted" },
      UNDER_REVIEW: { variant: "default" as const, label: "Under Review" },
      MENTOR_ASSIGNED: { variant: "outline" as const, label: "Mentor Assigned" },
      APPROVED: { variant: "default" as const, label: "Approved" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      COMPLETED: { variant: "secondary" as const, label: "Completed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["SUBMITTED"]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      HIGH: { variant: "destructive" as const, label: "High" },
      MEDIUM: { variant: "default" as const, label: "Medium" },
      LOW: { variant: "secondary" as const, label: "Low" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig["MEDIUM"]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredRequests = requests.filter(
    (request) =>
      request.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Internship Requests</h1>
            <p className="text-gray-600">Manage and track all internship requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Requests</CardTitle>
            <CardDescription>Search and filter internship requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by trainee name, institution, or request ID..."
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

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
            <CardDescription>Complete list of internship requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trainee Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.traineeName}</div>
                          <div className="text-sm text-gray-500">{request.course}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.institution}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Request
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
