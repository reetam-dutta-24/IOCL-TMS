Write-Host "Testing API endpoint..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/forwarded-student-details?userId=1" -Method GET
    
    Write-Host "API Success!" -ForegroundColor Green
    Write-Host "Data structure: $($response.PSObject.Properties.Name -join ', ')" -ForegroundColor Yellow
    
    if ($response.forwardedDetails) {
        Write-Host "Forwarded details count: $($response.forwardedDetails.Count)" -ForegroundColor Yellow
        
        if ($response.forwardedDetails.Count -gt 0) {
            $sample = $response.forwardedDetails[0]
            Write-Host "Sample forwarded detail:" -ForegroundColor Cyan
            Write-Host "  ID: $($sample.id)" -ForegroundColor White
            Write-Host "  Department: $($sample.department)" -ForegroundColor White
            Write-Host "  Status: $($sample.status)" -ForegroundColor White
            Write-Host "  Forwarded By: $($sample.forwardedBy)" -ForegroundColor White
            Write-Host "  Applications Count: $($sample.applicationsCount)" -ForegroundColor White
            Write-Host "  Applications: $($sample.applications.Count)" -ForegroundColor White
        }
    } else {
        Write-Host "No forwardedDetails in response" -ForegroundColor Red
    }
} catch {
    Write-Host "API Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
} 