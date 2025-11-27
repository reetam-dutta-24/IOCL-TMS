async function testSimple() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('Testing simple endpoint...');
    
    // Test a simple endpoint first
    const response = await fetch('http://localhost:3000/api/auth', {
      method: 'GET',
    });
    
    console.log('Response Status:', response.status);
    const text = await response.text();
    console.log('Response Text:', text);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testSimple(); 