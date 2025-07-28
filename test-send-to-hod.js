// Using dynamic import for node-fetch
async function testSendToHod() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🧪 Testing send-to-hod functionality...');
    
    // Test data for Information Technology department
    const testData = {
      department: "Information Technology",
      applications: [
        {
          id: 1,
          firstName: "Rahul",
          lastName: "Sharma",
          email: "rahul.sharma@iitd.ac.in",
          institutionName: "IIT Delhi",
          courseName: "Computer Science & Engineering",
          internshipDuration: 8,
          skills: "React, Node.js, Python, Machine Learning",
          projectInterests: "Web Development, AI/ML, Data Science"
        },
        {
          id: 2,
          firstName: "Priya",
          lastName: "Patel",
          email: "priya.patel@nit.ac.in",
          institutionName: "NIT Trichy",
          courseName: "Information Technology",
          internshipDuration: 6,
          skills: "Java, Spring Boot, MySQL, Angular",
          projectInterests: "Backend Development, Database Design, API Development"
        },
        {
          id: 3,
          firstName: "Amit",
          lastName: "Kumar",
          email: "amit.kumar@bits.ac.in",
          institutionName: "BITS Pilani",
          courseName: "Computer Science",
          internshipDuration: 10,
          skills: "Python, Django, PostgreSQL, Docker",
          projectInterests: "Full Stack Development, DevOps, Cloud Computing"
        }
      ]
    };

    console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3000/api/notifications/forward-to-hod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully sent data to HOD!');
      console.log('Result:', result);
      console.log('\n📋 Next steps:');
      console.log('1. Check the HOD dashboard at http://localhost:3000/dashboard');
      console.log('2. Look for the "Received Student Details" section');
      console.log('3. You should see 3 student applications from IT department');
      console.log(`4. The data was sent to: ${result.hodUser?.name || 'Department HoD'}`);
    } else {
      console.log('❌ Failed to send data to HOD!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testSendToHod(); 