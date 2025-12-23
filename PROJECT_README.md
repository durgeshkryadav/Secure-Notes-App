# Secure Notes App

A full-stack secure notes application with end-to-end encryption, built with React and Node.js.

## 📁 Project Structure

```
Secure Notes App/
├── backend/              # Node.js + Express + MongoDB backend
│   ├── app/             # Application code
│   ├── package.json     # Backend dependencies
│   ├── tsconfig.json    # TypeScript config
│   └── README.md        # Backend documentation
├── frontend/            # React + TypeScript frontend
│   ├── src/            # Source code
│   ├── package.json    # Frontend dependencies
│   └── README.md       # Frontend documentation
├── API_DOCUMENTATION.md # Complete API reference
├── README.md           # This file
├── QUICK_START.md      # Quick start guide
└── SETUP_GUIDE.md      # Detailed setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally or remote connection
- npm or yarn

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

### 3. Access Application
Open http://localhost:3000 in your browser

## 🔐 Features

- **User Authentication**: Secure JWT-based auth
- **End-to-End Encryption**: AES-256 encryption for notes
- **Responsive UI**: Material-UI components
- **TypeScript**: Full type safety
- **State Management**: Redux Toolkit
- **Protected Routes**: Secure navigation
- **RESTful API**: Clean API design

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Backend README](./backend/README.md) - Backend setup and info
- [Frontend README](./frontend/README.md) - Frontend setup and info
- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing

### Frontend
- React 18
- TypeScript
- Material-UI (MUI v5)
- Redux Toolkit
- React Router v6
- Axios
- CryptoJS (AES encryption)
- Vite

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon
npm run build  # Build TypeScript
npm start      # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🧪 Testing

### Test User Flow
1. Register at http://localhost:3000
2. Login with credentials
3. Create encrypted notes
4. View, edit, delete notes
5. Logout

### API Testing
Use the included Postman collection:
- `Secure_Notes_API.postman_collection.json`

## 🔐 Security

- **Password Security**: Bcrypt hashing with salt
- **JWT Tokens**: Secure token-based auth (24h expiry)
- **Client-Side Encryption**: Notes encrypted before sending to server
- **Server Security**: Helmet, CORS, HPP protection
- **Input Validation**: Express-validator for all inputs

## 📝 License

This project is part of an assignment for Associate Software Engineer position.

## 👨‍💻 Author

Durgesh Yadav

## 🤝 Contributing

This is an assignment project. Not open for contributions at this time.

---

**Happy Coding! 🚀**
