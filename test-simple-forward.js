const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSimpleForward() {
  try {
    console.log('🧪 Testing simple forward logic...\n');

    // Test 1: Check if we can find L&D HoD
    console.log('1. Finding L&D HoD...');
    const lndHod = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D HoD"
        },
        isActive: true
      }
    });

    if (!lndHod) {
      console.log('❌ No L&D HoD found');
      return;
    }
    console.log(`✅ Found L&D HoD: ${lndHod.firstName} ${lndHod.lastName} (ID: ${lndHod.id})`);

    // Test 2: Check if we can find L&D Coordinator
    console.log('\n2. Finding L&D Coordinator...');
    const coordinator = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D Coordinator"
        },
        isActive: true
      }
    });

    if (!coordinator) {
      console.log('❌ No L&D Coordinator found');
      return;
    }
    console.log(`✅ Found L&D Coordinator: ${coordinator.firstName} ${coordinator.lastName} (ID: ${coordinator.id})`);

    // Test 3: Try to create a notification
    console.log('\n3. Creating notification...');
    try {
      const notification = await prisma.notification.create({
        data: {
          type: "STUDENT_DETAILS_FORWARDED",
          title: "Test Notification",
          message: "Test message",
          userId: lndHod.id,
          priority: "HIGH"
        }
      });
      console.log(`✅ Created notification: ${notification.id}`);
    } catch (error) {
      console.log('❌ Failed to create notification:', error.message);
      return;
    }

    // Test 4: Try to create forwarded details
    console.log('\n4. Creating forwarded details...');
    try {
      const testApplications = [
        {
          id: 1,
          firstName: "Test",
          lastName: "Student",
          email: "test@example.com"
        }
      ];

      const forwardedDetails = await prisma.forwardedStudentDetails.create({
        data: {
          notificationId: 1, // Use existing notification
          department: "Computer Science",
          applicationsCount: testApplications.length,
          applications: JSON.stringify(testApplications),
          forwardedBy: coordinator.id,
          forwardedTo: lndHod.id,
          status: "PENDING_LND_REVIEW"
        }
      });
      console.log(`✅ Created forwarded details: ${forwardedDetails.id}`);
    } catch (error) {
      console.log('❌ Failed to create forwarded details:', error.message);
      return;
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleForward(); 