"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Eye,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Award,
  TrendingUp,
  Building,
  Target,
  BookOpen,
  Calendar,
  BarChart3,
  UserCheck,
  Send,
  Search,
  Mail,
  UserPlus,
  GraduationCap
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  isActive: boolean
}

interface ApprovedTrainee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  institutionName: string
  courseName: string
  currentYear: number
  cgpa: number
  preferredDepartment: string
  internshipDuration: number
  skills?: string
  projectInterests?: string
  status: string
  createdAt: string
  approvedAt: string
}

interface Department {
  id: number
  name: string
  code: string
}

export default function SendRequestPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [approvedTrainees, setApprovedTrainees] = useState<ApprovedTrainee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [selectedTrainee, setSelectedTrainee] = useState<ApprovedTrainee | null>(null)

  useEffect(() => {
    // Check authentication and L&D Coordinator role
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user has L&D Coordinator privileges
    if (parsedUser.role !== 'L&D Coordinator') {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    loadData()
    setIsLoading(false)
  }, [router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load approved trainees and departments
      const [traineesRes, departmentsRes] = await Promise.all([
        fetch("/api/department-hod/approved-trainees"),
        fetch("/api/department")
      ])

      if (traineesRes.ok) {
        const traineesData = await traineesRes.json()
        setApprovedTrainees(traineesData.approvedTrainees || [])
      } else {
        console.error("Failed to load approved trainees:", traineesRes.status)
        setApprovedTrainees([])
      }

      if (departmentsRes.ok) {
        const departmentsData = await departmentsRes.json()
        setDepartments(departmentsData)
      } else {
        console.error("Failed to load departments:", departmentsRes.status)
        setDepartments([])
      }

    } catch (error) {
      console.error("Failed to load data:", error)
      setMessage("Failed to load data")
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTraineeSelection = (traineeId: number) => {
    setSelectedTrainees(prev => 
      prev.includes(traineeId) 
        ? prev.filter(id => id !== traineeId)
        : [...prev, traineeId]
    )
  }

  const handleSelectAllTrainees = () => {
    const filteredTrainees = getFilteredTrainees()
    setSelectedTrainees(filteredTrainees.map(t => t.id))
  }

  const handleDeselectAllTrainees = () => {
    setSelectedTrainees([])
  }

  const getFilteredTrainees = () => {
    return approvedTrainees.filter(trainee => {
      const matchesSearch = searchTerm === "" || 
        trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = filterDepartment === "all" || 
        trainee.preferredDepartment === filterDepartment
      
      return matchesSearch && matchesDepartment
    })
  }

  const handleSendRequest = async () => {
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to send")
      return
    }

    if (!selectedDepartment) {
      toast.error("Please select a department")
      return
    }

    setIsProcessing(true)
    try {
      const selectedTraineeData = approvedTrainees.filter(t => selectedTrainees.includes(t.id))
      
      const response = await fetch("/api/notifications/forward-to-lnd-hod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: selectedDepartment,
          applications: selectedTraineeData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      const result = await response.json()
      toast.success(`✅ Successfully sent ${selectedTrainees.length} trainee details to LND HOD`)
      
      // Reset selections
      setSelectedTrainees([])
      setSelectedDepartment("")
      setMessage("Request sent successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 5000)
      
    } catch (error) {
      console.error("Error sending request:", error)
      toast.error("Failed to send request. Please try again.")
      setMessage("Failed to send request")
      setMessageType("error")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredTrainees = getFilteredTrainees()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Send Request Page...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Send Trainee Request</h1>
            <p className="text-gray-600">Select approved trainees and send their details to LND HOD for review</p>
          </div>
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <Alert className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className={`h-4 w-4 ${messageType === "success" ? "text-green-600" : "text-red-600"}`} />
            <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedTrainees.length}</p>
                  <p className="text-xs text-green-600 mt-1">All trainees</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTrainees.length}</p>
                  <p className="text-xs text-blue-600 mt-1">For sending</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                  <p className="text-xs text-purple-600 mt-1">Available</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready to Send</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedTrainees.length > 0 && selectedDepartment ? "Yes" : "No"}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">All set</p>
                </div>
                <Send className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Trainees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search Trainees</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or institution..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Filter by Department</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department to send to" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trainees Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Approved Trainees</CardTitle>
                <CardDescription>
                  Select trainees to send their details to LND HOD for {selectedDepartment || "selected department"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllTrainees}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllTrainees}
                >
                  Deselect All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedTrainees.length === filteredTrainees.length && filteredTrainees.length > 0}
                        onChange={() => 
                          selectedTrainees.length === filteredTrainees.length 
                            ? handleDeselectAllTrainees()
                            : handleSelectAllTrainees()
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainees.map((trainee) => (
                    <TableRow key={trainee.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTrainees.includes(trainee.id)}
                          onChange={() => handleTraineeSelection(trainee.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trainee.firstName} {trainee.lastName}</div>
                          <div className="text-sm text-gray-500">{trainee.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {trainee.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trainee.institutionName}</div>
                          <div className="text-sm text-gray-500">Year {trainee.currentYear}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trainee.courseName}</div>
                          <div className="text-sm text-gray-500">CGPA: {trainee.cgpa}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {departments.find(d => d.id.toString() === trainee.preferredDepartment)?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {trainee.internshipDuration} weeks
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(trainee.status)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTrainee(trainee)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Trainee Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {trainee.firstName} {trainee.lastName}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedTrainee && (
                              <div className="space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Full Name:</span> {selectedTrainee.firstName} {selectedTrainee.lastName}
                                    </div>
                                    <div>
                                      <span className="font-medium">Email:</span> {selectedTrainee.email}
                                    </div>
                                    <div>
                                      <span className="font-medium">Phone:</span> {selectedTrainee.phone}
                                    </div>
                                    <div>
                                      <span className="font-medium">Current Year:</span> {selectedTrainee.currentYear}
                                    </div>
                                  </div>
                                </div>

                                {/* Academic Information */}
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Institution:</span> {selectedTrainee.institutionName}
                                    </div>
                                    <div>
                                      <span className="font-medium">Course:</span> {selectedTrainee.courseName}
                                    </div>
                                    <div>
                                      <span className="font-medium">CGPA:</span> {selectedTrainee.cgpa}
                                    </div>
                                    <div>
                                      <span className="font-medium">Preferred Department:</span> 
                                      {departments.find(d => d.id.toString() === selectedTrainee.preferredDepartment)?.name || 'Unknown'}
                                    </div>
                                  </div>
                                </div>

                                {/* Internship Details */}
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-gray-900 border-b pb-2">Internship Details</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Duration:</span> {selectedTrainee.internshipDuration} weeks
                                    </div>
                                    <div>
                                      <span className="font-medium">Status:</span> {getStatusBadge(selectedTrainee.status)}
                                    </div>
                                  </div>
                                  
                                  {selectedTrainee.skills && (
                                    <div>
                                      <span className="font-medium text-sm">Skills:</span>
                                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedTrainee.skills}</p>
                                    </div>
                                  )}
                                  
                                  {selectedTrainee.projectInterests && (
                                    <div>
                                      <span className="font-medium text-sm">Project Interests:</span>
                                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">{selectedTrainee.projectInterests}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Send Request Section */}
        {selectedTrainees.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Send className="h-5 w-5 mr-2" />
                Send Request to LND HOD
              </CardTitle>
              <CardDescription className="text-blue-700">
                You have selected {selectedTrainees.length} trainee(s) to send to {selectedDepartment || "selected department"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-medium text-gray-900">Selected Trainees</h4>
                    <p className="text-sm text-gray-600">
                      {selectedTrainees.length} trainee(s) ready to send
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Target Department</p>
                    <p className="text-sm text-gray-600">{selectedDepartment || "Not selected"}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTrainees([])
                      setSelectedDepartment("")
                    }}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendRequest}
                    disabled={!selectedDepartment || selectedTrainees.length === 0 || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send to LND HOD
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 