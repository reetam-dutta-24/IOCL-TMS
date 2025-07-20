import { Queue, Worker } from "bullmq"
import Redis from "ioredis"
import { sendNotification } from "@/lib/notifications"
import { prisma } from "@/lib/prisma"

const redis = new Redis(process.env.REDIS_URL!)

// Create notification queue
export const notificationQueue = new Queue("notifications", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
})

// Create reminder queue
export const reminderQueue = new Queue("reminders", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
})

// Notification worker
const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { userId, type, subject, message, priority } = job.data

    try {
      await sendNotification({
        userId,
        type,
        subject,
        message,
        priority,
      })

      console.log(`Notification sent to user ${userId}`)
    } catch (error) {
      console.error("Failed to send notification:", error)
      throw error
    }
  },
  { connection: redis },
)

// Reminder worker
const reminderWorker = new Worker(
  "reminders",
  async (job) => {
    const { type, data } = job.data

    try {
      switch (type) {
        case "pending_approval":
          await sendPendingApprovalReminders()
          break
        case "overdue_reports":
          await sendOverdueReportReminders()
          break
        case "internship_ending":
          await sendInternshipEndingReminders()
          break
        default:
          console.log(`Unknown reminder type: ${type}`)
      }
    } catch (error) {
      console.error("Failed to process reminder:", error)
      throw error
    }
  },
  { connection: redis },
)

async function sendPendingApprovalReminders() {
  const pendingApprovals = await prisma.approval.findMany({
    where: {
      approvalStatus: "PENDING",
      createdAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      },
    },
    include: {
      request: true,
      approver: true,
    },
  })

  for (const approval of pendingApprovals) {
    await notificationQueue.add("send-notification", {
      userId: approval.approverId,
      type: "EMAIL",
      subject: `Reminder: Pending Approval - ${approval.request.requestNumber}`,
      message: `You have a pending approval for internship request ${approval.request.requestNumber}. Please review and take action.`,
      priority: "MEDIUM",
    })
  }
}

async function sendOverdueReportReminders() {
  const overdueAssignments = await prisma.mentorAssignment.findMany({
    where: {
      assignmentStatus: "ACTIVE",
      // Add logic to check for overdue reports
    },
    include: {
      mentor: true,
      request: true,
    },
  })

  for (const assignment of overdueAssignments) {
    await notificationQueue.add("send-notification", {
      userId: assignment.mentorId,
      type: "EMAIL",
      subject: `Reminder: Report Due - ${assignment.request.traineeName}`,
      message: `A progress report is due for your mentee ${assignment.request.traineeName}. Please submit the report at your earliest convenience.`,
      priority: "HIGH",
    })
  }
}

async function sendInternshipEndingReminders() {
  const endingInternships = await prisma.mentorAssignment.findMany({
    where: {
      assignmentStatus: "ACTIVE",
      endDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
    },
    include: {
      mentor: true,
      request: true,
    },
  })

  for (const assignment of endingInternships) {
    await notificationQueue.add("send-notification", {
      userId: assignment.mentorId,
      type: "EMAIL",
      subject: `Internship Ending Soon - ${assignment.request.traineeName}`,
      message: `The internship for ${assignment.request.traineeName} is ending on ${assignment.endDate?.toDateString()}. Please prepare the final evaluation and reports.`,
      priority: "HIGH",
    })
  }
}

// Schedule recurring reminders
export function scheduleReminders() {
  // Daily reminder for pending approvals
  reminderQueue.add(
    "pending-approval-reminder",
    { type: "pending_approval" },
    {
      repeat: { pattern: "0 9 * * *" }, // Daily at 9 AM
    },
  )

  // Weekly reminder for overdue reports
  reminderQueue.add(
    "overdue-reports-reminder",
    { type: "overdue_reports" },
    {
      repeat: { pattern: "0 10 * * 1" }, // Monday at 10 AM
    },
  )

  // Daily reminder for ending internships
  reminderQueue.add(
    "internship-ending-reminder",
    { type: "internship_ending" },
    {
      repeat: { pattern: "0 8 * * *" }, // Daily at 8 AM
    },
  )
}

// Export workers for cleanup
export { notificationWorker, reminderWorker }
