"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Mail, 
  Phone, 
  Building, 
  User, 
  Calendar,
  RefreshCw,
  Eye,
  Users,
  Award,
  Activity,
  Send,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { PageLoading } from "@/components/ui/page-loading"
import { toast } from "sonner"

interface LNDHOD {
  id: number // Changed from string to number
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  designation: string
  employeeId: string
  location?: string
  experience?: string
  specialization?: string[]
  currentMentors: number
  totalMentors: number
  activeTrainees: number
  completedPrograms: number
  averageRating: number
  lastActive: string
  status: string
  avatar?: string
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

export default function LNDHODListPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lndHODs, setLndHODs] = useState<LNDHOD[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<LNDHOD | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  // Send Request Dialog State
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false)
  const [selectedHOD, setSelectedHOD] = useState<LNDHOD | null>(null)
  const [approvedTrainees, setApprovedTrainees] = useState<ApprovedTrainee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [sentTrainees, setSentTrainees] = useState<number[]>([]) // Track sent trainees

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadLNDHODData()
    
    // Load sent trainees from localStorage
    const savedSentTrainees = localStorage.getItem("sentTrainees")
    if (savedSentTrainees) {
      setSentTrainees(JSON.parse(savedSentTrainees))
    }
    
    setLoading(false)
  }, [router])

  const loadLNDHODData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      console.log("🔍 Fetching L&D HOD data...")
      
      const response = await fetch('/api/lnd-hod-list')
      
      if (!response.ok) {
        throw new Error('Failed to fetch L&D HOD data')
      }
      
      const data = await response.json()
      console.log("✅ L&D HOD data loaded:", data)
      setLndHODs(data.lndHODs || [])
      
    } catch (error) {
      console.error('Error loading L&D HOD data:', error)
      setError('Failed to load L&D HOD data. Please try again.')
      toast.error('Failed to load L&D HOD data')
    } finally {
      setRefreshing(false)
    }
  }

  const handleViewProfile = (hod: LNDHOD) => {
    setSelectedProfile(hod)
    setIsProfileDialogOpen(true)
  }

  // Send Request Functions
  const loadSendRequestData = async () => {
    setIsLoadingData(true)
    try {
      console.log("🔍 Loading send request data...")
      
      const [traineesRes, departmentsRes] = await Promise.all([
        fetch("/api/department-hod/approved-trainees"),
        fetch("/api/department")
      ])

      console.log("📊 Trainees response status:", traineesRes.status)
      console.log("📊 Departments response status:", departmentsRes.status)

      if (traineesRes.ok) {
        const traineesData = await traineesRes.json()
        console.log("✅ Trainees data loaded:", traineesData)
        
        // Get the approvedTrainees array from the response
        const approvedTraineesArray = traineesData.approvedTrainees || []
        
        // Filter out trainees that have already been sent
        const availableTrainees = approvedTraineesArray.filter((trainee: ApprovedTrainee) => 
          !sentTrainees.includes(trainee.id)
        )
        console.log("✅ Available trainees (excluding sent):", availableTrainees.length)
        
        setApprovedTrainees(availableTrainees)
      } else {
        console.error("❌ Failed to load trainees:", traineesRes.status)
        const errorText = await traineesRes.text()
        console.error("Error details:", errorText)
        toast.error("Failed to load trainees data")
      }

      if (departmentsRes.ok) {
        const departmentsData = await departmentsRes.json()
        console.log("✅ Departments data loaded:", departmentsData)
        setDepartments(departmentsData)
      } else {
        console.error("❌ Failed to load departments:", departmentsRes.status)
        toast.error("Failed to load departments data")
      }
    } catch (error) {
      console.error("Failed to load send request data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSendRequest = async (hodId?: string) => {
    if (!hodId || selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to send")
      return
    }

    setIsProcessing(true)
    try {
      const selectedTraineeData = approvedTrainees.filter(t => selectedTrainees.includes(t.id))

      const response = await fetch("/api/test-simple-forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hodId: selectedHOD?.id, // Pass the number ID directly
          department: selectedDepartment || selectedHOD?.department || "General",
          applications: selectedTraineeData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      const result = await response.json()
      toast.success("Request sent!!")

      // Update sent trainees
      const updatedSentTrainees = [...sentTrainees, ...selectedTrainees]
      setSentTrainees(updatedSentTrainees)

      // Save sent trainees to localStorage
      localStorage.setItem("sentTrainees", JSON.stringify(updatedSentTrainees))

      // Reset selections
      setSelectedTrainees([])
      setSelectedDepartment("")
      setIsSendRequestOpen(false)
      setSelectedHOD(null)

    } catch (error) {
      console.error("Error sending request:", error)
      toast.error("Failed to send request. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenSendRequest = (hod: LNDHOD) => {
    setSelectedHOD(hod)
    setIsSendRequestOpen(true)
    loadSendRequestData()
  }

  const resetSentTrainees = () => {
    setSentTrainees([])
    localStorage.removeItem("sentTrainees")
    toast.success("Sent trainees list reset!")
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (loading) {
    return <PageLoading message="Loading L&D HOD list..." />
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
              L&D HOD Directory - View all current Learning & Development Heads of Department
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Shield className="h-4 w-4 mr-2" />
              L&D Coordinator
            </Badge>
            <Button 
              onClick={loadLNDHODData} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={loadLNDHODData} 
                    variant="outline" 
                    size="sm"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* L&D HOD Cards */}
        {lndHODs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lndHODs.map((hod) => (
              <Card key={hod.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={hod.avatar} alt={`${hod.firstName} ${hod.lastName}`} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {hod.firstName?.charAt(0)}{hod.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {hod.firstName} {hod.lastName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {hod.designation}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(hod.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {hod.email}
                    </div>
                    {hod.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {hod.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {hod.employeeId}
                    </div>
                    {hod.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {hod.location}
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{hod.currentMentors}</div>
                      <div className="text-xs text-gray-500">Current Mentors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{hod.activeTrainees}</div>
                      <div className="text-xs text-gray-500">Active Trainees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{hod.completedPrograms}</div>
                      <div className="text-xs text-gray-500">Completed Programs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{hod.averageRating}</div>
                      <div className="text-xs text-gray-500">Avg Rating</div>
                    </div>
                  </div>

                  {/* Specializations */}
                  {hod.specialization && hod.specialization.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {hod.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last Active */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last active: {new Date(hod.lastActive).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewProfile(hod)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Dialog open={isSendRequestOpen && selectedHOD?.id === hod.id} onOpenChange={setIsSendRequestOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleOpenSendRequest(hod)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Send className="h-5 w-5 mr-2" />
                              Send Trainee Request to {selectedHOD?.firstName} {selectedHOD?.lastName}
                            </DialogTitle>
                            <DialogDescription>
                              Select approved trainees and send their details to {selectedHOD?.firstName} {selectedHOD?.lastName} for review and department assignment
                            </DialogDescription>
                          </DialogHeader>

                          {isLoadingData ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin mr-2" />
                              <span>Loading approved trainees...</span>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Debug Info */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Debug Info:</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>Approved Trainees: {approvedTrainees.length}</div>
                                  <div>Sent Trainees: {sentTrainees.length}</div>
                                  <div>Departments: {departments.length}</div>
                                  <div>Selected Trainees: {selectedTrainees.length}</div>
                                  <div>Selected Department: {selectedDepartment || 'None'}</div>
                                  <div>Search Term: "{searchTerm}"</div>
                                  <div>Filter Department: {filterDepartment}</div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={resetSentTrainees}
                                  className="mt-2"
                                >
                                  Reset Sent Trainees
                                </Button>
                              </div>

                              {/* Filters */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Search Trainees</Label>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="text"
                                      placeholder="Search by name, email, or institution..."
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="pl-10"
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
                                        <SelectItem key={dept.id} value={dept.name}>
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

                              {/* Trainees Table */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">Approved Trainees ({approvedTrainees.filter(trainee => {
                                    const matchesSearch = searchTerm === "" ||
                                      trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                    const matchesDepartment = filterDepartment === "all" ||
                                      trainee.preferredDepartment === filterDepartment

                                    return matchesSearch && matchesDepartment
                                  }).length})</h3>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const filteredTrainees = approvedTrainees.filter(trainee => {
                                          const matchesSearch = searchTerm === "" ||
                                            trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                          const matchesDepartment = filterDepartment === "all" ||
                                            trainee.preferredDepartment === filterDepartment

                                          return matchesSearch && matchesDepartment
                                        })
                                        setSelectedTrainees(filteredTrainees.map(t => t.id))
                                      }}
                                    >
                                      Select All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedTrainees([])}
                                    >
                                      Deselect All
                                    </Button>
                                  </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-12">
                                          <input
                                            type="checkbox"
                                            checked={selectedTrainees.length === approvedTrainees.filter(trainee => {
                                              const matchesSearch = searchTerm === "" ||
                                                trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                              const matchesDepartment = filterDepartment === "all" ||
                                                trainee.preferredDepartment === filterDepartment

                                              return matchesSearch && matchesDepartment
                                            }).length && approvedTrainees.filter(trainee => {
                                              const matchesSearch = searchTerm === "" ||
                                                trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                              const matchesDepartment = filterDepartment === "all" ||
                                                trainee.preferredDepartment === filterDepartment

                                              return matchesSearch && matchesDepartment
                                            }).length > 0}
                                            onChange={() => {
                                              const filteredTrainees = approvedTrainees.filter(trainee => {
                                                const matchesSearch = searchTerm === "" ||
                                                  trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                                const matchesDepartment = filterDepartment === "all" ||
                                                  trainee.preferredDepartment === filterDepartment

                                                return matchesSearch && matchesDepartment
                                              })
                                              if (selectedTrainees.length === filteredTrainees.length) {
                                                setSelectedTrainees([])
                                              } else {
                                                setSelectedTrainees(filteredTrainees.map(t => t.id))
                                              }
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                          />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sent</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {approvedTrainees.filter(trainee => {
                                        const matchesSearch = searchTerm === "" ||
                                          trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          trainee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          trainee.institutionName.toLowerCase().includes(searchTerm.toLowerCase())

                                        const matchesDepartment = filterDepartment === "all" ||
                                          trainee.preferredDepartment === filterDepartment

                                        return matchesSearch && matchesDepartment
                                      }).map((trainee) => (
                                        <TableRow key={trainee.id}>
                                          <TableCell>
                                            <input
                                              type="checkbox"
                                              checked={selectedTrainees.includes(trainee.id)}
                                              onChange={() => {
                                                setSelectedTrainees(prev =>
                                                  prev.includes(trainee.id)
                                                    ? prev.filter(id => id !== trainee.id)
                                                    : [...prev, trainee.id]
                                                )
                                              }}
                                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <div>
                                              <div className="font-medium">{trainee.firstName} {trainee.lastName}</div>
                                              <div className="text-sm text-gray-500">{trainee.phone}</div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{trainee.email}</TableCell>
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
                                            {getStatusBadge(trainee.status)}
                                          </TableCell>
                                          <TableCell>
                                            {sentTrainees.includes(trainee.id) ? (
                                              <Badge variant="success">Sent</Badge>
                                            ) : (
                                              <Badge variant="outline">Pending</Badge>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Send Request Section */}
                              {selectedTrainees.length > 0 && (
                                <Alert className="border-blue-200 bg-blue-50">
                                  <Send className="h-4 w-4 text-blue-600" />
                                  <AlertDescription className="text-blue-700">
                                    You have selected {selectedTrainees.length} trainee(s) to send to {selectedDepartment || selectedHOD?.department || "selected department"}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {/* Summary Section */}
                              <Alert className="border-gray-200 bg-gray-50">
                                <Users className="h-4 w-4 text-gray-600" />
                                <AlertDescription className="text-gray-700">
                                  <div className="flex justify-between items-center">
                                    <span>Available: {approvedTrainees.length} trainees</span>
                                    <span>Sent: {sentTrainees.length} trainees</span>
                                  </div>
                                </AlertDescription>
                              </Alert>

                              {/* Action Buttons */}
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsSendRequestOpen(false)
                                    setSelectedHOD(null)
                                    setSelectedTrainees([])
                                    setSelectedDepartment("")
                                  }}
                                  disabled={isProcessing}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleSendRequest(selectedHOD?.id)}
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
                                      Send to {selectedHOD?.firstName} {selectedHOD?.lastName}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No L&D HODs Found</h3>
              <p className="text-gray-500 mb-4">
                No L&D Heads of Department are currently registered in the system.
              </p>
              <Button onClick={loadLNDHODData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {lndHODs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                L&D HOD Summary
              </CardTitle>
              <CardDescription>
                Overview of all L&D Heads of Department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{lndHODs.length}</div>
                  <div className="text-sm text-gray-500">Total L&D HODs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {lndHODs.filter(hod => hod.status === 'ACTIVE').length}
                  </div>
                  <div className="text-sm text-gray-500">Active HODs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {lndHODs.reduce((sum, hod) => sum + hod.currentMentors, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {lndHODs.reduce((sum, hod) => sum + hod.activeTrainees, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Trainees</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                L&D HOD Profile
              </DialogTitle>
              <DialogDescription>
                Detailed information about {selectedProfile?.firstName} {selectedProfile?.lastName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedProfile && (
              <div className="space-y-6">
                {/* Header with Avatar */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedProfile.avatar} alt={`${selectedProfile.firstName} ${selectedProfile.lastName}`} />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                      {selectedProfile.firstName?.charAt(0)}{selectedProfile.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedProfile.firstName} {selectedProfile.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedProfile.designation}</p>
                    <p className="text-sm text-gray-500">{selectedProfile.department}</p>
                    <div className="mt-2">
                      {getStatusBadge(selectedProfile.status)}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{selectedProfile.email}</span>
                      </div>
                      {selectedProfile.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{selectedProfile.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{selectedProfile.employeeId}</span>
                      </div>
                      {selectedProfile.location && (
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{selectedProfile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Professional Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Experience: {selectedProfile.experience}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">Rating: {selectedProfile.averageRating}/5.0</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">
                          Last Active: {new Date(selectedProfile.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Performance Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedProfile.currentMentors}</div>
                      <div className="text-xs text-gray-600">Current Mentors</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedProfile.activeTrainees}</div>
                      <div className="text-xs text-gray-600">Active Trainees</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedProfile.completedPrograms}</div>
                      <div className="text-xs text-gray-600">Completed Programs</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedProfile.totalMentors}</div>
                      <div className="text-xs text-gray-600">Total Mentors</div>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                {selectedProfile.specialization && selectedProfile.specialization.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsProfileDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact {selectedProfile.firstName}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
} 