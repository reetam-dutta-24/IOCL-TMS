const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTableName() {
  try {
    console.log('🔍 Checking table names in database...');
    
    // Get all table names
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table'
    `;
    
    console.log('📋 All tables:', tables);
    
    // Check if forwarded_student_details table exists
    const forwardedTable = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='forwarded_student_details'
    `;
    
    console.log('📋 Forwarded table:', forwardedTable);
    
    // Try to query the table directly
    const result = await prisma.$queryRaw`
      SELECT * FROM forwarded_student_details LIMIT 1
    `;
    
    console.log('📋 Direct query result:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableName(); 