const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSimpleForwarded() {
  try {
    console.log('Creating forwarded student details...');
    
    // Create notification first
    const notification = await prisma.notification.create({
      data: {
        userId: 3, // Department HoD
        type: 'STUDENT_DETAILS_FORWARDED',
        title: 'Student Details Forwarded',
        message: '2 student applications have been forwarded to your department.',
        isRead: false,
        priority: 'MEDIUM'
      }
    });
    
    console.log('Created notification:', notification.id);
    
    // Create forwarded student details
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
    
    const forwardedDetails = await prisma.forwardedStudentDetails.create({
      data: {
        notificationId: notification.id,
        department: 'Information Technology',
        applicationsCount: 2,
        applications: JSON.stringify(applications),
        forwardedBy: 2, // L&D Coordinator
        forwardedTo: 3  // Department HoD
      }
    });
    
    console.log('Created forwarded details:', forwardedDetails.id);
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleForwarded(); 