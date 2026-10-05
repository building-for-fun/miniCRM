## Contributing

Thank you for considering contributing to miniCRM! Please follow these guidelines to help keep the project healthy.

### Code of Conduct

Please read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

### How Can You Contribute?

1. **Report bugs** - Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
2. **Suggest features** - Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. **Submit pull requests** - Follow the PR template and guidelines below

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/minicrm.git`
3. Install dependencies: `npm install`
4. Set up the database: `npx prisma migrate dev`
5. Run the development server: `npm run dev`

### Pull Request Guidelines

- Follow the [code style](.eslintrc.json) and pass linting: `npm run lint`
- Write clear commit messages
- Ensure all tests pass
- Link any related issues in your PR description
- Squash commits before merging

### Adding New Features

1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
2. Implement your feature
3. Add or update tests as needed
4. Run `npm run build` to ensure the build passes
5. Submit a pull request using the template

### Bug Reports

- Use the bug report template
- Include steps to reproduce the issue
- Include your environment (OS, Node version, etc.)
- Include relevant error messages or screenshots