# Secure Notes App - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## Installation Steps

### 1. Clone or Navigate to Project
```bash
cd "C:\Users\Durgesh Yadav\OneDrive\Desktop\workspace1\Secure Notes App"
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- express
- mongoose
- jsonwebtoken
- bcrypt
- crypto-js
- express-validator
- And more...

### 3. Configure Environment Variables

The `.env` file is already created. Update it with your configuration:

```env
PORT=5000
NODE_ENV=development

# Update this with your MongoDB connection string
MONGO_APP_URL=mongodb://localhost:27017/secure-notes
MONGO_DEBUG=false

# Change these secrets in production!
JWT_SECRET=secure-notes-secret-key-change-this-in-production-2024
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=secure-notes-refresh-secret-key-change-this-2024
JWT_REFRESH_EXPIRY=7d

# Used for server-side encryption if needed
ENCRYPTION_KEY=secure-notes-32-char-key-2024-xx
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 5. Run the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
# Build the project
npm run build

# Start the server
npm start
```

### 6. Verify Installation

The server should start on `http://localhost:5000`

Check the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Secure Notes API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Project Structure

```
Secure Notes App/
├── app/
│   ├── common/
│   │   ├── Constants.ts              # Application constants
│   │   ├── Database.ts               # MongoDB connection
│   │   ├── enum/
│   │   │   └── Server.ts             # Enums
│   │   ├── exceptions/
│   │   │   └── HttpException.ts      # Custom exceptions
│   │   ├── interfaces/
│   │   │   ├── IAuthRequest.ts       # Auth request interface
│   │   │   ├── ILooseObject.ts       # Generic object interface
│   │   │   ├── IResponse.ts          # Response interface
│   │   │   └── IRoutes.ts            # Routes interface
│   │   └── middlewares/
│   │       ├── error.ts              # Error handling middleware
│   │       ├── jwt.validator.ts      # JWT authentication
│   │       └── schema.validator.ts   # Request validation
│   ├── config/
│   │   ├── config.ts                 # App configuration
│   │   └── locales/
│   │       ├── en.ts                 # English locale
│   │       └── index.ts              # Locale loader
│   ├── controllers/
│   │   ├── AuthController.ts         # Auth endpoints logic
│   │   └── NotesController.ts        # Notes endpoints logic
│   ├── models/
│   │   ├── User.ts                   # User schema
│   │   └── Note.ts                   # Note schema
│   ├── routes/
│   │   └── index.ts                  # Route definitions
│   ├── services/
│   │   ├── UserService.ts            # User business logic
│   │   └── NotesService.ts           # Notes business logic
│   ├── utils/
│   │   ├── common.ts                 # Common utilities
│   │   ├── crypto.ts                 # Encryption utilities
│   │   ├── logger.ts                 # Logger configuration
│   │   └── util.ts                   # Helper functions
│   ├── validators/
│   │   ├── auth.validator.ts         # Auth validation rules
│   │   └── notes.validator.ts        # Notes validation rules
│   ├── app.ts                        # Express app setup
│   └── server.ts                     # Server entry point
├── logs/                              # Application logs (auto-generated)
├── .env                               # Environment variables
├── .env.example                       # Example environment file
├── .gitignore                         # Git ignore rules
├── nodemon.json                       # Nodemon configuration
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript configuration
├── README.md                          # Project documentation
├── API_DOCUMENTATION.md               # API documentation
└── Secure_Notes_API.postman_collection.json  # Postman collection
```

---

## Testing the API

### Using Postman

1. Import the Postman collection:
   - Open Postman
   - Click Import
   - Select `Secure_Notes_API.postman_collection.json`

2. Set the base URL variable:
   - Collection > Variables
   - Set `baseUrl` to `http://localhost:5000/api`

3. Test the endpoints in order:
   - Register a user
   - Login (token will be saved automatically)
   - Create a note
   - Get all notes
   - Delete a note

### Using cURL

See the examples in `API_DOCUMENTATION.md`

---

## API Endpoints Summary

### Authentication (No auth required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Notes (JWT auth required)
- `GET /api/notes` - Get all notes
- `GET /api/notes?search=term` - Search notes by title
- `GET /api/notes?page=1&limit=10` - Get paginated notes
- `POST /api/notes` - Create a new note
- `DELETE /api/notes/:id` - Delete a note

### Utility
- `GET /api/health` - Health check
- `GET /` - API information

---

## Architecture Highlights

### Following Existing Pattern
This project strictly follows the architecture from the existing backend folder:
- ✅ Separation of concerns (Controllers, Services, Models)
- ✅ Middleware-based authentication
- ✅ Centralized error handling
- ✅ Response standardization
- ✅ Locale support for messages
- ✅ Logger integration
- ✅ TypeScript with strict typing

### Security Features
1. **Password Security**
   - bcrypt hashing with automatic salt generation
   - Pre-save hook in User model
   - Passwords never exposed in responses

2. **JWT Authentication**
   - Token-based authentication
   - 24-hour expiry (configurable)
   - Middleware for protected routes

3. **Encryption**
   - Content stored encrypted
   - Frontend should encrypt before sending
   - Server-side crypto utilities available

4. **Additional Protection**
   - CORS enabled
   - Helmet for security headers
   - HPP protection
   - Request validation
   - Input sanitization

### Database
- MongoDB with Mongoose ODM
- Indexes for performance (email, userId, title)
- Schema validation
- Timestamps on all documents

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Ensure MongoDB is running
- Check MongoDB URL in `.env`
- Verify MongoDB port (default: 27017)

### Issue: Port Already in Use
**Solution:**
```bash
# Change PORT in .env file
PORT=5001
```

### Issue: JWT Token Invalid
**Solution:**
- Ensure token is included in Authorization header
- Format: `Bearer <token>`
- Check if token has expired (24h default)

### Issue: Module Not Found
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Development Tips

### Auto-reload on Changes
The `npm run dev` command uses nodemon to automatically restart the server when files change.

### TypeScript Compilation
```bash
# Check for TypeScript errors without running
npm run lint

# Build TypeScript to JavaScript
npm run build
```

### View Logs
Logs are stored in the `logs/` directory:
- `logs/all.log` - All logs
- `logs/error.log` - Error logs only

### Database Debugging
Enable MongoDB query debugging:
```env
MONGO_DEBUG=true
```

---

## Production Deployment

### Before Deployment

1. **Update Environment Variables:**
   - Change all secret keys
   - Set `NODE_ENV=production`
   - Use production MongoDB URL
   - Disable MongoDB debug mode

2. **Build the Application:**
   ```bash
   npm run build
   ```

3. **Security Checklist:**
   - [ ] Updated JWT_SECRET
   - [ ] Updated ENCRYPTION_KEY
   - [ ] Set strong passwords
   - [ ] HTTPS enabled
   - [ ] CORS configured for specific origins
   - [ ] Rate limiting implemented (optional)
   - [ ] Environment variables secured

### Deployment Steps

1. Install production dependencies only:
   ```bash
   npm install --production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start with PM2 (recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "secure-notes-api"
   pm2 save
   pm2 startup
   ```

---

## Frontend Integration

See `FRONTEND_INTEGRATION.md` for:
- How to implement client-side encryption
- API usage examples
- Error handling
- Token management

---

## Support

For issues or questions:
1. Check the API documentation
2. Review error logs in `logs/` directory
3. Verify MongoDB connection
4. Ensure all environment variables are set

---

## License

This project is part of an assignment for Associate Software Engineer - React JS position.
