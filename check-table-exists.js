const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTableExists() {
  try {
    console.log('🔍 Checking if forwarded_student_details table exists...');
    
    // Try to query the table directly
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='forwarded_student_details'`;
    console.log('Tables found:', result);
    
    // Try to count records
    const count = await prisma.forwardedStudentDetails.count();
    console.log('ForwardedStudentDetails count:', count);
    
    // Try to find one record
    const oneRecord = await prisma.forwardedStudentDetails.findFirst();
    console.log('First record:', oneRecord);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableExists(); 