const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMentorData() {
  try {
    console.log('🔍 Checking mentor data...');
    
    // Check if there are any mentor assignments
    const mentorAssignments = await prisma.mentorAssignment.findMany({
      include: {
        request: {
          include: {
            submitter: true,
            department: true
          }
        },
        mentor: true,
        projectReports: true
      }
    });
    
    console.log(`📊 Found ${mentorAssignments.length} mentor assignments`);
    
    if (mentorAssignments.length === 0) {
      console.log('⚠️ No mentor assignments found. Creating test data...');
      
      // Get a mentor user (user with mentor role)
      const mentorUser = await prisma.user.findFirst({
        where: {
          role: {
            name: {
              contains: 'Mentor'
            }
          }
        }
      });
      
      if (!mentorUser) {
        console.log('❌ No mentor user found. Creating one...');
        const mentorRole = await prisma.role.findFirst({
          where: { name: 'Mentor' }
        });
        
        if (!mentorRole) {
          console.log('❌ No mentor role found. Creating one...');
          await prisma.role.create({
            data: {
              name: 'Mentor',
              description: 'Department Mentor'
            }
          });
        }
        
        const newMentor = await prisma.user.create({
          data: {
            employeeId: 'MENTOR001',
            firstName: 'Test',
            lastName: 'Mentor',
            email: 'mentor@test.com',
            password: '$2b$10$demo123',
            roleId: mentorRole?.id || 1,
            isActive: true
          }
        });
        console.log(`✅ Created mentor user: ${newMentor.firstName} ${newMentor.lastName}`);
      }
      
      // Get an internship request
      const internshipRequest = await prisma.internshipRequest.findFirst();
      
      if (!internshipRequest) {
        console.log('❌ No internship requests found. Creating one...');
        const newRequest = await prisma.internshipRequest.create({
          data: {
            requestNumber: 'REQ001',
            traineeName: 'Test Trainee',
            traineeEmail: 'trainee@test.com',
            institutionName: 'Test University',
            courseDetails: 'Computer Science',
            internshipDuration: 6,
            requestedBy: 1,
            status: 'APPROVED'
          }
        });
        console.log(`✅ Created internship request: ${newRequest.requestNumber}`);
      }
      
      // Create mentor assignment
      const mentorId = mentorUser?.id || 1;
      const requestId = internshipRequest?.id || 1;
      
      const assignment = await prisma.mentorAssignment.create({
        data: {
          internshipRequestId: requestId,
          mentorId: mentorId,
          assignmentStatus: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 months
        }
      });
      
      console.log(`✅ Created mentor assignment: ${assignment.id}`);
    }
    
    // Test the API call
    console.log('🧪 Testing mentor API...');
    const testAssignments = await prisma.mentorAssignment.findMany({
      where: { mentorId: 4 },
      include: {
        request: {
          include: {
            submitter: true,
            department: true
          }
        },
        projectReports: true
      }
    });
    
    console.log(`✅ Found ${testAssignments.length} assignments for mentor ID 4`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMentorData(); 