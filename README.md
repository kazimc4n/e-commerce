# Atez Software Technologies E-commerce Platform

Modern, full-stack e-commerce platform built with Node.js, PostgreSQL, and React. Perfect for internship projects and learning purposes.

## Features

### Backend (Node.js + PostgreSQL)
- **Authentication & Authorization**: JWT-based auth with role management
- **Product Management**: Full CRUD operations with categories, images, and variants
- **Shopping Cart**: Session-based cart management
- **User Management**: Profile management, password changes
- **Search & Filtering**: Advanced product search and filtering
- **Database**: PostgreSQL with proper relationships and indexes
- **Security**: Helmet, rate limiting, input validation
- **API Documentation**: RESTful API design

### Frontend (React + Tailwind CSS)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **State Management**: Context API for auth and cart
- **Routing**: React Router for navigation
- **Forms**: React Hook Form with validation
- **Notifications**: Toast notifications for user feedback
- **Loading States**: Proper loading and error handling
- **Mobile Responsive**: Works on all device sizes

### DevOps & Deployment
- **Docker**: Containerized application with docker-compose
- **Nginx**: Reverse proxy and static file serving
- **Environment**: Configurable environment variables
- **Database**: PostgreSQL with automatic migrations

## Prerequisites

- **Docker & Docker Compose** (recommended)
- OR **Node.js 18+** and **PostgreSQL 15+** (for local development)

## Quick Start (Docker)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd e-commerce-1
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start with Docker:**
   ```bash
   # Start all services
   npm run docker:up
   
   # Install dependencies for both client and server
   npm run install:all
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Access the application:**
   - **Frontend**: http://localhost (port 80)
   - **Backend API**: http://localhost:3001/api
   - **Database**: localhost:5432

## Local Development Setup

If you prefer to run without Docker:

1. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install
   ```

2. **Setup PostgreSQL:**
   - Create database: `ecommerce_db`
   - Create user: `ecommerce_user`
   - Set password: `secure_password_2024`

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed with sample data:**
   ```bash
   npm run db:seed
   ```

6. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

## Sample Data

The seeding script creates:

### Admin User
- **Email**: admin@atezsoftware.com
- **Password**: admin123
- **Role**: admin

### Categories
- Elektronik (Electronics)
- Giyim (Clothing)
- Ev & Yaşam (Home & Living)
- Spor & Outdoor (Sports & Outdoor)
- Kitap & Hobi (Books & Hobbies)

### Sample Products
- iPhone 15 Pro 128GB
- Samsung Galaxy S24 Ultra
- MacBook Air M3 13"
- Various clothing items
- Home appliances
- Sports equipment
- Books and hobby items

## Available Scripts

### Root Directory
```bash
npm start              # Start production server
npm run dev           # Start development server
npm run build         # Build client for production
npm run install:all   # Install all dependencies
npm run docker:up     # Start Docker containers
npm run docker:down   # Stop Docker containers
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed database with sample data
```

### Client Directory
```bash
cd client
npm start             # Start React development server
npm run build         # Build React app for production
npm test              # Run tests
```

## Project Structure

```
e-commerce-1/
├── server/                 # Backend (Node.js)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   └── server.js         # Main server file
├── client/               # Frontend (React)
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main App component
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image definition
├── nginx.conf           # Nginx configuration
└── package.json         # Main package file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove cart item
- `DELETE /api/cart` - Clear cart

## Environment Variables

Key environment variables (see `.env.example`):

```bash
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=secure_password_2024

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing

The application includes:
- Input validation on all forms
- Error handling with user-friendly messages
- Loading states for all async operations
- Responsive design testing
- API endpoint testing

### Test Admin Features
1. Login with admin credentials
2. Create/edit categories
3. Add/update products
4. Manage user accounts

### Test User Features
1. Register new account
2. Browse products and categories
3. Add items to cart
4. Update profile information

## Production Deployment

For production deployment:

1. **Build the client:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   NODE_ENV=production
   # Update database credentials
   # Use strong JWT secret
   ```

3. **Run with Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Setup SSL (recommended):**
   - Use Let's Encrypt with Certbot
   - Update nginx.conf for HTTPS

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and authentication
- **categories**: Product categories with hierarchical support
- **products**: Product information with variants and images
- **cart_items**: Shopping cart management
- **orders**: Order processing and history
- **reviews**: Product reviews and ratings
- **addresses**: User shipping addresses

## Contributing

This is an internship project for Atez Software Technologies. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues:
- Create an issue in the repository
- Contact: kazim_can@outlook.com.tr

## License

This project is created for educational purposes as part of an internship program.

---

**Built with by Atez Software Technologies**

*Perfect for learning modern web development with Node.js, React, and PostgreSQL!*