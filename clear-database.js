const { PrismaClient } = require('@prisma/client')

async function clearDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🧹 Clearing all forwarded student details from database...')
    
    // Delete all forwarded student details
    const deletedCount = await prisma.forwardedStudentDetails.deleteMany({})
    console.log(`✅ Deleted ${deletedCount.count} forwarded student details records`)
    
    // Also clear related notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        type: "STUDENT_DETAILS_FORWARDED"
      }
    })
    console.log(`✅ Deleted ${deletedNotifications.count} related notifications`)
    
    console.log('✅ Database cleared successfully!')
    
  } catch (error) {
    console.error('❌ Error clearing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase() 