# Contributing to n8n-nodes-pdf2image

Thank you for your interest in contributing! This document provides guidelines for contributing to this n8n community node.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/n8n-pdf2image.git
   cd n8n-pdf2image
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit TypeScript files in the `nodes/` directory
   - Follow the existing code style and patterns
   - Add appropriate error handling

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm pack  # Test packaging
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   ```

## Code Style

- Use TypeScript for all node implementations
- Follow the existing code formatting (Prettier is configured)
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Handle errors appropriately with `NodeOperationError`

## Testing

- Ensure your changes don't break the build (`npm run build`)
- Test with different PDF files and configurations
- Verify error handling works correctly
- Test in an actual n8n instance if possible

## Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run build
   ```

3. **Create a pull request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots if applicable

4. **Wait for review**
   - Address any feedback
   - Keep the branch updated with main

## Release Process

Only maintainers can create releases. The process is automated:

1. Merge approved PRs to main
2. Run the release script:
   ```bash
   ./release.ps1 patch  # or minor/major
   ```
3. GitHub Actions handles the rest automatically

## Reporting Issues

When reporting issues, please include:

- n8n version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample PDF file (if relevant)

## Getting Help

- Check existing issues and discussions
- Create a new issue with detailed information
- Tag maintainers if urgent

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Follow the golden rule

Thank you for contributing! 🎉
