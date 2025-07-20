export interface User {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: "L&D HoD" | "L&D Coordinator" | "Department HoD" | "Mentor"
  department: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface InternshipRequest {
  id: string
  requestNumber: string
  traineeName: string
  traineeEmail?: string
  traineePhone?: string
  institutionName: string
  courseDetails?: string
  internshipDuration: number
  preferredDepartment: string
  requestDescription?: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MENTOR_ASSIGNED"
  requestedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface MentorAssignment {
  id: string
  requestId: string
  mentorId: string
  assignedBy: string
  assignedAt: Date
  status: "ACTIVE" | "COMPLETED" | "CANCELLED"
  startDate?: Date
  endDate?: Date
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  type: "EMAIL" | "SMS" | "SYSTEM"
  subject: string
  message: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  isRead: boolean
  createdAt: Date
}

// Mock Users with demo credentials
export const mockUsers: User[] = [
  {
    id: "1",
    employeeId: "IOCL001",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@iocl.co.in",
    password: "demo123",
    role: "L&D HoD",
    department: "Learning & Development",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    employeeId: "IOCL002",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@iocl.co.in",
    password: "demo123",
    role: "L&D Coordinator",
    department: "Learning & Development",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    employeeId: "IOCL003",
    firstName: "Amit",
    lastName: "Singh",
    email: "amit.singh@iocl.co.in",
    password: "demo123",
    role: "Department HoD",
    department: "Refinery Operations",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    employeeId: "IOCL004",
    firstName: "Sunita",
    lastName: "Patel",
    email: "sunita.patel@iocl.co.in",
    password: "demo123",
    role: "Mentor",
    department: "Process Engineering",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    employeeId: "IOCL005",
    firstName: "Vikram",
    lastName: "Gupta",
    email: "vikram.gupta@iocl.co.in",
    password: "demo123",
    role: "Mentor",
    department: "Safety & Environment",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
]

// Mock Internship Requests
export const mockRequests: InternshipRequest[] = [
  {
    id: "1",
    requestNumber: "REQ001",
    traineeName: "Arjun Mehta",
    traineeEmail: "arjun.mehta@student.edu",
    traineePhone: "+91-9876543210",
    institutionName: "IIT Delhi",
    courseDetails: "B.Tech Chemical Engineering",
    internshipDuration: 60,
    preferredDepartment: "Process Engineering",
    requestDescription: "Seeking internship in process optimization and plant operations",
    priority: "HIGH",
    status: "SUBMITTED",
    requestedBy: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    requestNumber: "REQ002",
    traineeName: "Kavya Reddy",
    traineeEmail: "kavya.reddy@student.edu",
    institutionName: "NIT Warangal",
    courseDetails: "M.Tech Environmental Engineering",
    internshipDuration: 45,
    preferredDepartment: "Safety & Environment",
    requestDescription: "Research on environmental impact assessment",
    priority: "MEDIUM",
    status: "APPROVED",
    requestedBy: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "3",
    requestNumber: "REQ003",
    traineeName: "Rohit Sharma",
    traineeEmail: "rohit.sharma@student.edu",
    institutionName: "BITS Pilani",
    courseDetails: "B.Tech Mechanical Engineering",
    internshipDuration: 30,
    preferredDepartment: "Refinery Operations",
    requestDescription: "Hands-on experience in refinery equipment maintenance",
    priority: "MEDIUM",
    status: "MENTOR_ASSIGNED",
    requestedBy: "2",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14"),
  },
]

// Mock Mentor Assignments
export const mockMentorAssignments: MentorAssignment[] = [
  {
    id: "1",
    requestId: "3",
    mentorId: "4",
    assignedBy: "2",
    assignedAt: new Date("2024-01-14"),
    status: "ACTIVE",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-03-02"),
    notes: "Focus on equipment maintenance procedures",
  },
  {
    id: "2",
    requestId: "2",
    mentorId: "5",
    assignedBy: "1",
    assignedAt: new Date("2024-01-12"),
    status: "ACTIVE",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-03-05"),
    notes: "Environmental compliance and safety protocols",
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "SYSTEM",
    subject: "New Internship Request",
    message: "A new internship request REQ001 has been submitted and requires review.",
    priority: "HIGH",
    isRead: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    userId: "4",
    type: "EMAIL",
    subject: "Mentor Assignment",
    message: "You have been assigned as a mentor for Rohit Sharma from BITS Pilani.",
    priority: "MEDIUM",
    isRead: false,
    createdAt: new Date("2024-01-14"),
  },
]

// Helper functions
export function getUserByEmployeeId(employeeId: string): User | undefined {
  return mockUsers.find((user) => user.employeeId === employeeId)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

// Role-based permissions
export function hasPermission(role: string, action: string): boolean {
  const permissions = {
    "L&D HoD": ["create_request", "approve_request", "assign_mentor", "view_all", "manage_users"],
    "L&D Coordinator": ["create_request", "approve_request", "assign_mentor", "view_all"],
    "Department HoD": ["create_request", "view_department"],
    Mentor: ["view_assigned"],
  }

  return permissions[role as keyof typeof permissions]?.includes(action) || false
}

export const departments = [
  "Process Engineering",
  "Refinery Operations",
  "Safety & Environment",
  "Quality Control",
  "Maintenance",
  "Research & Development",
]
