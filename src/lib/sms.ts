import twilio from "twilio"

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

interface SMSOptions {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SMSOptions) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: to,
    })

    console.log("SMS sent successfully:", result.sid)
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("Error sending SMS:", error)
    throw error
  }
}

export function generateSMSMessage(type: string, data: any): string {
  switch (type) {
    case "NEW_REQUEST":
      return `IOCL: New internship request ${data.requestNumber} submitted for ${data.traineeName}. Please review.`
    case "REQUEST_APPROVED":
      return `IOCL: Your internship request ${data.requestNumber} has been approved. Check your email for details.`
    case "MENTOR_ASSIGNED":
      return `IOCL: Mentor assigned for request ${data.requestNumber}. Contact: ${data.mentorName}`
    default:
      return data.message
  }
}
