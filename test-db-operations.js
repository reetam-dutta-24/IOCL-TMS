const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseOperations() {
  try {
    console.log('🔍 Testing database operations...');
    
    // Test 1: Find L&D HoD user
    console.log('\n1. Finding L&D HoD user...');
    const lndHodUser = await prisma.user.findFirst({
      where: {
        id: 1,
        role: {
          name: "L&D HoD"
        },
        isActive: true
      }
    });
    
    if (lndHodUser) {
      console.log(`✅ Found L&D HoD: ${lndHodUser.firstName} ${lndHodUser.lastName} (ID: ${lndHodUser.id})`);
    } else {
      console.log('❌ L&D HoD not found');
      return;
    }
    
    // Test 2: Find L&D Coordinator user
    console.log('\n2. Finding L&D Coordinator user...');
    const coordinatorUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "L&D Coordinator"
        },
        isActive: true
      }
    });
    
    if (coordinatorUser) {
      console.log(`✅ Found L&D Coordinator: ${coordinatorUser.firstName} ${coordinatorUser.lastName} (ID: ${coordinatorUser.id})`);
    } else {
      console.log('❌ L&D Coordinator not found');
      return;
    }
    
    // Test 3: Create notification
    console.log('\n3. Creating notification...');
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details for Review",
        message: "1 approved student(s) details forwarded from L&D Coordinator for Computer Science department - awaiting LND HoD review",
        userId: lndHodUser.id,
        priority: "HIGH"
      }
    });
    
    console.log(`✅ Created notification: ${notification.id}`);
    
    // Test 4: Create forwarded student details
    console.log('\n4. Creating forwarded student details...');
    const testApplications = [
      {
        id: 1,
        firstName: "Test",
        lastName: "Student",
        email: "test.student@test.com",
        phone: "1234567890",
        institutionName: "Test University",
        courseName: "Computer Science",
        currentYear: 3,
        cgpa: 8.5,
        preferredDepartment: "Computer Science",
        internshipDuration: 8,
        skills: "JavaScript, React, Node.js",
        projectInterests: "Web Development",
        status: "APPROVED",
        createdAt: "2025-07-27T02:46:28.233Z",
        approvedAt: "2025-07-27T02:46:28.233Z"
      }
    ];
    
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department: "Computer Science",
        applicationsCount: testApplications.length,
        applications: JSON.stringify(testApplications),
        forwardedBy: coordinatorUser.id,
        forwardedTo: lndHodUser.id,
        status: "PENDING_LND_REVIEW"
      }
    });
    
    console.log(`✅ Created forwarded details: ${forwardedDetails.id}`);
    
    // Test 5: Verify the data was created
    console.log('\n5. Verifying created data...');
    const createdDetails = await prisma.forwardedStudentDetails.findUnique({
      where: { id: forwardedDetails.id },
      include: {
        notification: true,
        forwardedByUser: true,
        forwardedToUser: true
      }
    });
    
    if (createdDetails) {
      console.log(`✅ Verified forwarded details:`);
      console.log(`  - ID: ${createdDetails.id}`);
      console.log(`  - Department: ${createdDetails.department}`);
      console.log(`  - Status: ${createdDetails.status}`);
      console.log(`  - Forwarded by: ${createdDetails.forwardedByUser?.firstName} ${createdDetails.forwardedByUser?.lastName}`);
      console.log(`  - Forwarded to: ${createdDetails.forwardedToUser?.firstName} ${createdDetails.forwardedToUser?.lastName}`);
      console.log(`  - Applications count: ${createdDetails.applicationsCount}`);
    } else {
      console.log('❌ Failed to verify created data');
    }
    
    console.log('\n🎉 All database operations completed successfully!');
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseOperations(); 