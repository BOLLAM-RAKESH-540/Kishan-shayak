import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getPhone = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.phoneNumber || user.id || ""; 
};

export const apiService = {
  auth: {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    forgotPasswordOtp: (phoneNumber: string) => api.post('/auth/forgot-password-otp', { phoneNumber }),
    resetPassword: (data: any) => api.post('/auth/reset-password', data),
    getProfile: () => api.get('/auth/profile'),
  },

  farms: {
    getAll: () => api.get(`/farms/${getPhone()}`),
    add: (data: any) => api.post('/farms/add', { ...data, userId: getPhone() }),
    getSummary: () => api.get(`/farms/summary/${getPhone()}`),
    getProfit: (farmId: string) => api.get(`/farms/profit/${farmId}`),
    addYield: (data: any) => api.post('/farms/yield/add', data),
    // Field Activity endpoints
    addActivity: (data: any) => api.post('/farms/activity/add', data),
    getActivities: (farmId: string) => api.get(`/farms/activities/${farmId}`),
    harvest: (farmId: string, data: any) => api.patch(`/farms/harvest/${farmId}`, data),
    delete: (farmId: string) => api.delete(`/farms/${farmId}`),
  },

  expenses: {
    getAll: () => api.get('/expenses', { params: { userId: getPhone() } }),
    create: (data: any) => api.post('/expenses', { ...data, userId: getPhone() }),
  },

  market: {
    getPrices: () => api.get('/market/prices'),
  },
  
  diseases: {
    getByCrop: (crop: string) => api.get(`/diseases/crop/${crop}`),
  },

  shops: {
    getAll: () => api.get('/shops/list'),
    create: (data: any) => api.post('/shops/create', data),
    addProduct: (data: any) => api.post('/shops/add-product', data),
  },

  rentals: {
    getAll: () => api.get('/rentals/all'),
    create: (data: any) => api.post('/rentals/add', data),
    delete: (id: string) => api.delete(`/rentals/${id}`),
  },

  vehicles: {
    getAll: (searchTerm = '') => api.get('/vehicles/list', { params: { search: searchTerm } }),
    create: (data: any) => api.post('/vehicles/add', data),
    markPaid: (id: string) => api.patch(`/vehicles/pay/${id}`),
  },

  husbandry: {
    getAll: () => api.get(`/husbandry/my-listings/${getPhone()}`),
    create: (data: any) => api.post('/husbandry/create', { ...data, userId: getPhone() }),
    toggle: (id: string) => api.patch(`/husbandry/toggle-status/${id}?userId=${getPhone()}`),
    delete: (id: string) => api.delete(`/husbandry/delete/${id}?userId=${getPhone()}`),
  },
};

export default api;