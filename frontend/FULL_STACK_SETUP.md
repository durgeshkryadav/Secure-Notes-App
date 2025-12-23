# 🚀 Complete Application Setup Guide

## Secure Notes App - Full Stack Setup

This guide will help you run both the backend and frontend together.

---

## Prerequisites

- ✅ Node.js v18 or higher
- ✅ MongoDB installed and running
- ✅ npm or yarn package manager

---

## Quick Start (Recommended)

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App"
npm install  # If not already done
npm run dev
```
Backend will start on: http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App\frontend"
npm install  # If not already done
npm run dev
```
Frontend will start on: http://localhost:3000

**Terminal 3 - MongoDB (if not running as service):**
```powershell
mongod
```

---

## Step-by-Step Setup

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App"

# Install dependencies
npm install

# Create .env file (if not exists)
# Copy the following content to .env:
```

**.env file:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-notes
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
```

```powershell
# Start backend server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected
```

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App\frontend"

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Testing the Application

### 1. Create Account
1. Click "Sign Up" on the login page
2. Enter email: `test@example.com`
3. Enter password: `password123` (minimum 6 characters)
4. Click "Sign Up"
5. You should see success message and redirect to login

### 2. Login
1. Enter your email and password
2. Click "Sign In"
3. You should be redirected to Dashboard

### 3. Create Notes
1. On Dashboard, fill in:
   - Title: "My First Secure Note"
   - Content: "This content is encrypted before sending to server!"
2. Click "Add Note"
3. Note should appear in the grid below

### 4. View Notes
1. Click on any note card
2. Modal dialog opens showing full decrypted content
3. View creation and update timestamps

### 5. Delete Notes
1. Click the trash icon on any note card
2. Confirm deletion
3. Note is removed from the list

### 6. Logout
1. Click "Logout" button in top-right
2. You should be redirected to login page
3. Token is cleared from localStorage

---

## Verification Checklist

### Backend Health Check
```powershell
# Test backend is running
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Secure Notes API is running",
  "timestamp": "2024-12-23T..."
}
```

### Frontend Build Check
```powershell
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App\frontend"
npm run build
```

Should complete without errors.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (localhost:3000)                          │  │
│  │  - Material-UI Components                            │  │
│  │  - Redux Toolkit State                               │  │
│  │  - AES Encryption (CryptoJS)                         │  │
│  │  - Axios HTTP Client                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTPS/HTTP
┌─────────────────────────────────────────────────────────────┐
│                  API SERVER (Backend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js (localhost:5000)                         │  │
│  │  - JWT Authentication                                │  │
│  │  - API Routes                                        │  │
│  │  - Validation                                        │  │
│  │  - Error Handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                        │  │
│  │  - users (email, hashed password)                    │  │
│  │  - notes (encrypted content, userId)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow Example

### Creating a Note

1. **User Action (Frontend)**
   ```typescript
   // User types: "Secret Message"
   const content = "Secret Message";
   ```

2. **Client-Side Encryption**
   ```typescript
   // Encrypt before sending
   const encrypted = encryptText(content);
   // Result: "U2FsdGVkX1..."
   ```

3. **API Request**
   ```typescript
   // Redux action dispatched
   dispatch(createNote({
     title: "My Note",
     content: encrypted // Already encrypted
   }));
   ```

4. **Axios Interceptor**
   ```typescript
   // Automatically adds JWT token
   headers: {
     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
   }
   ```

5. **Backend Processing**
   ```typescript
   // Validates JWT
   // Validates input
   // Saves encrypted content (never sees plain text)
   // Returns saved note
   ```

6. **Frontend Update**
   ```typescript
   // Redux updates state
   // Component re-renders
   // Note appears in list
   ```

7. **Viewing Note**
   ```typescript
   // When user clicks note
   const decrypted = decryptText(note.content);
   // Displays: "Secret Message"
   ```

---

## Security Features

### 🔐 End-to-End Encryption
- Content encrypted in browser before network transmission
- Backend never sees plain text
- Only user can decrypt with their key

### 🔑 JWT Authentication
- Token-based authentication
- Stateless server
- Token expiration (24 hours)
- Auto-logout on expiration

### 🛡️ Password Security
- Bcrypt hashing with salt
- Never stored in plain text
- Never returned in responses

### 🚫 Input Validation
- Email format validation
- Password strength requirements
- Content length limits
- SQL injection protection (via Mongoose)

---

## Troubleshooting

### Frontend won't start
```powershell
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection error
1. Check MongoDB is running: `mongod`
2. Verify .env file exists with correct values
3. Check port 5000 is not in use

### CORS errors
- Backend CORS is configured for http://localhost:3000
- Don't access frontend from different origin

### Authentication errors
```powershell
# Clear browser storage
# In browser console:
localStorage.clear();
# Reload page
```

### Encryption errors
- Check ENCRYPTION_KEY in frontend constants
- Ensure CryptoJS is installed
- Verify encrypted content format

---

## API Testing with Postman

### 1. Register
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `token` from response.

### 3. Get Notes
```http
GET http://localhost:5000/api/notes
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Create Note
```http
POST http://localhost:5000/api/notes
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Note",
  "content": "U2FsdGVkX1..." (encrypted content)
}
```

---

## Development Tips

### Hot Reload
Both servers support hot reload:
- Frontend: Vite HMR (instant)
- Backend: Nodemon (on file save)

### Debugging
```typescript
// Frontend - Redux DevTools
// Install Redux DevTools browser extension

// Backend - Console logs
console.log('Debug info:', data);

// Frontend - React DevTools
// Install React DevTools browser extension
```

### Environment Variables
```env
# Backend .env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-notes
JWT_SECRET=change-me-in-production
JWT_EXPIRE=24h

# Frontend - No .env needed (uses Vite proxy)
```

---

## Production Deployment

### Frontend (Vercel/Netlify)
```powershell
npm run build
# Upload dist/ folder
```

### Backend (Heroku/Railway)
```powershell
# Set environment variables
# Deploy with Git
git push heroku main
```

### Environment Variables for Production
- Change JWT_SECRET to strong random string
- Use production MongoDB URI
- Enable HTTPS
- Set CORS to production domain

---

## 📊 Monitoring

### Check Application Status
```powershell
# Backend logs
tail -f logs/app.log

# Frontend console
# Open browser DevTools → Console

# MongoDB
mongo
> use secure-notes
> db.users.count()
> db.notes.count()
```

---

## 🎉 Success Criteria

Your application is working correctly if:

- ✅ Can register new user
- ✅ Can login with credentials
- ✅ Token persists after page refresh
- ✅ Can create encrypted notes
- ✅ Can view and decrypt notes
- ✅ Can delete notes
- ✅ Can logout successfully
- ✅ Protected routes redirect to login
- ✅ No console errors
- ✅ Responsive on mobile/tablet/desktop

---

## 📚 Additional Resources

- [Backend API Documentation](../API_DOCUMENTATION.md)
- [Frontend README](README.md)
- [Quick Start Guide](QUICK_START.md)
- [Implementation Summary](IMPLEMENTATION_COMPLETE.md)

---

## Support

For issues or questions:
1. Check console logs (both frontend and backend)
2. Verify all services are running
3. Check network tab in DevTools
4. Review error messages

---

**Happy Coding! 🚀**
