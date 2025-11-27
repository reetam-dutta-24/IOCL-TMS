const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testServerStatus() {
  try {
    console.log('🔍 Testing server status...');
    
    // Test a simple endpoint first
    const response1 = await fetch('http://localhost:3000/api/auth');
    console.log('Auth endpoint status:', response1.status);
    
    // Test the forward-to-hod endpoint with POST
    const testData = {
      department: "Information Technology",
      applications: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          institutionName: "IIT Delhi",
          courseName: "Computer Science",
          internshipDuration: 8
        }
      ]
    };
    
    const response2 = await fetch('http://localhost:3000/api/notifications/forward-to-hod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Forward-to-HoD endpoint status:', response2.status);
    
    const text = await response2.text();
    console.log('Response:', text);
    
  } catch (error) {
    console.error('💥 Server test failed:', error.message);
  }
}

testServerStatus(); 