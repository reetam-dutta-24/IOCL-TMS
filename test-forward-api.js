async function testForwardAPI() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🔍 Testing forward-to-lnd-hod API...');
    
    const testData = {
      hodId: 1, // Rajesh Kumar's ID
      department: "Computer Science",
      applications: [
        {
          id: 1,
          firstName: "Test",
          lastName: "Student",
          email: "test.student@test.com",
          phone: "1234567890",
          institutionName: "Test University",
          courseName: "Computer Science",
          currentYear: 3,
          cgpa: 8.5,
          preferredDepartment: "Computer Science",
          internshipDuration: 8,
          skills: "JavaScript, React, Node.js",
          projectInterests: "Web Development",
          status: "APPROVED",
          createdAt: "2025-07-27T02:46:28.233Z",
          approvedAt: "2025-07-27T02:46:28.233Z"
        }
      ]
    };
    
    console.log('📊 Sending test data:', testData);
    
    const response = await fetch('http://localhost:3000/api/notifications/forward-to-lnd-hod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Success response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('💥 Error testing API:', error);
  }
}

testForwardAPI(); 