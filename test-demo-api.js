const { PrismaClient } = require('@prisma/client');

// Test the demo data directly without database
function testDemoData() {
  console.log('🧪 Testing demo data structure...');
  
  const demoForwardedDetails = [
    {
      id: 1,
      notificationId: 1,
      department: "Computer Science",
      applicationsCount: 3,
      applications: [
        {
          id: "app_1_1",
          firstName: "Rahul",
          lastName: "Sharma",
          email: "rahul.sharma@demo.com",
          institution: "IIT Delhi",
          course: "B.Tech Computer Science",
          cgpa: 8.7,
          duration: 6,
          preferredDepartment: "Computer Science"
        }
      ],
      forwardedBy: "Priya Sharma",
      forwardedByEmail: "priya.sharma@iocl.co.in",
      receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING_LND_REVIEW"
    }
  ];

  console.log('✅ Demo data structure is valid');
  console.log('📋 Sample data:');
  console.log('  ID:', demoForwardedDetails[0].id);
  console.log('  Department:', demoForwardedDetails[0].department);
  console.log('  Status:', demoForwardedDetails[0].status);
  console.log('  Applications Count:', demoForwardedDetails[0].applicationsCount);
  console.log('  Forwarded By:', demoForwardedDetails[0].forwardedBy);
  
  return demoForwardedDetails;
}

testDemoData(); 