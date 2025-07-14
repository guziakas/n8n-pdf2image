#!/bin/bash

# Release script for n8n-nodes-pdf2image
# Usage: ./release.sh [patch|minor|major]

set -e

# Get the release type (patch, minor, major)
RELEASE_TYPE=${1:-patch}

if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "Error: Release type must be 'patch', 'minor', or 'major'"
    echo "Usage: ./release.sh [patch|minor|major]"
    exit 1
fi

echo "🚀 Starting $RELEASE_TYPE release..."

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Warning: You're not on the main branch (currently on $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash your changes."
    git status --short
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# Run tests and build
echo "🧪 Running tests and build..."
npm ci
npm run lint
npm run build

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Bump version automatically
echo "📝 Bumping $RELEASE_TYPE version..."
NEW_VERSION=$(npm version $RELEASE_TYPE --no-git-tag-version)
echo "New version: $NEW_VERSION"

# Update package-lock.json
npm install --package-lock-only

# Commit version bump
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION

Automated $RELEASE_TYPE version bump for release"

# Create and push tag
git tag $NEW_VERSION
git push origin $CURRENT_BRANCH
git push origin $NEW_VERSION

echo "✅ Release $NEW_VERSION created successfully!"
echo "🔄 GitHub Actions will now:"
echo "   1. Build and test the package"
echo "   2. Publish to npm registry"
echo "   3. Create GitHub release"
echo ""
echo "📱 Check the progress at: https://github.com/guziakas/n8n-pdf2image/actions"
