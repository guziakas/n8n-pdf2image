# Automated Release Setup for n8n-nodes-pdf2image

## 🎯 What This Setup Provides

### Automated CI/CD Pipeline
- ✅ **Continuous Integration**: Tests on every push and PR
- ✅ **Automated Releases**: Publishes to npm and creates GitHub releases
- ✅ **Version Management**: Automated version bumping and tagging
- ✅ **Multi-Node Testing**: Tests on Node.js 18.x and 20.x

### Release Workflow
1. **Push a version tag** → GitHub Actions automatically:
   - Builds the package
   - Runs tests and linting
   - Publishes to npm registry
   - Creates GitHub release with changelog
   - Uploads package artifacts

## 🚀 Quick Start

### First-Time Setup

1. **Set up npm token** (one-time setup):
   ```bash
   # 1. Go to https://www.npmjs.com/settings/your-username/tokens
   # 2. Create new "Automation" token
   # 3. Copy the token
   # 4. Go to GitHub repo → Settings → Secrets and variables → Actions
   # 5. Add new secret: NPM_TOKEN = your_token_here
   ```

2. **Create your first release**:
   ```powershell
   # Windows
   .\release.ps1 patch
   
   # Or manually
   npm version patch
   git push origin main --tags
   ```

### Regular Release Process

```powershell
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Create release (pick one)
.\release.ps1 patch   # 1.0.0 → 1.0.1 (bug fixes)
.\release.ps1 minor   # 1.0.0 → 1.1.0 (new features)
.\release.ps1 major   # 1.0.0 → 2.0.0 (breaking changes)
```

## 📁 Files Created

### GitHub Actions Workflows
- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/release.yml` - Automated releases

### Release Scripts
- `release.ps1` - PowerShell release script (Windows)
- `release.sh` - Bash release script (Linux/Mac)

### Documentation
- Updated `README.md` with installation and release info
- `CONTRIBUTING.md` with contribution guidelines

## 🔧 How It Works

### CI Workflow (`.github/workflows/ci.yml`)
- **Triggers**: Push to main/develop, PRs to main
- **Tests**: Node.js 18.x and 20.x
- **Steps**: Install → Lint → Build → Test → Pack

### Release Workflow (`.github/workflows/release.yml`)
- **Triggers**: Push tags matching `v*` (e.g., v1.0.1)
- **Steps**: Build → Test → Publish to npm → Create GitHub release

### Release Script (`release.ps1`)
- Validates branch and working directory
- Runs tests and build
- Bumps version in package.json
- Creates and pushes git tag
- Triggers automated release

## 🎯 Benefits

1. **Consistency**: Every release follows the same process
2. **Quality**: Automated testing prevents broken releases
3. **Speed**: One command creates and publishes a release
4. **Traceability**: Full changelog and release notes
5. **npm Integration**: Automatic publishing to npm registry
6. **User Experience**: Clear installation instructions

## 📋 Checklist for First Release

- [ ] Set up NPM_TOKEN in GitHub secrets
- [ ] Test the build locally: `npm run build`
- [ ] Test the linting: `npm run lint`
- [ ] Create initial commit and push to main
- [ ] Run: `.\release.ps1 patch`
- [ ] Verify npm package: https://www.npmjs.com/package/n8n-nodes-pdf2image
- [ ] Test installation in n8n: Settings → Community Nodes → Install → `n8n-nodes-pdf2image`

## 🆘 Troubleshooting

### Common Issues

1. **NPM_TOKEN not set**:
   ```
   Error: npm ERR! need auth
   ```
   → Add NPM_TOKEN to GitHub repository secrets

2. **Package already exists**:
   ```
   Error: npm ERR! 403 Forbidden
   ```
   → Bump version number or check npm package name

3. **Build fails**:
   ```
   Error: TypeScript compilation failed
   ```
   → Fix TypeScript errors and run `npm run build` locally

4. **Linting fails**:
   ```
   Error: ESLint found issues
   ```
   → Run `npm run lintfix` or fix manually

## 🎉 Success!

Your n8n node is now ready for automated releases! Users can install it with:

**Settings > Community Nodes > Install > `n8n-nodes-pdf2image`**
