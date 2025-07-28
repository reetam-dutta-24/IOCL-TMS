const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Checking database structure and data...');
    
    // Get all internship applications
    const applications = await prisma.internshipApplication.findMany({
      include: {
        reviewer: true,
        assignedMentor: true,
        traineeUser: true
      }
    });
    
    console.log(`✅ Found ${applications.length} total applications`);
    
    if (applications.length > 0) {
      console.log('\n📋 Sample application structure:');
      const sample = applications[0];
      console.log(JSON.stringify(sample, null, 2));
      
      console.log('\n📊 Applications by status:');
      const statusCounts = {};
      applications.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
      });
      
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      // Check approved applications specifically
      const approvedApps = applications.filter(app => app.status === 'APPROVED');
      console.log(`\n✅ Approved applications: ${approvedApps.length}`);
      
      approvedApps.forEach((app, index) => {
        console.log(`${index + 1}. ${app.firstName} ${app.lastName}`);
        console.log(`   ID: ${app.id}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Preferred Department: ${app.preferredDepartment}`);
        console.log(`   Email: ${app.email}`);
        console.log(`   Phone: ${app.phone}`);
        console.log(`   Institution: ${app.institutionName}`);
        console.log(`   Course: ${app.courseName}`);
        console.log(`   Current Year: ${app.currentYear}`);
        console.log(`   CGPA: ${app.cgpa}`);
        console.log(`   Duration: ${app.internshipDuration}`);
        console.log(`   Reviewed by: ${app.reviewer?.firstName || 'None'}`);
        console.log(`   Created: ${app.createdAt}`);
        console.log(`   Updated: ${app.updatedAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('💥 Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure(); 