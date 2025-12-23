# Frontend Integration Guide

This guide helps frontend developers integrate with the Secure Notes API.

---

## Quick Start

### Base Configuration

```javascript
// config.js
export const API_BASE_URL = 'http://localhost:5000/api';
export const ENCRYPTION_KEY = 'your-frontend-encryption-key-32-chars';
```

---

## Client-Side Encryption

### Install CryptoJS

```bash
npm install crypto-js
# or
yarn add crypto-js
```

### Encryption Utility

```javascript
// utils/crypto.js
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-key-here';

/**
 * Encrypt note content before sending to server
 */
export const encryptContent = (content) => {
  try {
    return CryptoJS.AES.encrypt(content, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt content');
  }
};

/**
 * Decrypt note content received from server
 */
export const decryptContent = (encryptedContent) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Decryption resulted in empty string');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[Unable to decrypt content]';
  }
};
```

---

## API Service

### Auth Service

```javascript
// services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

class AuthService {
  /**
   * Register a new user
   */
  async register(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user and store token
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.profile));
        
        // Set default authorization header
        this.setAuthHeader(response.data.data.token);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Set authorization header for axios
   */
  setAuthHeader(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Initialize auth (call on app start)
   */
  initAuth() {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An error occurred');
    }
  }
}

export default new AuthService();
```

### Notes Service

```javascript
// services/notesService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { encryptContent, decryptContent } from '../utils/crypto';

class NotesService {
  /**
   * Get all notes
   */
  async getAllNotes(searchTerm = '', page = null, limit = null) {
    try {
      let url = `${API_BASE_URL}/notes`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (page && limit) {
        params.append('page', page);
        params.append('limit', limit);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);

      // Decrypt all note contents
      if (response.data.success && response.data.data.notes) {
        response.data.data.notes = response.data.data.notes.map(note => ({
          ...note,
          content: this.safeDecrypt(note.content),
        }));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new note
   */
  async createNote(title, content) {
    try {
      // Encrypt content before sending
      const encryptedContent = encryptContent(content);

      const response = await axios.post(`${API_BASE_URL}/notes`, {
        title,
        content: encryptedContent,
      });

      // Decrypt content in response
      if (response.data.success && response.data.data) {
        response.data.data.content = this.safeDecrypt(response.data.data.content);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Safely decrypt content with error handling
   */
  safeDecrypt(encryptedContent) {
    try {
      return decryptContent(encryptedContent);
    } catch (error) {
      console.error('Failed to decrypt note:', error);
      return '[Content could not be decrypted]';
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Redirect to login or clear auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An error occurred');
    }
  }
}

export default new NotesService();
```

---

## React Component Examples

### Login Component

```javascript
// components/Login.jsx
import React, { useState } from 'react';
import authService from '../services/authService';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        onLoginSuccess();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
```

### Notes List Component

```javascript
// components/NotesList.jsx
import React, { useState, useEffect } from 'react';
import notesService from '../services/notesService';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async (search = '') => {
    setLoading(true);
    setError('');

    try {
      const response = await notesService.getAllNotes(search);
      
      if (response.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      loadNotes(value);
    }, 500);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await notesService.deleteNote(noteId);
      
      if (response.success) {
        setNotes(notes.filter(note => note._id !== noteId));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>My Notes</h2>
      
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {notes.length === 0 ? (
        <p>No notes found. Create your first note!</p>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </small>
              <button onClick={() => handleDelete(note._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesList;
```

### Create Note Component

```javascript
// components/CreateNote.jsx
import React, { useState } from 'react';
import notesService from '../services/notesService';

function CreateNote({ onNoteCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await notesService.createNote(title, content);
      
      if (response.success) {
        setTitle('');
        setContent('');
        onNoteCreated && onNoteCreated(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Note</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
      />
      
      <textarea
        placeholder="Note Content (will be encrypted)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={6}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
}

export default CreateNote;
```

### App Component with Auth

```javascript
// App.jsx
import React, { useEffect, useState } from 'react';
import authService from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import CreateNote from './components/CreateNote';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Initialize authentication on app start
    authService.initAuth();
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const handleNoteCreated = () => {
    // Reload notes list or update state
    window.location.reload(); // Simple approach
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        {showRegister ? (
          <>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <button onClick={() => setShowRegister(false)}>
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <button onClick={() => setShowRegister(true)}>
              Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Secure Notes</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <main>
        <CreateNote onNoteCreated={handleNoteCreated} />
        <NotesList />
      </main>
    </div>
  );
}

export default App;
```

---

## Environment Variables

Create `.env` file in your React app:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENCRYPTION_KEY=your-frontend-encryption-key-32-chars
```

---

## Error Handling Best Practices

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  // Token expired or invalid
  if (error.message.includes('token') || error.message.includes('unauthorized')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  // Display user-friendly message
  alert(error.message);
};
```

---

## Security Best Practices

1. **Never expose encryption keys in code**
   - Use environment variables
   - Different keys for dev/prod

2. **Store tokens securely**
   - Consider using httpOnly cookies instead of localStorage
   - Implement token refresh mechanism

3. **Validate on frontend too**
   - Email format validation
   - Password strength checker
   - Input sanitization

4. **HTTPS in production**
   - Always use HTTPS
   - Set secure cookie flags

---

## Testing with Mock Data

```javascript
// mocks/notesService.mock.js
export const mockNotes = [
  {
    _id: '1',
    title: 'Test Note 1',
    content: 'This is a test note',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockNotesService = {
  getAllNotes: async () => ({ success: true, data: { notes: mockNotes } }),
  createNote: async (title, content) => ({
    success: true,
    data: { _id: '2', title, content, createdAt: new Date().toISOString() },
  }),
  deleteNote: async (id) => ({ success: true, data: { _id: id } }),
};
```

---

## Additional Resources

- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Common Issues

### CORS Errors
Make sure the backend CORS is configured to allow your frontend origin.

### Encryption/Decryption Failures
Ensure both frontend and backend use the same encryption algorithm and key format.

### 401 Unauthorized
Check if the token is being sent correctly in the Authorization header.

---

This integration guide provides everything needed to connect a React frontend to the Secure Notes API!
