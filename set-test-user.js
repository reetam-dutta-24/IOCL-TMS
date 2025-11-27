// Script to set test user data in localStorage
// Run this in the browser console to set test user data

const testUserData = {
  id: 1,
  employeeId: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "TRAINEE",
  department: "Engineering"
}

// Set the user data in localStorage
localStorage.setItem("user", JSON.stringify(testUserData))
localStorage.setItem("token", "test-token-123")

console.log("Test user data set in localStorage:")
console.log("User:", JSON.parse(localStorage.getItem("user")))
console.log("Token:", localStorage.getItem("token"))

// Navigate to upload progress page
window.location.href = "/upload-progress" 