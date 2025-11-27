const fetch = require('node-fetch');

async function testFindHod() {
  try {
    console.log('🧪 Testing Department HoD finding functionality...');
    
    // Test different departments
    const departments = [
      "Information Technology",
      "IT", 
      "Human Resources",
      "HR",
      "Operations",
      "Engineering",
      "Finance"
    ];

    for (const department of departments) {
      console.log(`\n🔍 Testing department: ${department}`);
      
      const testData = {
        department: department,
        applications: [
          {
            id: 1,
            firstName: "Test",
            lastName: "Student",
            email: "test@example.com",
            institutionName: "Test University",
            courseName: "Test Course",
            internshipDuration: 8,
            skills: "Test Skills",
            projectInterests: "Test Interests"
          }
        ]
      };

      const response = await fetch('http://localhost:3000/api/notifications/forward-to-hod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success for ${department}:`);
        console.log(`   - HOD: ${result.hodUser?.name || 'Not found'}`);
        console.log(`   - Email: ${result.hodUser?.email || 'Not found'}`);
        console.log(`   - ID: ${result.hodUser?.id || 'Not found'}`);
      } else {
        console.log(`❌ Failed for ${department}:`);
        console.log(`   - Error: ${result.error}`);
      }
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testFindHod(); 