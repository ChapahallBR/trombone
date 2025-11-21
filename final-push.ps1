# Final Push Attempt
Write-Host "Attempting to push to GitHub..." -ForegroundColor Cyan

# Configure git to use credential helper
git config --global credential.helper wincred

# Set the token as credential
$token = "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"
$user = "ChapahallBR"

# Create a credential file temporarily
$credText = "https://${user}:${token}@github.com"
echo $credText | git credential approve

# Try push
Write-Host "Pushing..." -ForegroundColor Green
git push -u origin main --force

Write-Host "`nCheck: https://github.com/ChapahallBR/trombone" -ForegroundColor Yellow
