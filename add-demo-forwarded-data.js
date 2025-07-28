const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDemoForwardedData() {
  try {
    console.log('🚀 Starting to add demo forwarded student details...');

    // First, let's check what users we have
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('📋 Available users:');
    users.forEach(user => {
      console.log(`  ID: ${user.id}, Name: ${user.firstName} ${user.lastName}, Role: ${user.role.name}, Email: ${user.email}`);
    });

    // Find L&D Coordinator and L&D HoD users
    const lndCoordinator = users.find(u => u.role.name === 'L&D Coordinator');
    const lndHod = users.find(u => u.role.name === 'L&D HoD');

    if (!lndCoordinator) {
      console.log('❌ No L&D Coordinator found. Creating one...');
      // Create a demo L&D Coordinator if not exists
      const coordinatorRole = await prisma.role.findFirst({
        where: { name: 'L&D Coordinator' }
      });
      
      if (coordinatorRole) {
        const newCoordinator = await prisma.user.create({
          data: {
            employeeId: 'LND001',
            firstName: 'Demo',
            lastName: 'Coordinator',
            email: 'lnd.coordinator@demo.com',
            password: 'hashedpassword',
            roleId: coordinatorRole.id,
            isActive: true
          }
        });
        console.log(`✅ Created demo L&D Coordinator: ${newCoordinator.id}`);
      }
    }

    if (!lndHod) {
      console.log('❌ No L&D HoD found. Creating one...');
      // Create a demo L&D HoD if not exists
      const hodRole = await prisma.role.findFirst({
        where: { name: 'L&D HoD' }
      });
      
      if (hodRole) {
        const newHod = await prisma.user.create({
          data: {
            employeeId: 'LND002',
            firstName: 'Demo',
            lastName: 'HOD',
            email: 'lnd.hod@demo.com',
            password: 'hashedpassword',
            roleId: hodRole.id,
            isActive: true
          }
        });
        console.log(`✅ Created demo L&D HoD: ${newHod.id}`);
      }
    }

    // Get the actual users (or newly created ones)
    const coordinator = await prisma.user.findFirst({
      where: { role: { name: 'L&D Coordinator' } }
    });
    
    const hod = await prisma.user.findFirst({
      where: { role: { name: 'L&D HoD' } }
    });

    if (!coordinator || !hod) {
      console.log('❌ Could not find or create required users');
      return;
    }

    console.log(`📝 Using Coordinator ID: ${coordinator.id}, HOD ID: ${hod.id}`);

    // Create demo notifications first
    const demoNotifications = [];
    for (let i = 1; i <= 5; i++) {
      const notification = await prisma.notification.create({
        data: {
          userId: hod.id,
          type: 'STUDENT_DETAILS_FORWARDED',
          title: `Student Applications Forwarded - Batch ${i}`,
          message: `New student applications have been forwarded for LND review`,
          isRead: false,
          priority: 'HIGH',
          status: 'UNREAD'
        }
      });
      demoNotifications.push(notification);
      console.log(`✅ Created notification ${i}: ${notification.id}`);
    }

    // Create demo forwarded student details
    const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Civil Engineering'];
    const statuses = ['PENDING_LND_REVIEW', 'APPROVED_BY_LND', 'REJECTED_BY_LND'];

    for (let i = 0; i < 5; i++) {
      const demoApplications = [
        {
          id: `app_${i}_1`,
          firstName: `Student${i + 1}_1`,
          lastName: 'Demo',
          email: `student${i + 1}_1@demo.com`,
          institution: 'Demo University',
          course: 'B.Tech Computer Science',
          cgpa: 8.5 + (i * 0.2),
          duration: 6
        },
        {
          id: `app_${i}_2`,
          firstName: `Student${i + 1}_2`,
          lastName: 'Demo',
          email: `student${i + 1}_2@demo.com`,
          institution: 'Demo Institute',
          course: 'B.Tech Electrical',
          cgpa: 8.0 + (i * 0.3),
          duration: 4
        }
      ];

      const forwardedDetail = await prisma.forwardedStudentDetails.create({
        data: {
          notificationId: demoNotifications[i].id,
          department: departments[i % departments.length],
          applicationsCount: demoApplications.length,
          applications: JSON.stringify(demoApplications),
          forwardedBy: coordinator.id,
          forwardedTo: hod.id,
          status: statuses[i % statuses.length],
          createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Different dates
        }
      });

      console.log(`✅ Created forwarded detail ${i + 1}: ${forwardedDetail.id}`);
      console.log(`   Department: ${departments[i % departments.length]}`);
      console.log(`   Status: ${statuses[i % statuses.length]}`);
      console.log(`   Applications: ${demoApplications.length}`);
    }

    console.log('🎉 Demo forwarded student details added successfully!');
    
    // Verify the data
    const allForwardedDetails = await prisma.forwardedStudentDetails.findMany({
      include: {
        forwardedByUser: true,
        forwardedToUser: true
      }
    });

    console.log(`📊 Total forwarded details in database: ${allForwardedDetails.length}`);
    allForwardedDetails.forEach((detail, index) => {
      console.log(`  ${index + 1}. ID: ${detail.id}, Department: ${detail.department}, Status: ${detail.status}`);
    });

  } catch (error) {
    console.error('❌ Error adding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDemoForwardedData(); 