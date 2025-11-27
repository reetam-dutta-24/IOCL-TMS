const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTableStructure() {
  try {
    console.log('🔍 Checking forwarded_student_details table structure...')
    
    // Get table info using raw SQL
    const tableInfo = await prisma.$queryRaw`
      PRAGMA table_info(forwarded_student_details)
    `
    
    console.log('📋 Table structure:')
    tableInfo.forEach((column, index) => {
      console.log(`  ${index + 1}. ${column.name} (${column.type}) - Not null: ${column.notnull}, Default: ${column.dflt_value}`)
    })
    
    // Try to get all records
    const allRecords = await prisma.forwardedStudentDetails.findMany()
    console.log(`\n📊 Found ${allRecords.length} records`)
    
    allRecords.forEach((record, index) => {
      console.log(`\n📋 Record ${index + 1}:`)
      console.log(`  ID: ${record.id}`)
      console.log(`  Department: ${record.department}`)
      console.log(`  Status: ${record.status}`)
      console.log(`  Applications Count: ${record.applicationsCount}`)
      console.log(`  Forwarded By: ${record.forwardedBy}`)
      console.log(`  Forwarded To: ${record.forwardedTo}`)
      console.log(`  Created: ${record.createdAt}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTableStructure() 