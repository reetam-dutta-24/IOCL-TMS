// test-forwarded-data.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkForwardedData() {
  try {
    console.log('🔍 Checking for forwarded student data...')
    
    // Check if there are any forwarded student details
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        forwardedToUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    
    console.log(`📊 Found ${forwardedDetails.length} forwarded student details`)
    
    if (forwardedDetails.length > 0) {
      forwardedDetails.forEach((detail, index) => {
        console.log(`\n--- Forwarded Detail ${index + 1} ---`)
        console.log(`ID: ${detail.id}`)
        console.log(`Department: ${detail.department}`)
        console.log(`Applications Count: ${detail.applicationsCount}`)
        console.log(`Status: ${detail.status}`)
        console.log(`Forwarded By: ${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName}`)
        console.log(`Forwarded To: ${detail.forwardedToUser.firstName} ${detail.forwardedToUser.lastName} (${detail.forwardedToUser.role.name})`)
        console.log(`Created At: ${detail.createdAt}`)
        
        // Parse applications JSON
        try {
          const applications = JSON.parse(detail.applications)
          console.log(`Applications: ${applications.length} students`)
          applications.forEach((app, i) => {
            console.log(`  ${i + 1}. ${app.firstName} ${app.lastName} - ${app.email}`)
          })
        } catch (error) {
          console.log(`Error parsing applications: ${error.message}`)
        }
      })
    } else {
      console.log('❌ No forwarded student data found in database')
      
      // Check if there are any L&D HoD users
      const lndHods = await prisma.user.findMany({
        where: {
          role: {
            name: "L&D HoD"
          }
        },
        include: {
          role: true,
          department: true
        }
      })
      
      console.log(`\n📋 Found ${lndHods.length} L&D HoD users:`)
      lndHods.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id}) - ${user.email}`)
      })
      
      // Check if there are any internship applications
      const applications = await prisma.internshipApplication.findMany({
        take: 5
      })
      
      console.log(`\n📋 Found ${applications.length} internship applications (showing first 5):`)
      applications.forEach(app => {
        console.log(`- ${app.firstName} ${app.lastName} - ${app.email} - Status: ${app.status}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking forwarded data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkForwardedData() 