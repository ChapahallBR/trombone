# GitHub Push Helper Script
# Run this in PowerShell to push your code to GitHub

Write-Host "Pushing code to GitHub..." -ForegroundColor Green

# Set the remote URL with authentication
$token = "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"
$repo = "ChapahallBR/trombone"

git remote set-url origin "https://$token@github.com/$repo.git"

# Push to GitHub
git push -u origin main

# Remove token from remote URL for security
git remote set-url origin "https://github.com/$repo.git"

Write-Host "Push complete! Check https://github.com/$repo" -ForegroundColor Green
