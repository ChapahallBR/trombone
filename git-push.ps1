# Configure Git Credential Manager
Write-Host "Configuring Git credentials..." -ForegroundColor Cyan

# Store credentials temporarily
$env:GIT_ASKPASS = "echo"
$env:GIT_USERNAME = "ChapahallBR"
$env:GIT_PASSWORD = "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"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main --force 2>&1

# Clear environment variables
Remove-Item Env:GIT_ASKPASS
Remove-Item Env:GIT_USERNAME  
Remove-Item Env:GIT_PASSWORD

Write-Host "`nDone! Check https://github.com/ChapahallBR/trombone" -ForegroundColor Green
