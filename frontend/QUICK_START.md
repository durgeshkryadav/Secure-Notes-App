# Secure Notes Frontend - Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- Backend server running on http://localhost:5000

## Steps to Run

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Backend Server** (in a separate terminal):
   ```bash
   cd ../
   npm run dev
   ```
   Backend should be running on http://localhost:5000

3. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:3000

4. **Open Application**:
   Navigate to http://localhost:3000 in your browser

5. **Create Account**:
   - Click "Sign Up" link
   - Enter email and password (minimum 6 characters)
   - Click "Sign Up" button
   - You'll be redirected to login page

6. **Login**:
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to the Dashboard

7. **Use the App**:
   - Create notes with title and content
   - Notes are automatically encrypted before being sent to backend
   - View, edit, and delete your secure notes

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check console for API errors
- Verify CORS is enabled on backend

### Authentication Issues
- Clear browser localStorage: `localStorage.clear()`
- Check JWT token in localStorage
- Verify backend JWT secret matches

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Default Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:5000 (proxied through Vite)

## Notes
- All note content is encrypted using AES-256 on the client side
- JWT tokens are stored in localStorage
- Tokens expire after 24 hours (configurable in backend)
