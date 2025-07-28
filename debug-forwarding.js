const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugForwarding() {
  try {
    console.log('🔍 Debugging forwarding issue...\n');
    
    // Check if forwarded details exist
    const forwardedDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        forwardedToUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    console.log(`📊 Found ${forwardedDetails.length} forwarded details records`);
    
    if (forwardedDetails.length > 0) {
      forwardedDetails.forEach((detail, index) => {
        console.log(`\n${index + 1}. Forwarded Details Record:`);
        console.log(`   ID: ${detail.id}`);
        console.log(`   Department: ${detail.department}`);
        console.log(`   Applications Count: ${detail.applicationsCount}`);
        console.log(`   Forwarded By: ${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName} (ID: ${detail.forwardedBy})`);
        console.log(`   Forwarded To: ${detail.forwardedToUser.firstName} ${detail.forwardedToUser.lastName} (ID: ${detail.forwardedTo})`);
        console.log(`   Notification ID: ${detail.notificationId}`);
        console.log(`   Notification Read: ${detail.notification.isRead}`);
      });
    }
    
    // Check Department HoD user
    const deptHod = await prisma.user.findFirst({
      where: {
        role: { name: 'Department HoD' },
        isActive: true
      },
      include: {
        role: true,
        department: true
      }
    });
    
    console.log(`\n👤 Department HoD:`);
    console.log(`   Name: ${deptHod.firstName} ${deptHod.lastName}`);
    console.log(`   ID: ${deptHod.id}`);
    console.log(`   Department: ${deptHod.department?.name || 'Not assigned'}`);
    
    // Test the API endpoint logic
    console.log('\n🔍 Testing API endpoint logic...');
    
    const testUserId = deptHod.id;
    console.log(`   Testing for user ID: ${testUserId}`);
    
    const apiResult = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: testUserId
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
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    console.log(`   API query found ${apiResult.length} records for user ${testUserId}`);
    
    if (apiResult.length > 0) {
      const studentDetails = apiResult.map(detail => ({
        id: detail.id,
        notificationId: detail.notificationId,
        department: detail.department,
        applicationsCount: detail.applicationsCount,
        applications: JSON.parse(detail.applications),
        forwardedBy: `${detail.forwardedByUser.firstName} ${detail.forwardedByUser.lastName}`,
        forwardedByEmail: detail.forwardedByUser.email,
        receivedAt: detail.createdAt,
        status: detail.notification.isRead ? "READ" : "UNREAD"
      }));
      
      console.log('   ✅ Transformed data:');
      studentDetails.forEach((detail, index) => {
        console.log(`     ${index + 1}. ${detail.department} - ${detail.applicationsCount} applications`);
        console.log(`        Forwarded by: ${detail.forwardedBy}`);
        console.log(`        Status: ${detail.status}`);
      });
    } else {
      console.log('   ❌ No records found for this user');
    }
    
  } catch (error) {
    console.error('❌ Error debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugForwarding(); 