import axios from 'axios';

// Base API URL configuration
// Using relative paths so requests are proxied via Vite dev server to http://localhost:4000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for Express-session & Passport session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with status outside 2xx
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please verify the backend is running.';
      }
    } else if (error.request) {
      // No response received (network error / backend down)
      errorMessage = 'Unable to connect to the backend server. Please check your network or ensure backend is running on port 4000.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default api;
export { API_BASE_URL };
