# Release script for n8n-nodes-pdf2image
# Usage: .\release.ps1 [patch|minor|major]

param(
    [Parameter(Position=0)]
    [ValidateSet("patch", "minor", "major")]
    [string]$ReleaseType = "patch"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting $ReleaseType release..." -ForegroundColor Green

# Check if we're on main branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -notin @("main", "master")) {
    Write-Warning "You're not on the main branch (currently on $currentBranch)"
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Check if working directory is clean
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Working directory is not clean. Please commit or stash your changes." -ForegroundColor Red
    git status --short
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Blue
git pull origin $currentBranch

# Run tests and build
Write-Host "🧪 Running tests and build..." -ForegroundColor Blue
npm ci
npm run lint
npm run build

# Bump version and create tag
Write-Host "📝 Bumping version..." -ForegroundColor Blue
$newVersion = npm version $ReleaseType --no-git-tag-version
Write-Host "New version: $newVersion" -ForegroundColor Green

# Update package-lock.json
npm install --package-lock-only

# Commit version bump
git add package.json package-lock.json
git commit -m "chore: bump version to $newVersion"

# Create and push tag
git tag $newVersion
git push origin $currentBranch
git push origin $newVersion

Write-Host "✅ Release $newVersion created successfully!" -ForegroundColor Green
Write-Host "🔄 GitHub Actions will now:" -ForegroundColor Yellow
Write-Host "   1. Build and test the package" -ForegroundColor Yellow
Write-Host "   2. Publish to npm registry" -ForegroundColor Yellow
Write-Host "   3. Create GitHub release" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Check the progress at: https://github.com/guziakas/n8n-pdf2image/actions" -ForegroundColor Blue
