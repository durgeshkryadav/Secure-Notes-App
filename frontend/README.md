# Secure Notes App - Frontend

A secure, encrypted notes application built with React, TypeScript, and Material-UI.

##  Features

- **User Authentication**: Secure login and registration
- **JWT Token Management**: Automatic token handling and refresh
- **AES Encryption**: Client-side encryption for all note content
- **Responsive UI**: Beautiful Material-UI components
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit for predictable state updates
- **Protected Routes**: Secure routing with authentication checks

##  Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI v5)** - Component library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **CryptoJS** - AES encryption
- **Vite** - Build tool

##  Project Structure

```
src/
├── components/           # Reusable components
│   └── ProtectedRoute/  # Route protection component
├── constants/           # App constants and endpoints
├── interface/           # TypeScript interfaces
│   ├── auth.interface.ts
│   └── notes.interface.ts
├── pages/              # Page components
│   ├── Login/
│   ├── Register/
│   └── Dashboard/
├── redux/              # Redux store and slices
│   ├── slices/
│   │   ├── auth.slice.ts
│   │   └── notes.slice.ts
│   ├── store/
│   └── hooks/
├── route/              # Router configuration
├── theme/              # MUI theme configuration
├── utils/              # Utility functions
│   ├── axios.ts        # Axios configuration
│   ├── encryption.ts   # AES encryption/decryption
│   ├── storage.ts      # LocalStorage helpers
│   └── helpers.ts      # General helpers
├── App.tsx             # Root component
└── main.tsx           # Entry point
```

##  Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   
   The app is configured to proxy API requests to `http://localhost:5000`. 
   Make sure your backend is running on port 5000.

##  Running the Application

### Development Mode
```bash
npm run dev
```
This will start the development server on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

##  Security Features

### Client-Side Encryption
All note content is encrypted using AES-256 before being sent to the backend:
- Encryption happens in the browser before API call
- Decryption happens only when displaying notes
- Backend never sees plain text content

### JWT Authentication
- Token stored in localStorage
- Automatically attached to all API requests via Axios interceptors
- Auto-redirect to login on token expiration (401)

### Protected Routes
- Dashboard accessible only to authenticated users
- Automatic redirect to login for unauthenticated access

##  API Integration

The frontend consumes the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Notes (Protected)
- `GET /api/notes` - Fetch all user notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note

All notes endpoints require JWT token in Authorization header.

##  Features Breakdown

### Login Page
- Email and password validation
- Error handling and display
- Auto-redirect if already authenticated
- Link to registration page

### Register Page
- Email format validation
- Password strength check (min 6 characters)
- Password confirmation
- Success message with auto-redirect to login

### Dashboard
- **Top AppBar**: Shows app title, user email, and logout button
- **Add Note Section**: Form to create new encrypted notes
- **Notes Grid**: Responsive grid displaying all notes
- **Note Cards**: Shows title, preview, and creation date
- **View Dialog**: Full note view with encrypted content decryption
- **Delete Function**: Confirmation before deletion

##  State Management

Redux slices:
- **authSlice**: Manages authentication state, login, register, logout
- **notesSlice**: Manages notes CRUD operations

All async operations use Redux Toolkit's `createAsyncThunk` for proper loading and error states.

##  Data Persistence

- JWT token persists in localStorage
- User data persists in localStorage
- Auto-restore authentication on page reload

##  TypeScript

Fully typed with strict mode enabled:
- No `any` types used
- Interface definitions for all data structures
- Type-safe Redux hooks
- Type-safe API responses

##  Code Quality

- ESLint configured for React and TypeScript
- Strict TypeScript compiler options
- Component-based architecture
- Separation of concerns (utils, components, pages)

##  Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

##  Notes

1. **Encryption Key**: Currently hardcoded in constants. In production, this should be user-specific or derived from user password.

2. **Token Expiration**: Backend tokens expire after 24 hours. Frontend automatically handles this with redirect to login.

3. **Error Handling**: All API errors are caught and displayed to users via Material-UI Alerts.

##  Contributing

Follow the existing architecture pattern:
- Use TypeScript with strict typing
- Follow Material-UI component patterns
- Use Redux Toolkit for state management
- Keep components small and focused
