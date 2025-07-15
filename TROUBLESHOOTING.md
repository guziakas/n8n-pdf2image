# GitHub Actions Troubleshooting

## Common Issues and Solutions

### 1. Permission Denied (403) Errors

**Error:**
```
remote: Permission to guziakas/n8n-pdf2image.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/': The requested URL returned error: 403
```

**Solution:**
- ✅ **Fixed**: Added proper permissions to workflows:
  ```yaml
  permissions:
    contents: write
    actions: read
    packages: write
  ```

### 2. NPM Publish Failures

**Error:**
```
npm ERR! need auth
npm ERR! code ENEEDAUTH
```

**Solution:**
1. Create npm token at https://www.npmjs.com/settings/tokens
2. Add as repository secret: `Settings → Secrets → Actions → NPM_TOKEN`

### 3. Build Failures

**Error:**
```
Cannot find module 'some-dependency'
```

**Solution:**
- Ensure `npm ci` is used instead of `npm install` in workflows
- Check that all dependencies are in `package.json`

### 4. Release Tag Already Exists

**Error:**
```
fatal: tag 'v1.0.4' already exists
```

**Solution:**
- Delete existing tag: `git tag -d v1.0.4 && git push origin :refs/tags/v1.0.4`
- Or use next version: `npm version patch`

## Workflow Status

✅ **Manual Release**: Fixed with proper permissions  
✅ **Tag-based Release**: Working  
✅ **CI Pipeline**: Working  
✅ **Package Validation**: Working  

## Quick Commands

```bash
# Check workflow status
gh run list

# Re-run failed workflow
gh run rerun <run-id>

# Create release manually
.\release.ps1 patch
```
