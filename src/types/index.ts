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
  // Trainee-specific fields
  institutionName?: string
  courseDetails?: string
  expectedGraduation?: Date
  currentSemester?: string
  cgpa?: number
  skills?: string[]
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
  traineeId?: number
  institutionName: string
  courseDetails?: string
  internshipDuration: number
  preferredDepartment?: number
  requestDescription?: string
  status: RequestStatus
  priority: Priority
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
  submitter: User
  trainee?: User
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

// New Trainee-specific interfaces
export interface TraineeProgress {
  id: number
  traineeId: number
  weekNumber: number
  overallProgress: number
  technicalSkillRating?: number
  behavioralRating?: number
  attendancePercentage: number
  goalsAchieved: string[]
  challengesFaced?: string
  learningHighlights?: string
  mentorFeedback?: string
  selfAssessmentScore?: number
  nextWeekGoals: string[]
  submittedAt: Date
  mentorReviewedAt?: Date
  trainee: User
}

export interface TraineeGoal {
  id: number
  traineeId: number
  goalTitle: string
  goalDescription?: string
  goalType: GoalType
  priority: Priority
  targetDate: Date
  status: GoalStatus
  progressPercent: number
  achievedAt?: Date
  createdAt: Date
  updatedAt: Date
  trainee: User
}

export interface TraineeSubmission {
  id: number
  traineeId: number
  submissionType: SubmissionType
  title: string
  description?: string
  content?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  submittedAt: Date
  reviewedAt?: Date
  status: SubmissionStatus
  mentorFeedback?: string
  grade?: string
  trainee: User
}

export interface TraineeMessage {
  id: number
  senderId: number
  receiverId: number
  subject?: string
  message: string
  isRead: boolean
  sentAt: Date
  readAt?: Date
  sender: User
  receiver: User
}

export interface LearningResource {
  id: number
  title: string
  description?: string
  resourceType: ResourceType
  content?: string
  filePath?: string
  fileName?: string
  departmentId?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  department?: Department
}

export interface TraineeDashboardStats {
  overallProgress: number
  technicalSkillRating: number
  behavioralRating: number
  attendancePercentage: number
  completedGoals: number
  totalGoals: number
  pendingSubmissions: number
  unreadMessages: number
  daysRemaining: number
  weeksCompleted: number
}

export enum RequestStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  MENTOR_ASSIGNED = "MENTOR_ASSIGNED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
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
  PUSH = "PUSH",
}

export enum GoalType {
  LEARNING = "LEARNING",
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  PROJECT = "PROJECT",
  PERSONAL = "PERSONAL",
}

export enum GoalStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
}

export enum SubmissionType {
  WEEKLY_REPORT = "WEEKLY_REPORT",
  PROJECT_DELIVERABLE = "PROJECT_DELIVERABLE",
  ASSIGNMENT = "ASSIGNMENT",
  PRESENTATION = "PRESENTATION",
  FINAL_REPORT = "FINAL_REPORT",
  OTHER = "OTHER",
}

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  NEEDS_REVISION = "NEEDS_REVISION",
  REJECTED = "REJECTED",
}

export enum ResourceType {
  DOCUMENT = "DOCUMENT",
  VIDEO = "VIDEO",
  LINK = "LINK",
  PRESENTATION = "PRESENTATION",
  TUTORIAL = "TUTORIAL",
}
