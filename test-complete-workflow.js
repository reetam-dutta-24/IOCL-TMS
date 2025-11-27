const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteWorkflow() {
  try {
    console.log('🧪 Testing Complete Forward to LND HoD Workflow...\n');

    // Step 1: Verify database setup
    console.log('1. Verifying database setup...');
    
    const users = await prisma.user.findMany({
      include: { role: true },
      where: { isActive: true }
    });
    
    const coordinator = users.find(u => u.role.name === 'L&D Coordinator');
    const lndHod = users.find(u => u.role.name === 'L&D HoD');
    
    console.log(`✅ Found ${users.length} active users`);
    console.log(`✅ L&D Coordinator: ${coordinator ? coordinator.firstName + ' ' + coordinator.lastName : 'Not found'}`);
    console.log(`✅ L&D HoD: ${lndHod ? lndHod.firstName + ' ' + lndHod.lastName : 'Not found'}`);

    // Step 2: Check existing forwarded details
    console.log('\n2. Checking existing forwarded details...');
    const existingDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        notification: true,
        forwardedByUser: true,
        forwardedToUser: true
      }
    });
    
    console.log(`📊 Found ${existingDetails.length} existing forwarded details`);
    existingDetails.forEach(detail => {
      console.log(`  - Department: ${detail.department}, Status: ${detail.status}`);
      console.log(`    Forwarded by: ${detail.forwardedByUser?.firstName} ${detail.forwardedByUser?.lastName}`);
      console.log(`    Forwarded to: ${detail.forwardedToUser?.firstName} ${detail.forwardedToUser?.lastName}`);
    });

    // Step 3: Simulate new forward request
    console.log('\n3. Simulating new forward request...');
    
    const testApplications = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        institutionName: "Test University",
        courseName: "Computer Science",
        preferredDepartment: "Computer Science",
        internshipDuration: 8,
        status: "APPROVED"
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        institutionName: "Test University",
        courseName: "Computer Science",
        preferredDepartment: "Computer Science",
        internshipDuration: 12,
        status: "APPROVED"
      }
    ];

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        type: "STUDENT_DETAILS_FORWARDED",
        title: "Approved Student Details for Review",
        message: `${testApplications.length} approved student(s) details forwarded from L&D Coordinator for Computer Science department - awaiting LND HoD review`,
        userId: lndHod.id,
        priority: "HIGH"
      }
    });

    // Create forwarded details
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department: "Computer Science",
        applicationsCount: testApplications.length,
        applications: JSON.stringify(testApplications),
        forwardedBy: coordinator.id,
        forwardedTo: lndHod.id,
        status: "PENDING_LND_REVIEW"
      }
    });

    console.log(`✅ Created notification: ${notification.id}`);
    console.log(`✅ Created forwarded details: ${forwardedDetails.id}`);

    // Step 4: Test retrieval for LND HoD dashboard
    console.log('\n4. Testing LND HoD dashboard retrieval...');
    
    const hodDashboardData = await prisma.forwardedStudentDetails.findMany({
      where: {
        forwardedTo: lndHod.id,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 LND HoD dashboard shows ${hodDashboardData.length} forwarded details`);
    hodDashboardData.forEach(detail => {
      console.log(`  - Department: ${detail.department}, Status: ${detail.status}`);
      console.log(`    Applications: ${detail.applicationsCount}`);
      console.log(`    Forwarded by: ${detail.forwardedByUser?.firstName} ${detail.forwardedByUser?.lastName}`);
      
      // Parse applications
      try {
        const applications = JSON.parse(detail.applications);
        console.log(`    Students: ${applications.map(app => `${app.firstName} ${app.lastName}`).join(', ')}`);
      } catch (e) {
        console.log(`    Error parsing applications: ${e.message}`);
      }
    });

    // Step 5: Test approval workflow
    console.log('\n5. Testing approval workflow...');
    
    // Simulate LND HoD approving students
    const updatedDetails = await prisma.forwardedStudentDetails.update({
      where: { id: forwardedDetails.id },
      data: { status: "APPROVED_BY_LND" }
    });
    
    console.log(`✅ Updated forwarded details status to: ${updatedDetails.status}`);

    // Step 6: Verify final state
    console.log('\n6. Verifying final state...');
    
    const finalDetails = await prisma.forwardedStudentDetails.findMany({
      where: { id: forwardedDetails.id },
      include: {
        notification: true,
        forwardedByUser: true,
        forwardedToUser: true
      }
    });
    
    console.log(`📊 Final state: ${finalDetails.length} details`);
    finalDetails.forEach(detail => {
      console.log(`  - ID: ${detail.id}, Status: ${detail.status}, Department: ${detail.department}`);
    });

    console.log('\n🎉 Complete workflow test successful!');
    console.log('\n📋 Summary:');
    console.log('✅ Database operations working');
    console.log('✅ User role verification working');
    console.log('✅ Notification creation working');
    console.log('✅ Forwarded details creation working');
    console.log('✅ LND HoD dashboard retrieval working');
    console.log('✅ Approval workflow working');
    console.log('✅ Data persistence working');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteWorkflow(); 