import api from './api';

/**
 * Fetch all hospitals from the backend
 * @returns {Promise<Array>} List of hospital objects
 */
export const getHospitals = async () => {
  const response = await api.get('/hospitals');
  return response.data;
};

/**
 * Fetch hospitals with available beds (availableBeds > 0)
 * @returns {Promise<Array>} List of available hospital objects
 */
export const getAvailableHospitals = async () => {
  const response = await api.get('/hospitals/available');
  return response.data;
};

/**
 * Fetch a single hospital by ID
 * @param {string} id - Hospital ID
 * @returns {Promise<Object>} Hospital object
 */
export const getHospitalById = async (id) => {
  const response = await api.get(`/hospitals/${id}`);
  return response.data;
};

/**
 * Create a new hospital
 * @param {Object} hospitalData - { name, city, totalBeds, availableBeds }
 * @returns {Promise<Object>} { message, hospital }
 */
export const createHospital = async ({ name, city, totalBeds, availableBeds }) => {
  const response = await api.post('/hospitals', {
    name: name.trim(),
    city: city.trim(),
    totalBeds: Number(totalBeds),
    availableBeds: Number(availableBeds),
  });
  return response.data;
};

/**
 * Update an existing hospital
 * @param {string} id - Hospital ID
 * @param {Object} hospitalData - { name, city, totalBeds, availableBeds }
 * @returns {Promise<Object>} { message, hospital }
 */
export const updateHospital = async (id, { name, city, totalBeds, availableBeds }) => {
  const payload = {};
  if (name !== undefined) payload.name = name.trim();
  if (city !== undefined) payload.city = city.trim();
  if (totalBeds !== undefined) payload.totalBeds = Number(totalBeds);
  if (availableBeds !== undefined) payload.availableBeds = Number(availableBeds);

  const response = await api.put(`/hospitals/${id}`, payload);
  return response.data;
};

/**
 * Delete a hospital by ID
 * @param {string} id - Hospital ID
 * @returns {Promise<Object>} { message: "Hospital deleted successfully" }
 */
export const deleteHospital = async (id) => {
  const response = await api.delete(`/hospitals/${id}`);
  return response.data;
};
