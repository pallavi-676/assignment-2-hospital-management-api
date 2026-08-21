// Centralized API Client for Hospital Management System

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Initial demo datasets to fall back to if backend DB is empty or connecting without active MongoDB
const MOCK_HOSPITALS = [
  {
    _id: 'mock-1',
    name: 'St. Jude Memorial Medical Center',
    city: 'San Francisco',
    totalBeds: 250,
    availableBeds: 42,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    _id: 'mock-2',
    name: 'Apex Care General Hospital',
    city: 'New York',
    totalBeds: 400,
    availableBeds: 88,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-3',
    name: 'Metropolitan Emergency Institute',
    city: 'Chicago',
    totalBeds: 180,
    availableBeds: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'mock-4',
    name: 'Pacific Crest Children & Trauma Hospital',
    city: 'Seattle',
    totalBeds: 320,
    availableBeds: 115,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock-5',
    name: 'Sunrise Health Specialty Clinic',
    city: 'Austin',
    totalBeds: 120,
    availableBeds: 14,
    createdAt: new Date().toISOString(),
  }
];

let localMockHospitals = [...MOCK_HOSPITALS];

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return { data, isMock: false };
  } catch (error) {
    console.warn(`API call failed for ${endpoint}: ${error.message}. Checking local mode...`);
    // Pass error upstream so component handles fallback gracefully if needed
    throw error;
  }
}

export const api = {
  // Hospital Endpoints
  async getHospitals() {
    try {
      const res = await request('/hospitals');
      return { data: res.data, isMock: false };
    } catch (err) {
      return { data: localMockHospitals, isMock: true, error: err.message };
    }
  },

  async getAvailableHospitals() {
    try {
      const res = await request('/hospitals/available');
      return { data: res.data, isMock: false };
    } catch (err) {
      const avail = localMockHospitals.filter(h => h.availableBeds > 0);
      return { data: avail, isMock: true, error: err.message };
    }
  },

  async getHospitalById(id) {
    try {
      const res = await request(`/hospitals/${id}`);
      return { data: res.data, isMock: false };
    } catch (err) {
      const found = localMockHospitals.find(h => h._id === id);
      if (!found) throw new Error('Hospital not found');
      return { data: found, isMock: true };
    }
  },

  async createHospital(hospitalData) {
    try {
      const res = await request('/hospitals', {
        method: 'POST',
        body: JSON.stringify(hospitalData),
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      // Mock fallback creation if backend is offline
      const newHospital = {
        _id: 'mock-' + Date.now(),
        ...hospitalData,
        totalBeds: Number(hospitalData.totalBeds),
        availableBeds: Number(hospitalData.availableBeds),
        createdAt: new Date().toISOString(),
      };
      localMockHospitals.unshift(newHospital);
      return {
        data: { message: 'Hospital created (Demo Mode)', hospital: newHospital },
        isMock: true
      };
    }
  },

  async updateHospital(id, hospitalData) {
    try {
      const res = await request(`/hospitals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(hospitalData),
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      // Mock fallback update
      const index = localMockHospitals.findIndex(h => h._id === id);
      if (index !== -1) {
        localMockHospitals[index] = {
          ...localMockHospitals[index],
          ...hospitalData,
          totalBeds: hospitalData.totalBeds !== undefined ? Number(hospitalData.totalBeds) : localMockHospitals[index].totalBeds,
          availableBeds: hospitalData.availableBeds !== undefined ? Number(hospitalData.availableBeds) : localMockHospitals[index].availableBeds,
          updatedAt: new Date().toISOString(),
        };
        return {
          data: { message: 'Hospital updated (Demo Mode)', hospital: localMockHospitals[index] },
          isMock: true
        };
      }
      throw err;
    }
  },

  async deleteHospital(id) {
    try {
      const res = await request(`/hospitals/${id}`, {
        method: 'DELETE',
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      localMockHospitals = localMockHospitals.filter(h => h._id !== id);
      return {
        data: { message: 'Hospital deleted (Demo Mode)' },
        isMock: true
      };
    }
  },

  // Auth Endpoints
  async register(userData) {
    try {
      const res = await request('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      return {
        data: {
          message: 'Registered successfully (Demo Mode)',
          user: { id: 'usr-demo', username: userData.username, email: userData.email }
        },
        isMock: true
      };
    }
  },

  async login(credentials) {
    try {
      const res = await request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      return {
        data: {
          message: 'Login successful (Demo Mode)',
          user: { id: 'usr-demo', username: credentials.username || 'Admin Doctor', email: 'doctor@caresync.health' }
        },
        isMock: true
      };
    }
  },

  async logout() {
    try {
      const res = await request('/logout', {
        method: 'POST',
      });
      return { data: res.data, isMock: false };
    } catch (err) {
      return {
        data: { message: 'Logout successful' },
        isMock: true
      };
    }
  }
};
