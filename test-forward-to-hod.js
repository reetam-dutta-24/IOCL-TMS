const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testForwardToHod() {
  try {
    console.log('🧪 Testing forward-to-hod functionality...');
    
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
          internshipDuration: 8,
          skills: "React, Node.js, Python",
          projectInterests: "Web Development, AI/ML"
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          institutionName: "NIT Trichy",
          courseName: "Information Technology",
          internshipDuration: 6,
          skills: "Java, Spring Boot, MySQL",
          projectInterests: "Backend Development, Database Design"
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
      console.log('✅ Forward-to-HoD test successful!');
      console.log('Result:', result);
    } else {
      console.log('❌ Forward-to-HoD test failed!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testForwardToHod(); 