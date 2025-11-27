const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/internships?status=approved');
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (Array.isArray(data)) {
      console.log(`\n📊 Found ${data.length} approved applications`);
      data.forEach((app, index) => {
        console.log(`${index + 1}. ${app.firstName} ${app.lastName} (ID: ${app.id}, Status: ${app.status})`);
      });
    } else {
      console.log('❌ Response is not an array:', typeof data);
    }
    
  } catch (error) {
    console.error('💥 Error testing API:', error);
  }
}

testAPI(); 