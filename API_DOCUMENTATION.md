# Secure Notes App - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All notes endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Health Check
Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "Secure Notes API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Email already exists
- `400 Bad Request`: Validation errors

---

### 3. Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profile": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `400 Bad Request`: Validation errors

---

### 4. Get All Notes
Retrieve all notes for the authenticated user.

**Endpoint:** `GET /api/notes`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `search`: Search notes by title (string)
- `page`: Page number for pagination (integer)
- `limit`: Items per page (integer)

**Examples:**
- Get all notes: `/api/notes`
- Search notes: `/api/notes?search=meeting`
- Paginated: `/api/notes?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439012",
        "title": "My First Note",
        "content": "U2FsdGVkX1...", // Encrypted content
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "notes": [...],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

---

### 5. Create Note
Create a new note with encrypted content.

**Endpoint:** `POST /api/notes`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Note Title",
  "content": "U2FsdGVkX1..." // Pre-encrypted content from frontend
}
```

**Validation:**
- Title: Required, max 200 characters
- Content: Required (should be encrypted by frontend)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Note Title",
    "content": "U2FsdGVkX1...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Failed to create note

---

### 6. Delete Note
Delete a specific note by ID.

**Endpoint:** `DELETE /api/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Note ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid note ID format
- `404 Not Found`: Note not found
- `403 Forbidden`: Note doesn't belong to user
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to delete note

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds
- Plain passwords are never stored in the database
- Passwords are never returned in API responses

### JWT Token
- Tokens expire after 24 hours (configurable)
- Token includes user ID and email
- Invalid or expired tokens return 401 Unauthorized

### Note Encryption
- Frontend should encrypt note content using AES before sending
- Server stores encrypted content as-is
- Decryption happens on the frontend
- Server never stores plain text content

### Additional Security
- CORS enabled
- Helmet.js for security headers
- HPP (HTTP Parameter Pollution) protection
- Request size limits
- Input validation and sanitization

---

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URL and secrets

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Notes
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"ENCRYPTED_CONTENT_HERE"}'
```

### Delete Note
```bash
curl -X DELETE http://localhost:5000/api/notes/NOTE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Notes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: String (max 200 chars),
  content: String (encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
- `users`: email (unique)
- `notes`: userId, createdAt (compound index)
- `notes`: title (text index for search)
