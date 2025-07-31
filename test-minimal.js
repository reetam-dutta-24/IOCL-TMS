console.log('Starting minimal test...')

const { PrismaClient } = require('@prisma/client')
console.log('PrismaClient imported successfully')

const prisma = new PrismaClient()
console.log('PrismaClient instantiated')

async function test() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const userCount = await prisma.user.count()
    console.log(`✅ Database connection successful. User count: ${userCount}`)
    
    // Test forwardedStudentDetails table
    const forwardedCount = await prisma.forwardedStudentDetails.count()
    console.log(`✅ ForwardedStudentDetails count: ${forwardedCount}`)
    
    // Test simple query
    const records = await prisma.forwardedStudentDetails.findMany({
      take: 1
    })
    console.log(`✅ Simple query successful. Found ${records.length} records`)
    
    if (records.length > 0) {
      const record = records[0]
      console.log(`📋 Sample record:`)
      console.log(`  ID: ${record.id}`)
      console.log(`  Department: ${record.department}`)
      console.log(`  Status: ${record.status}`)
      console.log(`  ForwardedTo: ${record.forwardedTo}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('✅ Test completed')
  }
}

test() 