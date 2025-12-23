# Secure Notes App - Backend API

A production-ready RESTful API for secure note management with JWT authentication, AES encryption, and enterprise-grade security features built with TypeScript, Express.js, and MongoDB.

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with secure token generation and validation
- **Password Security**: bcrypt hashing with salt rounds for secure password storage
- **Note Management**: Full CRUD operations for encrypted notes
- **End-to-End Encryption**: Client-side AES encryption of note content
- **Search & Pagination**: Search notes by title with pagination support

### Security Features
- **JWT Token Authentication**: Secure token-based authentication with expiry
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: HTTP headers security middleware
- **HPP Protection**: HTTP Parameter Pollution prevention
- **Input Validation**: express-validator for request validation
- **Password Hashing**: bcrypt with automatic salt generation
- **Encrypted Storage**: Notes stored with client-side encryption

### Production Ready
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Centralized error handling middleware
- **Logging**: Winston logger with file and console transports
- **Graceful Shutdown**: Proper cleanup of database connections and server
- **Environment Configuration**: Secure environment variable management
- **Request Compression**: gzip compression for API responses
- **Path Aliases**: Clean import statements with TypeScript path mapping

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.1
- **Database**: MongoDB with Mongoose 7.5 ODM
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Password Hashing**: bcrypt 5.1
- **Encryption**: crypto-js 4.1 (client-side)
- **Validation**: express-validator 7.0
- **Logging**: Winston 3.11
- **Security**: Helmet, HPP, CORS

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### Setup Steps

1. **Clone the repository** (if not already done)
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGO_APP_URL=mongodb+srv://username:password@cluster.mongodb.net/database?appName=Cluster0
MONGO_DEBUG=false

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRY=7d

# Encryption (for backend reference - encryption happens on frontend)
ENCRYPTION_KEY=your-32-character-encryption-key
```

4. **Development Mode**
```bash
npm run dev
```

5. **Production Build**
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── app/
│   ├── common/                    # Shared utilities and configurations
│   │   ├── Constants.ts           # Application constants
│   │   ├── Database.ts            # MongoDB connection handler
│   │   ├── enum/
│   │   │   └── Server.ts          # Server enums (exit codes, etc.)
│   │   ├── exceptions/
│   │   │   └── HttpException.ts   # Custom HTTP exceptions
│   │   ├── interfaces/
│   │   │   ├── IAuthRequest.ts    # Authenticated request interface
│   │   │   ├── ILooseObject.ts    # Generic object interface
│   │   │   ├── IResponse.ts       # Response interface
│   │   │   └── IRoutes.ts         # Routes interface
│   │   └── middlewares/
│   │       ├── error.ts           # Error handling middleware
│   │       ├── jwt.validator.ts   # JWT authentication middleware
│   │       └── schema.validator.ts # Request validation middleware
│   ├── config/
│   │   ├── config.ts              # Environment configuration
│   │   └── locales/
│   │       ├── en.ts              # English locale strings
│   │       └── index.ts           # Locale exports
│   ├── controllers/
│   │   ├── AuthController.ts      # Authentication endpoints handler
│   │   └── NotesController.ts     # Notes CRUD endpoints handler
│   ├── models/
│   │   ├── User.ts                # User model with bcrypt hooks
│   │   └── Note.ts                # Note model with encryption support
│   ├── routes/
│   │   └── index.ts               # API route definitions
│   ├── services/
│   │   ├── UserService.ts         # User business logic
│   │   └── NotesService.ts        # Notes business logic
│   ├── utils/
│   │   ├── common.ts              # Common utility functions
│   │   ├── crypto.ts              # Encryption utilities
│   │   ├── logger.ts              # Winston logger configuration
│   │   └── util.ts                # Helper utilities
│   ├── validators/
│   │   ├── auth.validator.ts      # Auth request validators
│   │   └── notes.validator.ts     # Notes request validators
│   ├── app.ts                     # Express application setup
│   └── server.ts                  # Server entry point
├── logs/                          # Application logs (auto-generated)
├── dist/                          # Compiled JavaScript (auto-generated)
├── .env                           # Environment variables (create this)
├── nodemon.json                   # Nodemon configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## API Endpoints

### Base URL
```
Production: https://secure-notes-app-pdct.onrender.com
Local: http://localhost:5001
```

### Health Check
```http
GET /api/health
```
Returns API status and timestamp.

**Response:**
```json
{
  "success": true,
  "message": "Secure Notes API is running",
  "timestamp": "2025-12-24T00:00:00.000Z"
}
```

---

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 6 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "createdAt": "2025-12-24T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    }
  }
}
```

---

### Notes Endpoints (Protected)

All notes endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <jwt_token>
```

**Optional Query Parameters:**
- `search`: Search notes by title
- `page`: Page number for pagination
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f191e810c19729de860ea",
        "title": "My First Note",
        "content": "U2FsdGVkX1...", // Encrypted content
        "createdAt": "2025-12-24T00:00:00.000Z",
        "updatedAt": "2025-12-24T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

#### Create New Note
```http
POST /api/notes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "U2FsdGVkX1..." // Pre-encrypted on client
}
```

**Validation Rules:**
- Title: Required, max 200 characters
- Content: Required (encrypted string)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "title": "My Note Title",
    "content": "U2FsdGVkX1...",
    "createdAt": "2025-12-24T00:00:00.000Z",
    "updatedAt": "2025-12-24T00:00:00.000Z"
  }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## Security Implementation

### Password Security
- **bcrypt Hashing**: Automatic password hashing with 10 salt rounds
- **Pre-save Hook**: Passwords are hashed before saving to database
- **Compare Method**: Secure password comparison in User model
- **Password Field**: Excluded from queries by default (select: false)

### JWT Authentication
- **Token Generation**: Signed with HS256 algorithm
- **Token Expiry**: 24 hours for access tokens, 7 days for refresh
- **Token Validation**: Middleware validates on every protected route
- **User Context**: Decoded user attached to request object

### Data Encryption
- **Client-Side Encryption**: Notes encrypted on frontend before transmission
- **AES Algorithm**: Industry-standard Advanced Encryption Standard
- **Encrypted Storage**: Notes stored as encrypted strings in database
- **Frontend Decryption**: Content decrypted only on authorized client

### HTTP Security
- **Helmet**: Sets secure HTTP headers
- **CORS**: Configured cross-origin policies
- **HPP**: Prevents HTTP parameter pollution
- **Compression**: gzip compression for responses
- **Rate Limiting**: Can be added via express-rate-limit

## Error Handling

### Centralized Error Middleware
All errors are caught and formatted consistently:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `404` - Not Found
- `500` - Internal Server Error

## Logging

### Winston Logger Configuration
- **Console Transport**: Development logging
- **File Transport**: Production logs stored in `logs/` directory
- **Log Levels**: error, warn, info, http, debug
- **Log Format**: Timestamp, level, message, stack traces

### Log Files
- `logs/error.log` - Error-level logs only
- `logs/combined.log` - All log levels
- Auto-rotation and compression supported

## Development

### NPM Scripts
```bash
npm run inst        # Install dependencies
npm run dev         # Start development server with nodemon
npm run build       # Compile TypeScript to JavaScript
npm run build:tsc   # Alternative build command
npm start           # Start production server
npm run lint        # Lint TypeScript files
npm run lint:fix    # Auto-fix linting issues
```

### TypeScript Configuration
- **Target**: ES2020
- **Module**: CommonJS
- **Path Aliases**: `@/`, `@common/`, `@config/`, `@controllers/`, etc.
- **Strict Mode**: Enabled for maximum type safety
- **Source Maps**: Generated for debugging

### Nodemon Configuration
Watches `.ts` files and auto-restarts on changes in development.

## Deployment

### Environment Variables (Production)
Ensure these are set in your hosting environment:
- `NODE_ENV=production`
- Strong, unique JWT secrets (min 32 characters)
- Secure MongoDB connection string
- Proper CORS origins

### Build Process
```bash
npm install
npm run build
npm start
```

### Hosting Platforms
- **Render**: Configured and deployed
- **Heroku**: Compatible with Procfile
- **AWS**: Deploy with PM2 or Docker
- **DigitalOcean**: Node.js droplet ready

### Database
- **MongoDB Atlas**: Cloud-hosted, production-ready
- **Connection Pooling**: Mongoose handles automatically
- **Indexes**: Optimized for user queries and search

## License

This project is part of NITS Solutions (India) Pvt Ltd portfolio.

**GD OFFICE:** UNIT NO. 405, 4th FLOOR, TOWER A, UNITECH CYBER PARK, SECTOR 39, GURGAON-122003

© 2025 All Rights Reserved. NITS Solutions (India) Pvt Ltd | www.nits.ai

## Contributing

For internal development only. Contact the development team for contribution guidelines.

## Support

For issues or questions, contact the development team or create an issue in the repository.
