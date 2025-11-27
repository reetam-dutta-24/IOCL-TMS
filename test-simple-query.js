const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSimpleQuery() {
  try {
    console.log('🧪 Testing simple query without status filter...')
    
    // Test 1: Query without status filter
    const allRecords = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: 1
      }
    })
    
    console.log(`✅ Found ${allRecords.length} records without status filter`)
    
    // Test 2: Query with status filter
    try {
      const statusRecords = await prisma.forwardedStudentDetails.findMany({
        where: {
          forwardedTo: 1,
          status: {
            in: ["PENDING_LND_REVIEW", "APPROVED_BY_LND", "REJECTED_BY_LND"]
          }
        }
      })
      console.log(`✅ Found ${statusRecords.length} records with status filter`)
    } catch (error) {
      console.error('❌ Error with status filter:', error.message)
    }
    
    // Test 3: Check if status column exists
    try {
      const rawQuery = await prisma.$queryRaw`
        SELECT id, department, status FROM forwarded_student_details WHERE forwardedTo = 1
      `
      console.log(`✅ Raw query successful, found ${rawQuery.length} records`)
      rawQuery.forEach((record, index) => {
        console.log(`  Record ${index + 1}: ID=${record.id}, Department=${record.department}, Status=${record.status}`)
      })
    } catch (error) {
      console.error('❌ Error with raw query:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Error in simple query:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSimpleQuery() 