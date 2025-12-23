# Secure Notes App - Backend

Backend API for the Secure Notes application built with Node.js, Express, TypeScript, and MongoDB.

## 📁 Location
This is the backend folder of the Secure Notes App.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file or use the existing one:
```env
NODE_ENV=development
PORT=5000
MONGO_APP_URL=mongodb://localhost:27017/secure-notes
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h
```

### 3. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server will run on: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes (Protected)
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note

## 🔐 Security Features
- JWT authentication
- Bcrypt password hashing
- MongoDB injection protection
- CORS enabled
- Helmet security headers
- Request validation

## 📚 Documentation
See parent folder for complete API documentation:
- `../API_DOCUMENTATION.md`
- `../README.md`
- `../SETUP_GUIDE.md`

## 🛠️ Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Winston for logging
