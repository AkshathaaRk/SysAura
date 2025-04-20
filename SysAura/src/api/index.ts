import axios from 'axios';
import apiCacheService from '../services/apiCacheService';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set a longer cache TTL for metrics data (1 minute)
apiCacheService.setDefaultTTL(60000);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // For development without a real backend
    // Return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = email.includes('admin') ? 'admin' : 'user';
        resolve({
          id: 'user-123',
          email,
          role,
          name: 'Demo User',
          token: 'mock-token-' + Date.now()
        });
      }, 500);
    });
  },

  register: async (userData: any) => {
    // For development without a real backend
    // Return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'user-123',
          ...userData,
          token: 'mock-token-' + Date.now()
        });
      }, 500);
    });
  },

  getCurrentUser: async () => {
    // For development without a real backend
    // Return mock data based on stored role
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole') || 'user';
        const email = localStorage.getItem('userEmail') || 'user@example.com';

        if (token) {
          resolve({
            id: 'user-123',
            email,
            role: userRole,
            name: 'Demo User'
          });
        } else {
          reject(new Error('No token found'));
        }
      }, 500);
    });
  }
};

// Systems API
export const systemsAPI = {
  getAllSystems: async () => {
    const response = await api.get('/systems');
    return response.data;
  },

  getUserSystems: async () => {
    const response = await api.get('/systems/user');
    return response.data;
  },

  getSystem: async (id: string) => {
    const response = await api.get(`/systems/${id}`);
    return response.data;
  },

  createSystem: async (systemData: any) => {
    const response = await api.post('/systems', systemData);
    return response.data;
  },

  updateSystem: async (id: string, systemData: any) => {
    const response = await api.put(`/systems/${id}`, systemData);
    return response.data;
  },

  deleteSystem: async (id: string) => {
    const response = await api.delete(`/systems/${id}`);
    return response.data;
  }
};

// Metrics API
export const metricsAPI = {
  getCurrentMetrics: async (forceRefresh = false) => {
    return apiCacheService.getCachedData(
      'metrics/current',
      async () => {
        try {
          const response = await api.get('/metrics/current');
          return response.data;
        } catch (error) {
          console.warn('Error fetching metrics, using mock data:', error);
          // Return mock data if API fails
          return {
            cpuUsage: 45,
            memoryUsage: 60,
            diskUsage: 72,
            networkIncoming: 2.5,
            networkOutgoing: 1.2,
            timestamp: new Date()
          };
        }
      },
      { forceRefresh }
    );
  },

  getCpuInfo: async (forceRefresh = false) => {
    return apiCacheService.getCachedData(
      'metrics/cpu',
      async () => {
        try {
          const response = await api.get('/metrics/cpu');
          return response.data;
        } catch (error) {
          console.warn('Error fetching CPU info, using mock data:', error);
          // Return mock CPU data
          return {
            model: 'Mock CPU',
            cores: 8,
            physicalCores: 4,
            speed: 3.2,
            usage: 45,
            history: Array(12).fill(0).map((_, i) => ({
              timestamp: new Date(Date.now() - i * 60000),
              usage: Math.floor(Math.random() * 30) + 30
            })).reverse()
          };
        }
      },
      { forceRefresh }
    );
  },

  getMemoryInfo: async (forceRefresh = false) => {
    return apiCacheService.getCachedData(
      'metrics/memory',
      async () => {
        try {
          const response = await api.get('/metrics/memory');
          return response.data;
        } catch (error) {
          console.warn('Error fetching memory info, using mock data:', error);
          // Return mock memory data
          return {
            total: 16,
            used: 9.6,
            free: 6.4,
            usedPercentage: 60,
            history: Array(12).fill(0).map((_, i) => ({
              timestamp: new Date(Date.now() - i * 60000),
              usage: Math.floor(Math.random() * 20) + 50
            })).reverse()
          };
        }
      },
      { forceRefresh }
    );
  },

  getDiskInfo: async (forceRefresh = false) => {
    return apiCacheService.getCachedData(
      'metrics/disk',
      async () => {
        try {
          const response = await api.get('/metrics/disk');
          return response.data;
        } catch (error) {
          console.warn('Error fetching disk info, using mock data:', error);
          // Return mock disk data
          return {
            disks: [
              { name: 'C:', fs: 'NTFS', size: 500, used: 360, usedPercentage: 72 },
              { name: 'D:', fs: 'NTFS', size: 1000, used: 450, usedPercentage: 45 }
            ],
            averageUsage: 72,
            history: Array(12).fill(0).map((_, i) => ({
              timestamp: new Date(Date.now() - i * 60000),
              usage: Math.floor(Math.random() * 15) + 65
            })).reverse()
          };
        }
      },
      { forceRefresh }
    );
  },

  getNetworkInfo: async (forceRefresh = false) => {
    return apiCacheService.getCachedData(
      'metrics/network',
      async () => {
        try {
          const response = await api.get('/metrics/network');
          return response.data;
        } catch (error) {
          console.warn('Error fetching network info, using mock data:', error);
          // Return mock network data
          return {
            interfaces: [
              { name: 'eth0', ip: '192.168.1.100', incoming: 2.5, outgoing: 1.2 }
            ],
            totalIncoming: 2.5,
            totalOutgoing: 1.2,
            history: Array(12).fill(0).map((_, i) => ({
              timestamp: new Date(Date.now() - i * 60000),
              incoming: Math.random() * 3 + 1,
              outgoing: Math.random() * 2 + 0.5
            })).reverse()
          };
        }
      },
      { forceRefresh }
    );
  },

  getMetricsHistory: async (systemId: string, limit = 24) => {
    const response = await api.get(`/metrics/history/${systemId}?limit=${limit}`);
    return response.data;
  },

  saveMetrics: async (systemId: string, metricsData: any) => {
    const response = await api.post(`/metrics/${systemId}`, metricsData);
    return response.data;
  }
};

// Alerts API
export const alertsAPI = {
  getAllAlerts: async (status = 'all', limit = 50) => {
    const response = await api.get(`/alerts?status=${status}&limit=${limit}`);
    return response.data;
  },

  getSystemAlerts: async (systemId: string, status = 'all', limit = 20) => {
    const response = await api.get(`/alerts/system/${systemId}?status=${status}&limit=${limit}`);
    return response.data;
  },

  createAlert: async (alertData: any) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  updateAlertStatus: async (id: string, status: string) => {
    const response = await api.patch(`/alerts/${id}`, { status });
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    return response.data;
  },

  changeEmail: async (id: string, email: string) => {
    const response = await api.put(`/users/email/${id}`, { email });
    return response.data;
  },

  changeUserRole: async (id: string, role: string) => {
    const response = await api.put(`/users/role/${id}`, { role });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default api;
