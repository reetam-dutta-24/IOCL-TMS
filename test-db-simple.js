const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test user count
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);
    
    // Test finding a specific user
    const user = await prisma.user.findUnique({
      where: { employeeId: 'EMP001' },
      include: { role: true, department: true }
    });
    
    if (user) {
      console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);
      console.log(`✅ Role: ${user.role.name}`);
      console.log(`✅ Department: ${user.department?.name || 'None'}`);
    } else {
      console.log('❌ User EMP001 not found');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 