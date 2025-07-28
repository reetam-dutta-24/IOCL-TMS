async function testNewAPI() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🔍 Testing new API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/test-internships');
    
    if (!response.ok) {
      console.error(`❌ API returned status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (Array.isArray(data)) {
      console.log(`\n📊 Found ${data.length} approved applications`);
      data.forEach((app, index) => {
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
        console.log('');
      });
    } else {
      console.log('❌ Response is not an array:', typeof data);
    }
    
  } catch (error) {
    console.error('💥 Error testing API:', error);
  }
}

testNewAPI(); 