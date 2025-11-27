import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { to, type, data } = await request.json()

    let subject = ""
    let htmlContent = ""

    if (type === 'ACCESS_APPROVED') {
      subject = "🎉 Access Approved - Welcome to IOCL TAMS!"
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .credentials-box { background: #fff; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .button { background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Access Request Approved!</h1>
              <p>Welcome to IOCL Trainee Approval & Management System</p>
            </div>
            
            <div class="content">
              <div class="success-badge">✅ REQUEST APPROVED</div>
              
              <p>Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
              
              <p>Congratulations! Your access request to the IOCL TAMS system has been approved. Your account has been successfully created and you can now access the system.</p>
              
              <div class="credentials-box">
                <h3>🔐 Your Login Credentials</h3>
                <p><strong>Employee ID:</strong> ${data.employeeId}</p>
                <p><strong>Temporary Password:</strong> <code>${data.defaultPassword}</code></p>
                <p><strong>Login URL:</strong> <a href="${process.env.NEXTAUTH_URL}/login">${process.env.NEXTAUTH_URL}/login</a></p>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 15px;">
                  <strong>⚠️ Important Security Notice:</strong>
                  <ul>
                    <li>Please change your password after first login</li>
                    <li>Keep your credentials secure and confidential</li>
                    <li>Never share your login details with others</li>
                  </ul>
                </div>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <strong>Assigned Role:</strong><br>
                  ${data.role}
                </div>
                <div class="info-item">
                  <strong>Department:</strong><br>
                  ${data.department}
                </div>
              </div>
              
              ${data.comment ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                  <strong>Admin Comment:</strong><br>
                  ${data.comment}
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/login" class="button">Access TAMS Dashboard</a>
              </div>
              
              <h3>🚀 Next Steps:</h3>
              <ol>
                <li>Click the login button above or visit our website</li>
                <li>Enter your Employee ID and temporary password</li>
                <li>Change your password when prompted</li>
                <li>Complete your profile setup</li>
                <li>Start using TAMS!</li>
              </ol>
              
              <h3>📞 Need Help?</h3>
              <p>If you have any questions or need assistance:</p>
              <ul>
                <li>Email: <a href="mailto:tams@iocl.co.in">tams@iocl.co.in</a></li>
                <li>Phone: +91-11-2338-9999</li>
                <li>Visit: <a href="${process.env.NEXTAUTH_URL}/help">Help Center</a></li>
              </ul>
            </div>
            
            <div class="footer">
              <p>This is an automated message from IOCL Trainee Approval & Management System</p>
              <p>© 2024 Indian Oil Corporation Limited. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    } else if (type === 'ACCESS_REJECTED') {
      subject = "❌ Access Request Update - IOCL TAMS"
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Request Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .rejected-badge { background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .button { background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Access Request Update</h1>
              <p>IOCL Trainee Approval & Management System</p>
            </div>
            
            <div class="content">
              <div class="rejected-badge">❌ REQUEST NOT APPROVED</div>
              
              <p>Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
              
              <p>Thank you for your interest in accessing the IOCL TAMS system. After careful review, we regret to inform you that your access request could not be approved at this time.</p>
              
              <div class="info-grid">
                <div class="info-item">
                  <strong>Employee ID:</strong><br>
                  ${data.employeeId}
                </div>
                <div class="info-item">
                  <strong>Requested Role:</strong><br>
                  ${data.role}
                </div>
              </div>
              
              ${data.comment ? `
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <strong>📝 Admin Comment:</strong><br>
                  <p style="margin-top: 10px;">${data.comment}</p>
                </div>
              ` : ''}
              
              <h3>🔄 What You Can Do:</h3>
              <ul>
                <li><strong>Review Requirements:</strong> Ensure you meet all eligibility criteria</li>
                <li><strong>Contact Support:</strong> Get clarification on the requirements</li>
                <li><strong>Reapply:</strong> You may submit a new request after addressing any issues</li>
                <li><strong>Speak to Your Manager:</strong> Discuss with your supervisor if needed</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/register" class="button">Submit New Request</a>
              </div>
              
              <h3>📞 Need Assistance?</h3>
              <p>If you have questions about this decision or need help with your next steps:</p>
              <ul>
                <li>Email: <a href="mailto:tams@iocl.co.in">tams@iocl.co.in</a></li>
                <li>Phone: +91-11-2338-9999</li>
                <li>Visit: <a href="${process.env.NEXTAUTH_URL}/contact">Contact Us</a></li>
              </ul>
              
              <p>We appreciate your understanding and encourage you to reach out if you have any questions.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from IOCL Trainee Approval & Management System</p>
              <p>© 2024 Indian Oil Corporation Limited. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"IOCL TAMS" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    })

    console.log("Email sent: %s", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully",
      messageId: info.messageId
    })

  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send email notification",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}