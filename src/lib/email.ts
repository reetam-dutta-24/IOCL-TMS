import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

interface EmailOptions {
  to: string[]
  subject: string
  htmlBody: string
  textBody?: string
}

export async function sendEmail({ to, subject, htmlBody, textBody }: EmailOptions) {
  try {
    const command = new SendEmailCommand({
      Source: process.env.FROM_EMAIL || "noreply@iocl.co.in",
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: textBody
            ? {
                Data: textBody,
                Charset: "UTF-8",
              }
            : undefined,
        },
      },
    })

    const result = await sesClient.send(command)
    console.log("Email sent successfully:", result.MessageId)
    return { success: true, messageId: result.MessageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export function generateEmailTemplate(type: string, data: any): { subject: string; htmlBody: string } {
  switch (type) {
    case "NEW_REQUEST":
      return {
        subject: `New Internship Request - ${data.requestNumber}`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Internship Request Submitted</h2>
            <p>A new internship request has been submitted with the following details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Request Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.requestNumber}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Trainee Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.traineeName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Institution:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.institutionName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Duration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.internshipDuration} days</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Priority:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.priority}</td></tr>
            </table>
            <p>Please review and take appropriate action.</p>
            <p style="color: #666; font-size: 12px;">This is an automated message from IOCL Trainee Management System.</p>
          </div>
        `,
      }
    case "REQUEST_APPROVED":
      return {
        subject: `Internship Request Approved - ${data.requestNumber}`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Internship Request Approved</h2>
            <p>Your internship request has been approved!</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Request Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.requestNumber}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Trainee Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.traineeName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Approved By:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.approverName}</td></tr>
            </table>
            <p>Next steps will be communicated shortly.</p>
            <p style="color: #666; font-size: 12px;">This is an automated message from IOCL Trainee Management System.</p>
          </div>
        `,
      }
    default:
      return {
        subject: "IOCL Notification",
        htmlBody: `<p>${data.message}</p>`,
      }
  }
}
