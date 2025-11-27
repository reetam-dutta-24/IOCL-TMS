const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixForwardedData() {
  try {
    console.log('🔧 Fixing forwarded student details...')
    
    // Find L&D HoD (User ID 1)
    const lndHod = await prisma.user.findFirst({
      where: {
        role: {
          name: 'L&D HoD'
        }
      }
    })
    
    console.log(`🎯 L&D HoD: ${lndHod.firstName} ${lndHod.lastName} (ID: ${lndHod.id})`)
    
    // Update the forwarded details to be sent to the correct L&D HoD
    const updateResult = await prisma.forwardedStudentDetails.updateMany({
      where: {
        forwardedTo: 1 // Current L&D HoD ID
      },
      data: {
        forwardedTo: lndHod.id,
        status: "PENDING_LND_REVIEW"
      }
    })
    
    console.log(`✅ Updated ${updateResult.count} forwarded details to L&D HoD`)
    
    // Check the current state
    const allDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
    
    console.log('📋 Current forwarded details:')
    allDetails.forEach(detail => {
      console.log(`  - ID: ${detail.id}, Department: ${detail.department}, Status: ${detail.status}, ForwardedTo: ${detail.forwardedTo}`)
    })
    
    // Also create a test notification for the L&D HoD
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Test - Student Details Forwarded",
        message: "Student applications forwarded by L&D Coordinator for review",
        userId: lndHod.id,
        priority: "HIGH"
      }
    })
    
    console.log(`✅ Created notification ID: ${notification.id} for L&D HoD`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixForwardedData() 