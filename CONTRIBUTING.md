# Contributing to Atez E-commerce Platform

Thank you for your interest in contributing to the Atez Software Technologies E-commerce Platform! This document provides guidelines for contributing to this internship project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows professional development standards. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm run install:all`
4. Set up your development environment following the README
5. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Process

### Backend Development
- Follow RESTful API design principles
- Use proper HTTP status codes
- Implement proper error handling
- Add input validation for all endpoints
- Use parameterized queries to prevent SQL injection
- Follow the MVC pattern (Model-View-Controller)

### Frontend Development
- Use functional components with hooks
- Implement proper state management with Context API
- Follow responsive design principles
- Add proper loading and error states
- Use TypeScript where beneficial
- Follow accessibility guidelines

### Database Changes
- Create migration scripts for schema changes
- Update seed data if necessary
- Ensure backward compatibility
- Document schema changes

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the CHANGELOG.md
5. Create a clear pull request description
6. Reference any related issues

### Pull Request Template
```
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## Code Style Guidelines

### JavaScript/Node.js
- Use ES6+ features
- Use async/await instead of callbacks
- Use descriptive variable names
- Add JSDoc comments for functions
- Use camelCase for variables and functions
- Use PascalCase for classes and components

### React
- Use functional components
- Use custom hooks for reusable logic
- Keep components small and focused
- Use proper prop validation
- Follow the single responsibility principle

### CSS/Tailwind
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Follow mobile-first responsive design
- Use semantic HTML elements

### Database
- Use descriptive table and column names
- Follow naming conventions (snake_case for database)
- Add proper indexes for performance
- Use foreign key constraints

## Testing

### Backend Testing
- Write unit tests for controllers and middleware
- Test API endpoints with proper HTTP codes
- Test error handling scenarios
- Mock external dependencies

### Frontend Testing
- Test component rendering
- Test user interactions
- Test API integration
- Test responsive behavior

## Documentation

- Update README.md for significant changes
- Document new API endpoints
- Add inline code comments
- Update configuration examples
- Keep documentation current with code changes

## Commit Message Guidelines

Use conventional commit messages:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` test additions or changes
- `chore:` maintenance tasks

Example: `feat: add product search functionality`

## Issue Reporting

When reporting issues:
1. Check if the issue already exists
2. Use the issue template if available
3. Provide steps to reproduce
4. Include error messages and logs
5. Specify your environment details

## Development Environment

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose
- Git for version control

## Questions and Support

For questions about contributing:
- Email: kazim_can@outlook.com.tr
- Create an issue with the question label

## Recognition

Contributors will be acknowledged in the project documentation and commit history.

Thank you for contributing to the Atez E-commerce Platform! 