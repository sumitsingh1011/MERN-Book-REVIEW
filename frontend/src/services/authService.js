// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Setup axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';

// Add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  // Update password
  changePassword: async (passwordData) => {
    const response = await axios.put(`${API_URL}/change-password`, passwordData);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;