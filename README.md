# Secure Notes App - Backend

A secure notes management application with JWT authentication and AES encryption.

## Features

- User registration and authentication with JWT
- Secure note storage with AES encryption
- RESTful API design
- TypeScript with strict typing
- MongoDB with Mongoose ODM
- bcrypt password hashing
- Express.js framework

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- crypto-js (AES encryption)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Notes (Protected Routes)
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `DELETE /api/notes/:id` - Delete a note

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGO_APP_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token
- `JWT_EXPIRY` - JWT token expiry time
- `ENCRYPTION_KEY` - AES encryption key

## Project Structure

```
app/
├── common/
│   ├── Constants.ts
│   ├── Database.ts
│   ├── interfaces/
│   └── middlewares/
├── config/
│   ├── config.ts
│   └── locales/
├── controllers/
│   ├── AuthController.ts
│   └── NotesController.ts
├── models/
│   ├── User.ts
│   └── Note.ts
├── routes/
│   └── index.ts
├── services/
│   ├── AuthService.ts
│   └── NotesService.ts
├── utils/
│   ├── common.ts
│   ├── crypto.ts
│   ├── jwt.ts
│   └── logger.ts
├── app.ts
└── server.ts
```
