const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSimpleForwarded() {
  try {
    console.log('🧪 Simple test of forwarded student details...')
    
    // Test 1: Basic count
    const count = await prisma.forwardedStudentDetails.count()
    console.log(`📊 Total records: ${count}`)
    
    // Test 2: Simple findMany without complex where clause
    const allRecords = await prisma.forwardedStudentDetails.findMany({
      take: 1
    })
    console.log(`📋 First record:`, allRecords[0])
    
    // Test 3: Test the exact where clause that's failing
    const testRecords = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: 1
      }
    })
    console.log(`📋 Records for user 1: ${testRecords.length}`)
    
    // Test 4: Test with status filter
    const statusRecords = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: 1,
        status: "PENDING_LND_REVIEW"
      }
    })
    console.log(`📋 Records with status filter: ${statusRecords.length}`)
    
    // Test 5: Test the full query with include
    const fullRecords = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: 1,
        status: {
          in: ["PENDING_LND_REVIEW", "APPROVED_BY_LND", "REJECTED_BY_LND"]
        }
      },
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
    console.log(`📋 Full query records: ${fullRecords.length}`)
    
    if (fullRecords.length > 0) {
      console.log('✅ Full query successful!')
      console.log('Sample record:', {
        id: fullRecords[0].id,
        department: fullRecords[0].department,
        status: fullRecords[0].status,
        forwardedBy: fullRecords[0].forwardedByUser?.firstName
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.error('Error details:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testSimpleForwarded() 