const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAssignments() {
  try {
    const assignments = await prisma.mentorAssignment.findMany({
      include: {
        mentor: true,
        request: true
      }
    });
    
    console.log('Mentor Assignments:');
    assignments.forEach(a => {
      console.log(`ID: ${a.id}, Mentor: ${a.mentor.firstName} ${a.mentor.lastName} (${a.mentorId}), Request: ${a.request.requestNumber}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAssignments(); 