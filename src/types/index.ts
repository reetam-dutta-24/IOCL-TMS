export interface User {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  departmentId?: number
  roleId: number
  isActive: boolean
  role: Role
  department?: Department
}

export interface Role {
  id: number
  name: string
  description?: string
  permissions?: any
}

export interface Department {
  id: number
  name: string
  code: string
  hodUserId?: number
  isActive: boolean
}

export interface InternshipRequest {
  id: number
  requestNumber: string
  requestedBy: number
  traineeName: string
  traineeEmail?: string
  traineePhone?: string
  institutionName: string
  courseDetails?: string
  internshipDuration: number
  preferredDepartment?: number
  requestDescription?: string
  status: RequestStatus
  priority: Priority
  createdAt: Date
  updatedAt: Date
  submitter: User
  department?: Department
  mentorAssignments: MentorAssignment[]
}

export interface MentorAssignment {
  id: number
  requestId: number
  mentorId: number
  assignedBy: number
  departmentId?: number
  assignmentDate: Date
  startDate?: Date
  endDate?: Date
  assignmentStatus: AssignmentStatus
  assignmentNotes?: string
  mentor: User
  request: InternshipRequest
}

export interface Notification {
  id: number
  userId: number
  notificationType: NotificationType
  subject?: string
  message: string
  isRead: boolean
  isSent: boolean
  priority: Priority
  createdAt: Date
  sentAt?: Date
  readAt?: Date
}

export enum RequestStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  MENTOR_ASSIGNED = "MENTOR_ASSIGNED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum AssignmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS",
  IN_APP = "IN_APP",
}
