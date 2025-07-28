Write-Host "🧪 Testing HTTP API endpoints..." -ForegroundColor Green

# Test 1: Test simple endpoint
Write-Host "`n1. Testing simple endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/test-simple" -Method GET
    Write-Host "✅ Simple endpoint working: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Simple endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test forward-to-lnd-hod endpoint
Write-Host "`n2. Testing forward-to-lnd-hod endpoint..." -ForegroundColor Yellow
try {
    $testData = @{
        department = "Computer Science"
        applications = @(
            @{
                id = 1
                firstName = "Test"
                lastName = "Student"
                email = "test@example.com"
                institutionName = "Test University"
                courseName = "Computer Science"
                preferredDepartment = "Computer Science"
                internshipDuration = 8
                status = "APPROVED"
            }
        )
    } | ConvertTo-Json -Depth 10

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/notifications/forward-to-lnd-hod" -Method POST -Body $testData -Headers $headers
    Write-Host "✅ Forward API working: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Forward API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test forwarded-student-details endpoint
Write-Host "`n3. Testing forwarded-student-details endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/notifications/forwarded-student-details?userId=1" -Method GET
    Write-Host "✅ Details API working: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Details API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 HTTP API tests completed!" -ForegroundColor Green 