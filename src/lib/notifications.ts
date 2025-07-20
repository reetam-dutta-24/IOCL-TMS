import { prisma } from "@/lib/prisma"
import { sendEmail, generateEmailTemplate } from "@/lib/email"
import { sendSMS, generateSMSMessage } from "@/lib/sms"

interface NotificationOptions {
  userId: number
  type: "EMAIL" | "SMS" | "IN_APP"
  subject?: string
  message: string
  priority?: "LOW" | "MEDIUM" | "HIGH"
  templateType?: string
  templateData?: any
}

export async function sendNotification({
  userId,
  type,
  subject,
  message,
  priority = "MEDIUM",
  templateType,
  templateData,
}: NotificationOptions) {
  try {
    // Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "IN_APP",
        title: subject || "Notification",
        message,
        priority,
      },
    })

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, firstName: true, lastName: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Send email notification
    if (type === "EMAIL" || type === "IN_APP") {
      let emailContent
      if (templateType && templateData) {
        emailContent = generateEmailTemplate(templateType, templateData)
      } else {
        emailContent = {
          subject: subject || "IOCL Notification",
          htmlBody: `<p>${message}</p>`,
        }
      }

      await sendEmail({
        to: [user.email],
        subject: emailContent.subject,
        htmlBody: emailContent.htmlBody,
      })
    }

    // Send SMS notification
    if (type === "SMS" && user.phone) {
      let smsMessage
      if (templateType && templateData) {
        smsMessage = generateSMSMessage(templateType, templateData)
      } else {
        smsMessage = message
      }

      await sendSMS({
        to: user.phone,
        message: smsMessage,
      })
    }

    return { success: true, notificationId: notification.id }
  } catch (error) {
    console.error("Error sending notification:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}
