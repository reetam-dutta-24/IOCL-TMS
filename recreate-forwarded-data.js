const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function recreateForwardedData() {
  try {
    console.log('🔄 Recreating forwarded student details...\n');
    
    // Get the L&D Coordinator user
    const coordinator = await prisma.user.findFirst({
      where: {
        role: { name: 'L&D Coordinator' },
        isActive: true
      }
    });
    
    // Get the Department HoD user
    const deptHod = await prisma.user.findFirst({
      where: {
        role: { name: 'Department HoD' },
        isActive: true
      }
    });
    
    console.log(`👤 L&D Coordinator: ${coordinator.firstName} ${coordinator.lastName} (ID: ${coordinator.id})`);
    console.log(`👤 Department HoD: ${deptHod.firstName} ${deptHod.lastName} (ID: ${deptHod.id})`);
    
    // Create sample applications data
    const applications = [
      {
        firstName: "Rahul Kumar",
        lastName: "Sharma",
        email: "rahul.sharma@iitd.ac.in",
        institutionName: "IIT Delhi",
        courseName: "Computer Science Engineering",
        currentYear: 3,
        cgpa: 8.5,
        preferredDepartment: "Information Technology",
        internshipDuration: 8,
        skills: "Python, Java, React, Node.js",
        projectInterests: "Web Development, Machine Learning",
        motivation: "Eager to learn and contribute to real-world projects"
      },
      {
        firstName: "Priya Sharma",
        lastName: "Verma",
        email: "priya.verma@nitt.edu",
        institutionName: "NIT Trichy",
        courseName: "Information Technology",
        currentYear: 3,
        cgpa: 8.2,
        preferredDepartment: "Information Technology",
        internshipDuration: 6,
        skills: "JavaScript, React, Python, SQL",
        projectInterests: "Full Stack Development, Data Analysis",
        motivation: "Passionate about technology and innovation"
      }
    ];
    
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: deptHod.id,
        type: 'STUDENT_DETAILS_FORWARDED',
        title: 'Student Details Forwarded',
        message: `2 student applications have been forwarded to your department for mentor assignment.`,
        isRead: false,
        priority: 'MEDIUM'
      }
    });
    
    console.log(`📧 Created notification (ID: ${notification.id})`);
    
    // Create forwarded student details
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department: 'Information Technology',
        applicationsCount: applications.length,
        applications: JSON.stringify(applications),
        forwardedBy: coordinator.id,
        forwardedTo: deptHod.id
      }
    });
    
    console.log(`📋 Created forwarded student details (ID: ${forwardedDetails.id})`);
    console.log(`✅ Successfully recreated forwarded data for Department HoD`);
    
    // Verify the data
    const verification = await prisma.forwardedStudentDetails.findFirst({
      where: { id: forwardedDetails.id },
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
    
    console.log(`\n🔍 Verification:`);
    console.log(`   Department: ${verification.department}`);
    console.log(`   Applications Count: ${verification.applicationsCount}`);
    console.log(`   Forwarded By: ${verification.forwardedByUser.firstName} ${verification.forwardedByUser.lastName}`);
    console.log(`   Forwarded To: ${verification.forwardedToUser.firstName} ${verification.forwardedToUser.lastName}`);
    console.log(`   Notification Read: ${verification.notification.isRead}`);
    
  } catch (error) {
    console.error('❌ Error recreating forwarded data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateForwardedData(); 