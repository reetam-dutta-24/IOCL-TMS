const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDirectDB() {
  try {
    console.log('🔍 Testing direct database query...');
    
    const internships = await prisma.internshipApplication.findMany({
      where: { status: "APPROVED" },
      include: {
        reviewer: true,
        assignedMentor: true,
        traineeUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${internships.length} approved internships`);
    
    if (internships.length > 0) {
      console.log('📋 Raw data from database:');
      console.log(JSON.stringify(internships[0], null, 2));
      
      console.log('\n🔄 Transformed data:');
      const transformed = internships.map(internship => ({
        id: internship.id,
        firstName: internship.firstName,
        lastName: internship.lastName,
        email: internship.email,
        phone: internship.phone,
        institutionName: internship.institutionName,
        courseName: internship.courseName,
        currentYear: internship.currentYear,
        cgpa: internship.cgpa,
        preferredDepartment: internship.preferredDepartment,
        internshipDuration: internship.internshipDuration,
        skills: internship.skills,
        projectInterests: internship.projectInterests,
        status: internship.status,
        createdAt: internship.createdAt.toISOString(),
        approvedAt: internship.reviewedAt?.toISOString() || internship.updatedAt.toISOString()
      }));
      
      console.log(JSON.stringify(transformed[0], null, 2));
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectDB(); 