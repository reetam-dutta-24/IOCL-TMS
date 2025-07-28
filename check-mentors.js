const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMentors() {
  try {
    console.log('🔍 Checking mentor assignments...');
    
    const mentorAssignments = await prisma.mentorAssignment.findMany({
      include: {
        mentor: true,
        request: {
          include: {
            submitter: true,
            department: true
          }
        }
      }
    });
    
    console.log(`📊 Found ${mentorAssignments.length} mentor assignments`);
    
    if (mentorAssignments.length > 0) {
      console.log('\n📋 Mentor Assignments:');
      mentorAssignments.forEach((assignment, index) => {
        console.log(`${index + 1}. Mentor ID: ${assignment.mentorId}`);
        console.log(`   Request ID: ${assignment.internshipRequestId}`);
        console.log(`   Status: ${assignment.assignmentStatus}`);
        console.log(`   Start Date: ${assignment.startDate}`);
        console.log(`   End Date: ${assignment.endDate}`);
        console.log('---');
      });
    } else {
      console.log('❌ No mentor assignments found in database');
    }
    
    // Check users with mentor role
    const mentors = await prisma.user.findMany({
      where: {
        role: {
          name: 'MENTOR'
        }
      },
      include: {
        role: true,
        department: true
      }
    });
    
    console.log(`\n👥 Found ${mentors.length} users with MENTOR role`);
    
    if (mentors.length > 0) {
      console.log('\n📋 Mentors:');
      mentors.forEach((mentor, index) => {
        console.log(`${index + 1}. ${mentor.firstName} ${mentor.lastName} (${mentor.employeeId})`);
        console.log(`   Department: ${mentor.department?.name || 'None'}`);
        console.log(`   Email: ${mentor.email}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking mentors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMentors(); 