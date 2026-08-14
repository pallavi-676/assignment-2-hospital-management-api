import api from './api';

/**
 * Register a new user
 * @param {Object} credentials - { username, email, password }
 * @returns {Promise<Object>} { message, user: { id, username, email } }
 */
export const registerUser = async ({ username, email, password }) => {
  const response = await api.post('/register', {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Log in an existing user
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} { message, user: { id, username, email } }
 */
export const loginUser = async ({ username, password }) => {
  const response = await api.post('/login', {
    username,
    password,
  });
  return response.data;
};

/**
 * Log out the currently authenticated user
 * @returns {Promise<Object>} { message: "Logout successful" }
 */
export const logoutUser = async () => {
  const response = await api.post('/logout');
  return response.data;
};
