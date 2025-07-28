// Test script to check localStorage and simulate user data
console.log("Testing localStorage simulation...")

// Simulate user data that should be in localStorage
const mockUserData = {
  id: 1,
  employeeId: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "TRAINEE",
  department: "Engineering"
}

console.log("Mock user data:", mockUserData)
console.log("JSON stringified:", JSON.stringify(mockUserData))

// Test if this would work in the upload progress page
const testUserData = JSON.stringify(mockUserData)
console.log("Test user data string:", testUserData)

try {
  const parsed = JSON.parse(testUserData)
  console.log("Successfully parsed:", parsed)
} catch (error) {
  console.error("Error parsing:", error)
} 