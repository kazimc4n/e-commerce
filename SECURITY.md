# Security Policy

## Supported Versions

This project is currently in development as an internship project for Atez Software Technologies.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to kazim_can@outlook.com.tr. All security vulnerabilities will be promptly addressed.

## Security Measures

This project implements several security measures:

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### Input Validation
- Server-side validation using express-validator
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting to prevent abuse

### Database Security
- Parameterized queries to prevent SQL injection
- User role separation
- Database connection pooling

### Environment Security
- Environment variables for sensitive data
- Secure password policies
- JWT secret key protection

## Security Considerations for Deployment

When deploying this application to production:

1. Use strong, unique passwords for database users
2. Configure HTTPS/SSL certificates
3. Set up proper firewall rules
4. Regularly update dependencies
5. Monitor application logs
6. Use secure environment variable management
7. Implement proper backup strategies

## Contact

For security-related questions or concerns, please contact:
- Email: kazim_can@outlook.com.tr
- Organization: Atez Software Technologies 