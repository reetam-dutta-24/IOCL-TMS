const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database for new data...');
    
    const accessRequests = await prisma.accessRequest.findMany({
      include: {
        requestedRole: true,
        department: true
      },
      orderBy: {
        requestedAt: 'desc'
      }
    });
    
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const internshipRequests = await prisma.internshipRequest.findMany({
      include: {
        submitter: true,
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 Database Summary:`);
    console.log(`- Access Requests: ${accessRequests.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Internship Requests: ${internshipRequests.length}`);
    
    if (accessRequests.length > 0) {
      console.log('\n📝 Recent Access Requests:');
      accessRequests.slice(0, 5).forEach(req => {
        console.log(`- ${req.firstName} ${req.lastName} (${req.employeeId})`);
        console.log(`  Email: ${req.email}`);
        console.log(`  Role: ${req.requestedRole?.name}`);
        console.log(`  Department: ${req.department?.name || 'None'}`);
        console.log(`  Status: ${req.status}`);
        console.log(`  Requested: ${req.requestedAt}`);
        console.log('');
      });
    }
    
    if (users.length > 0) {
      console.log('\n👥 Recent Users:');
      users.slice(0, 5).forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.employeeId})`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role?.name}`);
        console.log(`  Department: ${user.department?.name || 'None'}`);
        console.log(`  Active: ${user.isActive}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    if (internshipRequests.length > 0) {
      console.log('\n🎓 Recent Internship Requests:');
      internshipRequests.slice(0, 3).forEach(req => {
        console.log(`- ${req.traineeName} (${req.requestNumber})`);
        console.log(`  Course: ${req.courseDetails}`);
        console.log(`  Department: ${req.department?.name || 'None'}`);
        console.log(`  Status: ${req.status}`);
        console.log(`  Submitted by: ${req.submitter?.firstName} ${req.submitter?.lastName}`);
        console.log(`  Created: ${req.createdAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 