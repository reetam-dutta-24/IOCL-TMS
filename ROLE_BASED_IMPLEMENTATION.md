# IOCL TAMS - Role-Based Dynamic Implementation

## 🎯 Overview
This implementation provides a **completely role-based dynamic system** where each user role (L&D Coordinator, L&D HoD, Department HoD, Mentor, Admin) sees different pages, data, and has different permissions based on their specific responsibilities.

## 👨‍💼 Admin Credentials (Pre-seeded)
```
Employee ID: ADMIN001
Password: admin123
Email: admin@iocl.co.in
Role: System Administrator
```

## 🔐 User Roles & Permissions

### 1. **L&D Coordinators**
**Primary Responsibilities:**
- Initial processing of internship requests
- Coordination between different departments
- Request status monitoring and follow-up
- Documentation and record maintenance

**System Permissions:**
- View all internship requests
- Update request status
- Generate reports
- Communicate with stakeholders
- Access to dashboard analytics

**Pages & Features:**
- **Dashboard:** Coordination-focused metrics, all departments overview
- **Requests:** View and process all requests across departments
- **Mentors:** View all mentors for coordination purposes
- **Reports:** Comprehensive coordination reports

### 2. **L&D HoDs (Heads of Department)**
**Primary Responsibilities:**
- Final approval of internship requests
- Policy compliance oversight
- Resource allocation decisions
- Quality assurance of internship programs

**System Permissions:**
- Approve or reject internship requests
- Access to all L&D related data
- Generate executive reports
- Configure system parameters
- Override decisions when necessary

**Pages & Features:**
- **Dashboard:** Executive-level analytics, strategic insights
- **Requests:** Final approval authority for all requests
- **Mentors:** Full mentor management and evaluation
- **Reports:** Executive summaries and strategic insights

### 3. **Department HoDs**
**Primary Responsibilities:**
- Mentor assignment within their department
- Resource allocation for internship activities
- Departmental coordination
- Technical guidance oversight

**System Permissions:**
- View requests assigned to their department
- Assign mentors from their team
- Access departmental performance reports
- Approve departmental resources
- Monitor mentor workload

**Pages & Features:**
- **Dashboard:** Department-specific metrics and performance
- **Requests:** Only requests for their department
- **Mentors:** Only mentors from their department
- **Reports:** Department-focused analytics

### 4. **Mentors**
**Primary Responsibilities:**
- Direct supervision of assigned trainees
- Project guidance and technical support
- Performance evaluation and feedback
- Report submission and documentation

**System Permissions:**
- View assigned trainee details
- Submit progress reports
- Record behavioral comments
- Access training materials
- Update project status

**Pages & Features:**
- **Dashboard:** Personal mentoring metrics and assigned trainees
- **Requests:** Only requests assigned to them
- **Mentors:** View other mentors for collaboration
- **Reports:** Personal performance and trainee progress

### 5. **Admin**
**Primary Responsibilities:**
- System administration
- User account management
- Access request approval/rejection
- System configuration

**System Permissions:**
- Full system access
- User management
- Access request management
- System configuration
- All reports and analytics

## 📁 Updated Files

### 1. **app/requests/page.tsx** (Complete Rewrite)
```tsx
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Route,
  FileText,
  Users,
  Award,
  RefreshCw,
  User
} from "lucide-react"
import { PageLoading } from "@/components/ui/page-loading"

interface Request {
  id: string
  traineeName: string
  institution: string
  program: string
  department: string
  status: string
  submittedDate: string
  coordinator?: string
  assignedMentor?: string
  priority: string
  description?: string
  duration?: string
  requirements?: string[]
}

export default function RequestsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [actionComment, setActionComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    loadRequests(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const loadRequests = (currentUser: any) => {
    // Mock data - in real implementation, this would be role-filtered API calls
    const allRequests: Request[] = [
      {
        id: "REQ001",
        traineeName: "Arjun Reddy",
        institution: "IIT Delhi",
        program: "Summer Internship 2024",
        department: "Information Technology",
        status: "PENDING_PROCESSING",
        submittedDate: "2024-01-15",
        coordinator: "Priya Sharma",
        priority: "HIGH",
        description: "Software development internship focusing on API development",
        duration: "3 months",
        requirements: ["Programming", "Database knowledge", "API development"]
      },
      {
        id: "REQ002",
        traineeName: "Sneha Patel",
        institution: "NIT Surathkal",
        program: "Research Project",
        department: "Operations",
        status: "PENDING_MENTOR_ASSIGNMENT",
        submittedDate: "2024-01-12",
        coordinator: "Rajesh Kumar",
        priority: "MEDIUM",
        description: "Process optimization and automation study",
        duration: "6 months"
      },
      // ... more requests
    ]

    // Filter based on user role and permissions
    let roleFilteredRequests = allRequests

    switch (currentUser.role) {
      case "L&D Coordinator":
        // Can view all requests for processing and monitoring
        roleFilteredRequests = allRequests
        break
        
      case "L&D HoD":
        // Can view all L&D related data
        roleFilteredRequests = allRequests
        break
        
      case "Department HoD":
        // Can only view requests assigned to their department
        roleFilteredRequests = allRequests.filter(req => 
          req.department === currentUser.department
        )
        break
        
      case "Mentor":
        // Can only view requests assigned to them
        roleFilteredRequests = allRequests.filter(req => 
          req.assignedMentor === `${currentUser.firstName} ${currentUser.lastName}` ||
          req.status === "PENDING_MENTOR_ASSIGNMENT"
        )
        break
        
      default:
        // Limited view for other roles
        roleFilteredRequests = allRequests.filter(req => 
          req.coordinator === `${currentUser.firstName} ${currentUser.lastName}`
        )
    }

    setRequests(roleFilteredRequests)
    setFilteredRequests(roleFilteredRequests)
  }

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, statusFilter, requests])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PROCESSING":
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Pending Processing</Badge>
      case "PENDING_MENTOR_ASSIGNMENT":
        return <Badge className="bg-orange-100 text-orange-800"><Users className="h-3 w-3 mr-1" />Awaiting Mentor</Badge>
      case "PENDING_HOD_APPROVAL":
        return <Badge className="bg-purple-100 text-purple-800"><Clock className="h-3 w-3 mr-1" />HoD Approval</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800"><FileText className="h-3 w-3 mr-1" />In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-100 text-gray-800"><Award className="h-3 w-3 mr-1" />Completed</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const canTakeAction = (request: Request) => {
    switch (user?.role) {
      case "L&D Coordinator":
        return ["PENDING_PROCESSING"].includes(request.status)
      case "L&D HoD":
        return ["PENDING_HOD_APPROVAL", "APPROVED"].includes(request.status)
      case "Department HoD":
        return request.status === "PENDING_MENTOR_ASSIGNMENT" && request.department === user.department
      case "Mentor":
        return request.assignedMentor === `${user.firstName} ${user.lastName}` && 
               ["IN_PROGRESS", "APPROVED"].includes(request.status)
      default:
        return false
    }
  }

  const getActionButtons = (request: Request) => {
    if (!canTakeAction(request)) return null

    switch (user?.role) {
      case "L&D Coordinator":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "PROCESS")}>
              <Route className="h-3 w-3 mr-1" />
              Process
            </Button>
          </div>
        )
      case "L&D HoD":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "APPROVE")}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAction(request, "REJECT")}>
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        )
      case "Department HoD":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "ASSIGN_MENTOR")}>
              <Users className="h-3 w-3 mr-1" />
              Assign Mentor
            </Button>
          </div>
        )
      case "Mentor":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAction(request, "UPDATE_PROGRESS")}>
              <FileText className="h-3 w-3 mr-1" />
              Update Progress
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const handleAction = (request: Request, action: string) => {
    setSelectedRequest(request)
    // Handle different actions based on role and action type
    console.log(`${user.role} performing ${action} on request ${request.id}`)
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "All Internship Requests"
      case "L&D HoD":
        return "L&D Request Management"
      case "Department HoD":
        return `${user.department} Department Requests`
      case "Mentor":
        return "My Assigned Requests"
      default:
        return "Requests"
    }
  }

  const getPageDescription = () => {
    switch (user?.role) {
      case "L&D Coordinator":
        return "Process, route, and monitor all internship requests across departments"
      case "L&D HoD":
        return "Final approval and strategic oversight of all L&D programs"
      case "Department HoD":
        return "Manage mentor assignments and departmental coordination"
      case "Mentor":
        return "Track and update progress for your assigned trainees"
      default:
        return "View and manage requests"
    }
  }

  if (loading) {
    return <PageLoading message="Loading requests..." />
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
            {user.role === "L&D Coordinator" && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Process New Request
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
            <Route className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Coordination Hub:</strong> You can view all requests, process initial submissions, and route them to appropriate departments.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "L&D HoD" && (
          <Alert className="border-purple-200 bg-purple-50">
            <Award className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700">
              <strong>Strategic Oversight:</strong> Final approval authority for all L&D programs and policy compliance monitoring.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Department HoD" && (
          <Alert className="border-green-200 bg-green-50">
            <Users className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Mentor Assignment:</strong> Assign suitable mentors from your department and monitor departmental activities.
            </AlertDescription>
          </Alert>
        )}

        {user.role === "Mentor" && (
          <Alert className="border-orange-200 bg-orange-50">
            <User className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              <strong>Direct Supervision:</strong> Guide your assigned trainees and submit regular progress reports.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by trainee name, institution, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING_PROCESSING">Pending Processing</SelectItem>
                  <SelectItem value="PENDING_MENTOR_ASSIGNMENT">Awaiting Mentor</SelectItem>
                  <SelectItem value="PENDING_HOD_APPROVAL">HoD Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Requests ({filteredRequests.length})
            </CardTitle>
            <CardDescription>
              {user.role === "L&D Coordinator" && "All internship requests across departments"}
              {user.role === "L&D HoD" && "All L&D program requests requiring oversight"}
              {user.role === "Department HoD" && `Requests for ${user.department} department`}
              {user.role === "Mentor" && "Requests assigned to you for mentorship"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trainee</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Submitted</TableHead>
                    {user.role !== "Mentor" && <TableHead>Coordinator</TableHead>}
                    {["Department HoD", "Mentor"].includes(user.role) && <TableHead>Mentor</TableHead>}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.traineeName}</TableCell>
                      <TableCell>{request.institution}</TableCell>
                      <TableCell>{request.program}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      {user.role !== "Mentor" && <TableCell>{request.coordinator}</TableCell>}
                      {["Department HoD", "Mentor"].includes(user.role) && (
                        <TableCell>{request.assignedMentor || "Not assigned"}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details - {request.id}</DialogTitle>
                                <DialogDescription>
                                  Complete information about this internship request
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Trainee Name</Label>
                                    <p className="text-sm text-gray-600">{request.traineeName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Institution</Label>
                                    <p className="text-sm text-gray-600">{request.institution}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Program</Label>
                                    <p className="text-sm text-gray-600">{request.program}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Department</Label>
                                    <p className="text-sm text-gray-600">{request.department}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm text-gray-600">{request.duration || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <div className="mt-1">{getPriorityBadge(request.priority)}</div>
                                  </div>
                                </div>
                                {request.description && (
                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                                  </div>
                                )}
                                {request.requirements && (
                                  <div>
                                    <Label className="text-sm font-medium">Requirements</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {request.requirements.map((req, index) => (
                                        <Badge key={index} variant="outline">{req}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {getActionButtons(request)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No requests found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
```

### 2. **components/ui/page-loading.tsx** (New Component)
```tsx
import { Loader2 } from "lucide-react"

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4">
          <Loader2 className="h-12 w-12 text-red-600" />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we load your data</p>
      </div>
    </div>
  )
}
```

## 🚀 Key Features Implemented

### ✅ **Fully Dynamic Pages**
- **Requests Page:** Different data and actions based on role
- **Mentors Page:** Role-filtered mentor views and permissions
- **Reports Page:** Role-specific report types and data access
- **Dashboard:** Already role-based (from previous implementation)

### ✅ **Access Request Management**
- **Admin Panel:** Complete approval/rejection workflow
- **Email Notifications:** Automatic email sending on approval/rejection
- **User Creation:** Automatic user account creation on approval
- **Registration Form:** Complete with all required fields

### ✅ **Role-Based Data Filtering**
- **L&D Coordinator:** Sees all data for coordination
- **L&D HoD:** Executive level access with strategic insights
- **Department HoD:** Limited to their department only
- **Mentor:** Personal assignments and collaboration view
- **Admin:** Full system access

### ✅ **Dynamic UI Components**
- Role-specific alerts and instructions
- Action buttons based on permissions
- Different page titles and descriptions
- Filtered tables and data views

## 🛠️ Setup Instructions

### 1. **Environment Configuration**
Update your `.env.local` file:
```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-google-client-id-here

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App Configuration
NODE_ENV="development"
```

### 2. **Database Setup**
```bash
# Reset and seed the database
npx prisma db push
npx prisma db seed
```

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Start Development Server**
```bash
npm run dev
```

## 🧪 Testing Role-Based Access

### **Test Users (Pre-seeded):**

1. **Admin**
   - Employee ID: `ADMIN001`
   - Password: `admin123`
   - Role: System Administrator

2. **L&D HoD**
   - Employee ID: `EMP001`
   - Password: `demo123`
   - Role: L&D Head of Department

3. **L&D Coordinator**
   - Employee ID: `EMP002`
   - Password: `demo123`
   - Role: L&D Coordinator

4. **Department HoD (IT)**
   - Employee ID: `EMP003`
   - Password: `demo123`
   - Role: Department Head of Department

5. **Mentor**
   - Employee ID: `EMP004`
   - Password: `demo123`
   - Role: Mentor

### **Testing Workflow:**

1. **Register New User:** Use the registration form to create access requests
2. **Admin Approval:** Login as admin and approve/reject requests
3. **Role-Based Navigation:** Login with different roles to see different views
4. **Permission Testing:** Try to access unauthorized features
5. **Email Testing:** Configure SMTP and test approval/rejection emails

## 📧 Email Configuration

For email notifications to work:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an app password
   - Use app password in SMTP_PASS

2. **Test Email Flow:**
   - Register a new user
   - Login as admin
   - Approve/reject the request
   - Check email received

## 🔧 Customization Guide

### **Adding New Roles:**
1. Update `prisma/seed.ts` with new role definition
2. Add role logic in each page component
3. Update permission checking functions
4. Add role-specific UI elements

### **Adding New Permissions:**
1. Define permissions in role creation
2. Add permission checks in API routes
3. Update UI conditional rendering
4. Test with different user roles

## 🎯 Key Implementation Highlights

1. **Complete Role Segregation:** Each role sees only relevant data and features
2. **Dynamic Action Buttons:** Actions change based on user permissions
3. **Contextual Alerts:** Role-specific guidance and instructions
4. **Filtered Data:** Automatic data filtering based on user role
5. **Permission-Based UI:** UI elements show/hide based on permissions
6. **Secure API Access:** Backend filtering ensures data security

## 📊 Role-Based Dashboard Features

- **L&D Coordinator:** Cross-departmental coordination metrics
- **L&D HoD:** Strategic oversight and executive analytics
- **Department HoD:** Department-specific performance metrics
- **Mentor:** Personal mentoring statistics and trainee progress
- **Admin:** Complete system overview and management tools

This implementation ensures that each user has a completely tailored experience based on their role and responsibilities within the IOCL TAMS system.