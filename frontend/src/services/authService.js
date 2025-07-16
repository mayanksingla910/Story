import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth service
export const authService = {
  // Set auth token in headers
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  // Login
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  // Register
  register: (username, email, password) => {
    return api.post('/auth/register', { username, email, password });
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};

export default api;