async function testProgressReportAPI() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('Testing progress report API...');
    
    // Test the GET endpoint
    const getResponse = await fetch('http://localhost:3000/api/progress-reports', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('GET Response Status:', getResponse.status);
    const getText = await getResponse.text();
    console.log('GET Response Text:', getText);
    
    // Test the POST endpoint
    const postData = {
      title: "Test Report",
      description: "Test Description", 
      category: "WEEKLY",
      progressPercentage: 50
    };
    
    const postResponse = await fetch('http://localhost:3000/api/progress-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    console.log('POST Response Status:', postResponse.status);
    const postText = await postResponse.text();
    console.log('POST Response Text:', postText);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testProgressReportAPI(); 