# 🔐 Secure Authentication System

A comprehensive user authentication system built with Node.js, Express, and SQLite featuring secure registration, login, JWT-based sessions, and role-based access control.

## ✨ Features

- **Secure User Registration & Login**
  - Email validation and password strength requirements
  - bcrypt password hashing with configurable salt rounds
  - Input validation and sanitization

- **JWT-Based Authentication**
  - Stateless token-based authentication
  - Token blacklisting for secure logout
  - Configurable token expiration

- **Role-Based Access Control (RBAC)**
  - User and admin roles
  - Protected routes with role verification
  - Middleware for fine-grained permissions

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting for API endpoints
  - CORS configuration
  - SQL injection prevention
  - XSS protection

- **Database Management**
  - SQLite database with proper schema
  - User management with soft deletes
  - Token blacklisting system

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd FS/AUTHENTICATION
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application:**
   - Open your browser to `http://localhost:3000`
   - The database will be created automatically on first run

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Protected Endpoints

#### Dashboard (Authenticated Users)
```http
GET /api/protected/dashboard
Authorization: Bearer <token>
```

#### User Data (User/Admin Role)
```http
GET /api/protected/user-data
Authorization: Bearer <token>
```

#### Admin Panel (Admin Role Only)
```http
GET /api/protected/admin-panel
Authorization: Bearer <token>
```

#### Admin Users List (Admin Role Only)
```http
GET /api/protected/admin/users
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

### Token Security
- JWT tokens with configurable expiration
- Token blacklisting on logout
- Automatic token validation on protected routes

### Database Security
- Parameterized queries prevent SQL injection
- Password hashing with bcrypt
- User data validation and sanitization

## 🏗️ Project Structure

```
FS/AUTHENTICATION/
├── middleware/
│   ├── auth.js          # Authentication & authorization middleware
│   └── validation.js    # Input validation middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── protected.js     # Protected routes with RBAC
├── public/
│   ├── index.html       # Frontend interface
│   ├── styles.css       # Styling
│   └── script.js        # Frontend JavaScript
├── database.js          # Database operations
├── server.js            # Express server setup
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🧪 Testing the System

### Using the Web Interface

1. Open `http://localhost:3000` in your browser
2. Register a new account or login with existing credentials
3. Test protected routes and role-based access
4. Try the logout functionality

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

**Access Protected Route:**
```bash
curl -X GET http://localhost:3000/api/protected/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `DB_PATH` | SQLite database path | ./database.sqlite |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `JWT_EXPIRES_IN` | Token expiration time | 24h |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### User Roles

- **user**: Default role, access to user-specific endpoints
- **admin**: Full access to all endpoints including admin panel

## 🚀 Production Deployment

1. **Set production environment:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-production-secret-key
   ```

2. **Update CORS origins:**
   ```javascript
   // In server.js
   origin: ['https://yourdomain.com']
   ```

3. **Use a production database:**
   - Consider PostgreSQL or MySQL for production
   - Update database configuration accordingly

4. **Enable HTTPS:**
   - Use reverse proxy (nginx) or load balancer
   - Ensure all cookies are secure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔍 Troubleshooting

### Common Issues

**"JWT_SECRET is required"**
- Make sure you've copied `.env.example` to `.env`
- Set a strong JWT_SECRET value

**"Database locked" error**
- Ensure only one instance of the server is running
- Check file permissions on the database file

**Rate limiting errors**
- Wait for the rate limit window to reset
- Adjust rate limiting settings in `.env`

**Token expired errors**
- Login again to get a fresh token
- Adjust `JWT_EXPIRES_IN` if needed

For more help, check the server logs or create an issue in the repository.