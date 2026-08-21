import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://hospital-api-xk7v.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage =
        'Unable to connect to the backend server.';
    }

    const enhancedError = new Error(errorMessage);

    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default api;