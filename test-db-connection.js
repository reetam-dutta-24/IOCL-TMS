const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDBConnection() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Check if forwarded_student_details table exists
    try {
      const count = await prisma.forwardedStudentDetails.count();
      console.log(`✅ ForwardedStudentDetails table exists with ${count} records`);
    } catch (error) {
      console.log('❌ ForwardedStudentDetails table error:', error.message);
    }
    
    // Test 3: Try to query for user 1
    try {
      const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
        where: {
          forwardedTo: 1
        },
        include: {
          forwardedByUser: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      
      console.log(`✅ Query successful: Found ${forwardedDetails.length} records for user 1`);
      
      if (forwardedDetails.length > 0) {
        const sample = forwardedDetails[0];
        console.log('📋 Sample record:');
        console.log('  ID:', sample.id);
        console.log('  Department:', sample.department);
        console.log('  Status:', sample.status);
        console.log('  Forwarded By:', sample.forwardedByUser?.firstName, sample.forwardedByUser?.lastName);
      }
    } catch (error) {
      console.log('❌ Query error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDBConnection(); 