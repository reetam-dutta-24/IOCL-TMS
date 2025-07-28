const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentData() {
  try {
    console.log('🔍 Checking current database data...\n');
    
    // Check users
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true
      }
    });
    
    console.log(`👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   ${user.id}: ${user.firstName} ${user.lastName} - ${user.role.name} (${user.department?.name || 'No dept'})`);
    });
    
    // Check notifications
    const notifications = await prisma.notification.findMany();
    console.log(`\n📧 Found ${notifications.length} notifications`);
    
    // Check forwarded student details
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: {
          select: { firstName: true, lastName: true }
        },
        forwardedToUser: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    
    console.log(`\n📋 Found ${forwardedDetails.length} forwarded student details:`);
    forwardedDetails.forEach(detail => {
      console.log(`   ID: ${detail.id}`);
      console.log(`   Department: ${detail.department}`);
      console.log(`   Applications Count: ${detail.applicationsCount}`);
      console.log(`   Forwarded By: ${detail.forwardedByUser?.firstName} ${detail.forwardedByUser?.lastName} (ID: ${detail.forwardedBy})`);
      console.log(`   Forwarded To: ${detail.forwardedToUser?.firstName} ${detail.forwardedToUser?.lastName} (ID: ${detail.forwardedTo})`);
      console.log(`   Notification ID: ${detail.notificationId}`);
      console.log(`   Notification Read: ${detail.notification.isRead}`);
      console.log('   ---');
    });
    
    // Test the API query
    console.log('\n🧪 Testing API query for user ID 3:');
    const testQuery = await prisma.forwardedStudentDetails.findMany({
      where: { forwardedTo: 3 },
      include: { notification: true }
    });
    
    console.log(`   Found ${testQuery.length} records for user 3`);
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentData(); 