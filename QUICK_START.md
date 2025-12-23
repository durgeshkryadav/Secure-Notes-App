# Quick Start Guide - Secure Notes App

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js installed (v14+): Run `node --version`
- ✅ npm installed: Run `npm --version`
- ✅ MongoDB installed and running

---

## Installation (5 minutes)

### Step 1: Navigate to Project
Open terminal/command prompt and run:
```bash
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App"
```

### Step 2: Install Dependencies
```bash
npm install
```
This will take 2-3 minutes. You should see packages being installed.

### Step 3: Verify MongoDB is Running

**Windows:**
```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# If not running, start it:
net start MongoDB
```

**Or start MongoDB manually:**
```bash
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

### Step 4: Check Environment Variables
The `.env` file is already created with default values. 

**Important:** If MongoDB is running on a different port or host, update `MONGO_APP_URL` in `.env`

### Step 5: Start the Server
```bash
npm run dev
```

You should see:
```
==========================================
🚀 Secure Notes API (development) listening on port 5000
==========================================
Database is connected
Database is ready to use
```

---

## Quick Test (2 minutes)

### Test 1: Health Check
Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected output:
```json
{
  "success": true,
  "message": "Secure Notes API is running",
  "timestamp": "..."
}
```

### Test 2: Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected output:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected output:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profile": {
      "_id": "...",
      "email": "test@example.com",
      "createdAt": "..."
    }
  }
}
```

**Copy the token from the response!** You'll need it for the next tests.

### Test 4: Create a Note
Replace `YOUR_TOKEN_HERE` with the token from login:
```bash
curl -X POST http://localhost:5000/api/notes -H "Authorization: Bearer YOUR_TOKEN_HERE" -H "Content-Type: application/json" -d "{\"title\":\"My First Note\",\"content\":\"This is my first secure note!\"}"
```

Expected output:
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "...",
    "title": "My First Note",
    "content": "This is my first secure note!",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Test 5: Get All Notes
```bash
curl -X GET http://localhost:5000/api/notes -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected output:
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "notes": [
      {
        "_id": "...",
        "userId": "...",
        "title": "My First Note",
        "content": "This is my first secure note!",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 1
  }
}
```

---

## Using Postman (Recommended)

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Secure_Notes_API.postman_collection.json`

2. **Set Base URL:**
   - Click on the collection name
   - Go to "Variables" tab
   - Set `baseUrl` to `http://localhost:5000/api`

3. **Test in Order:**
   - Run "Register" request
   - Run "Login" request (token is saved automatically)
   - Run "Create Note" request
   - Run "Get All Notes" request
   - Run "Delete Note" request

The token is automatically saved after login, so you don't need to copy-paste it!

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoDB connection failed"
**Solution:**
- Ensure MongoDB is running
- Check MongoDB URL in `.env`
- Default: `mongodb://localhost:27017/secure-notes`

### Issue: "Port 5000 already in use"
**Solution:** Change port in `.env`:
```
PORT=5001
```

### Issue: "JWT token invalid"
**Solution:** 
- Make sure you're using the format: `Bearer <token>`
- Check if token has expired (24 hours default)
- Login again to get a new token

### Issue: TypeScript errors
**Solution:**
```bash
npm run build
```

---

## What's Next?

### 1. Explore All Endpoints
Check `API_DOCUMENTATION.md` for complete API reference.

### 2. Test Advanced Features
- Search notes: `/api/notes?search=keyword`
- Pagination: `/api/notes?page=1&limit=10`

### 3. Integrate with Frontend
See `FRONTEND_INTEGRATION.md` for React examples and encryption utilities.

### 4. Review Security
Check `IMPLEMENTATION_SUMMARY.md` for all security features implemented.

---

## Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

---

## Project Files Quick Reference

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `API_DOCUMENTATION.md` | Complete API docs |
| `SETUP_GUIDE.md` | Detailed setup |
| `FRONTEND_INTEGRATION.md` | Frontend guide |
| `IMPLEMENTATION_SUMMARY.md` | Features checklist |
| `QUICK_START.md` | This file |
| `.env` | Configuration |
| `package.json` | Dependencies |

---

## API Endpoints Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | ❌ | Health check |
| `/api/auth/register` | POST | ❌ | Register user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/notes` | GET | ✅ | Get notes |
| `/api/notes` | POST | ✅ | Create note |
| `/api/notes/:id` | DELETE | ✅ | Delete note |

---

## Default Credentials for Testing

You can register any user, but here's an example:
- **Email:** test@example.com
- **Password:** password123 (min 6 characters)

---

## Support

If you encounter any issues:
1. Check the logs in `logs/` directory
2. Review `SETUP_GUIDE.md` for detailed instructions
3. Ensure MongoDB is running
4. Verify all environment variables in `.env`

---

## Success Checklist

- ✅ Server starts without errors
- ✅ Health check returns success
- ✅ Can register a user
- ✅ Can login and get token
- ✅ Can create a note with auth
- ✅ Can retrieve notes
- ✅ Can delete notes

If all checks pass, you're ready to go! 🚀

---

**Next:** See `API_DOCUMENTATION.md` for complete API reference and examples.
