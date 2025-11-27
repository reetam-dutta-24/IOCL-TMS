const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDetailedAPI() {
  try {
    console.log('🧪 Testing detailed API logic...\n');

    // Test the exact logic from the API route
    const testData = {
      department: "Computer Science",
      applications: [
        {
          id: 1,
          firstName: "Test",
          lastName: "Student",
          email: "test@example.com",
          institutionName: "Test University",
          courseName: "Computer Science",
          preferredDepartment: "Computer Science",
          internshipDuration: 8,
          status: "APPROVED"
        }
      ]
    };

    console.log('📤 Test data:', JSON.stringify(testData, null, 2));

    const { department, applications } = testData;

    console.log(`🔍 Forwarding ${applications.length} applications to LND HoD for ${department}`);

    if (!department || !applications || applications.length === 0) {
      console.log('❌ Missing required fields');
      return;
    }

    // Find the LND HoD user
    console.log('1. Finding LND HoD...');
    const lndHodUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D HoD"
        },
        isActive: true
      }
    });

    if (!lndHodUser) {
      console.log('❌ No active L&D HoD found');
      return;
    }

    console.log(`✅ Found LND HoD: ${lndHodUser.firstName} ${lndHodUser.lastName} (ID: ${lndHodUser.id})`);

    // Create notification for the LND HoD
    console.log('2. Creating notification...');
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details for Review",
        message: `${applications.length} approved student(s) details forwarded from L&D Coordinator for ${department} department - awaiting LND HoD review`,
        userId: lndHodUser.id,
        priority: "HIGH"
      }
    });

    console.log(`✅ Created notification: ${notification.id}`);

    // Get the L&D Coordinator user ID from the request
    console.log('3. Finding L&D Coordinator...');
    const coordinatorUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D Coordinator"
        },
        isActive: true
      }
    });

    if (!coordinatorUser) {
      console.log('❌ L&D Coordinator not found');
      return;
    }

    console.log(`✅ Found L&D Coordinator: ${coordinatorUser.firstName} ${coordinatorUser.lastName} (ID: ${coordinatorUser.id})`);

    // Store the forwarded student details for LND HoD review
    console.log('4. Creating forwarded details...');
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department,
        applicationsCount: applications.length,
        applications: JSON.stringify(applications),
        forwardedBy: coordinatorUser.id,
        forwardedTo: lndHodUser.id,
        status: "PENDING_LND_REVIEW"
      }
    });

    console.log(`✅ Created forwarded details: ${forwardedDetails.id}`);

    // Test the retrieval logic
    console.log('5. Testing retrieval...');
    const retrievedDetails = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: lndHodUser.id,
        status: {
          in: ["PENDING_LND_REVIEW", "APPROVED_BY_LND", "REJECTED_BY_LND"]
        }
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
      }
    });

    console.log(`📊 Retrieved ${retrievedDetails.length} forwarded details for LND HoD`);
    retrievedDetails.forEach(detail => {
      console.log(`  - ID: ${detail.id}, Department: ${detail.department}, Status: ${detail.status}`);
      console.log(`    Applications: ${detail.applicationsCount}`);
      console.log(`    Forwarded by: ${detail.forwardedByUser?.firstName} ${detail.forwardedByUser?.lastName}`);
    });

    console.log('\n🎉 Detailed API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDetailedAPI(); 