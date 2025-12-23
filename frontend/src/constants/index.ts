export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // Notes
  NOTES: '/notes',
  NOTE_BY_ID: (id: string) => `/notes/${id}`,
};

export const STORAGE_KEYS = {
  TOKEN: 'secure_notes_token',
  USER: 'secure_notes_user',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/',
};

export const ENCRYPTION_KEY = 'secure-notes-encryption-key-2024'; // In production, this should be user-specific
