import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { type, to, userName, employeeId, password, reason } = await request.json()

    // Check if SMTP is properly configured
    const isSmtpConfigured = process.env.SMTP_USER && 
                            process.env.SMTP_PASS && 
                            process.env.SMTP_USER !== "your-email@gmail.com"

    if (!isSmtpConfigured) {
      console.log("📧 SMTP NOT CONFIGURED - Email would be sent to:", to)
      console.log("📧 Email Type:", type)
      console.log("📧 Email Content would be:")
      
      if (type === "access_approved") {
        console.log(`
        ✅ ACCESS APPROVED EMAIL:
        To: ${to}
        Subject: Welcome to IOCL TAMS - Account Approved
        
        Dear ${userName},
        
        Great news! Your access request for the IOCL Trainee Management System has been approved.
        
        Your login credentials:
        Employee ID: ${employeeId}
        Password: ${password}
        
        You can now log in at: http://localhost:3000/login
        
        Welcome to IOCL TAMS!
        `)
      } else {
        console.log(`
        ❌ ACCESS REJECTED EMAIL:
        To: ${to}
        Subject: IOCL TAMS Access Request Update
        
        Dear ${userName},
        
        Thank you for your interest in the IOCL Trainee Management System.
        
        Unfortunately, your access request has been declined.
        Reason: ${reason || "Administrative decision"}
        
        Best regards,
        IOCL TAMS Team
        `)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Email content logged to console (SMTP not configured for localhost)" 
      })
    }

    // Create transporter with environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    let mailOptions
    
    if (type === "access_approved") {
      mailOptions = {
        from: `"IOCL TAMS" <${process.env.SMTP_USER}>`,
        to: to,
        subject: "Welcome to IOCL TAMS - Account Approved",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .credentials { background: #e5f7ff; padding: 20px; margin: 20px 0; border-left: 4px solid #0066cc; border-radius: 5px; }
              .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to IOCL TAMS!</h1>
                <p>Your access request has been approved</p>
              </div>
              <div class="content">
                <p>Dear <strong>${userName}</strong>,</p>
                
                <p>Great news! Your access request for the <strong>IOCL Trainee Management System</strong> has been approved by our administrators.</p>
                
                <div class="credentials">
                  <h3>🔑 Your Login Credentials:</h3>
                  <p><strong>Employee ID:</strong> ${employeeId}</p>
                  <p><strong>Password:</strong> ${password}</p>
                </div>
                
                <p>You can now access the system using these credentials:</p>
                <a href="http://localhost:3000/login" class="button">Login to IOCL TAMS</a>
                
                <p>For security reasons, we recommend changing your password after your first login.</p>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                  <p>Best regards,<br><strong>IOCL TAMS Administration Team</strong></p>
                  <p><em>This is an automated message. Please do not reply to this email.</em></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      }
    } else if (type === "access_rejected") {
      mailOptions = {
        from: `"IOCL TAMS" <${process.env.SMTP_USER}>`,
        to: to,
        subject: "IOCL TAMS Access Request Update",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .reason-box { background: #fff3cd; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107; border-radius: 5px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>IOCL TAMS Access Request</h1>
                <p>Update on your application</p>
              </div>
              <div class="content">
                <p>Dear <strong>${userName}</strong>,</p>
                
                <p>Thank you for your interest in the <strong>IOCL Trainee Management System</strong>.</p>
                
                <p>After careful review, we regret to inform you that your access request has not been approved at this time.</p>
                
                ${reason ? `
                <div class="reason-box">
                  <h3>📋 Reason:</h3>
                  <p>${reason}</p>
                </div>
                ` : ''}
                
                <p>If you believe this decision was made in error or if you have additional information to support your request, please feel free to contact our administrators.</p>
                
                <p>We appreciate your understanding and interest in our system.</p>
                
                <div class="footer">
                  <p>Best regards,<br><strong>IOCL TAMS Administration Team</strong></p>
                  <p><em>This is an automated message. Please do not reply to this email.</em></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      }
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: info.messageId 
    })

  } catch (error) {
    console.error("❌ Email sending failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to send email",
      details: error.message 
    }, { status: 500 })
  }
}