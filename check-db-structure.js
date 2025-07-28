const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAndFixDatabase() {
  try {
    console.log('🔍 Checking database structure...')
    
    // Try to query the forwardedStudentDetails table
    const allDetails = await prisma.forwardedStudentDetails.findMany({
      take: 1
    })
    
    console.log('✅ Database connection successful')
    console.log(`📊 Found ${allDetails.length} forwarded student details`)
    
    // Check if we can query with status field
    try {
      const detailsWithStatus = await prisma.forwardedStudentDetails.findMany({
        where: {
          status: {
            in: ["PENDING_LND_REVIEW", "APPROVED_BY_LND", "REJECTED_BY_LND"]
          }
        }
      })
      console.log('✅ Status field exists and is working')
      console.log(`📊 Found ${detailsWithStatus.length} details with status`)
    } catch (statusError) {
      console.log('❌ Status field error:', statusError.message)
      
      // If status field doesn't exist, let's add it manually
      console.log('🔧 Adding status field to existing records...')
      
      // Update all existing records to have a default status
      const updateResult = await prisma.$executeRaw`
        UPDATE forwarded_student_details 
        SET status = 'PENDING_LND_REVIEW' 
        WHERE status IS NULL OR status = ''
      `
      
      console.log(`✅ Updated ${updateResult} records with default status`)
    }
    
    // Check the actual data
    const allDetailsWithData = await prisma.forwardedStudentDetails.findMany({
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
    allDetailsWithData.forEach(detail => {
      console.log(`  - ID: ${detail.id}, Department: ${detail.department}, Status: ${detail.status || 'NULL'}`)
    })
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndFixDatabase() 