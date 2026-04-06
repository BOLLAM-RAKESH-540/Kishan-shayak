import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 

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
  },

  expenses: {
    getAll: () => api.get('/expenses', { params: { userId: getPhone() } }),
    create: (data: any) => api.post('/expenses', { ...data, userId: getPhone() }),
  },

  market: {
    getPrices: () => api.get('/market/prices'),
  },

  shops: {
    getAll: () => api.get('/shops'),
    create: (data: any) => api.post('/shops/add', { ...data, ownerId: getPhone() }),
    addProduct: (shopId: string, data: any) => api.post(`/shops/${shopId}/products`, data),
  },

  rentals: {
    getAll: () => api.get('/rentals/all'),
    create: (data: any) => api.post('/rentals/add', data),
    delete: (id: string) => api.delete(`/rentals/${id}`),
  },

  vehicles: {
    getAll: () => api.get(`/vehicles/${getPhone()}`),
    create: (data: any) => api.post('/vehicles/add', { ...data, userId: getPhone() }),
    markPaid: (id: string) => api.patch(`/vehicles/pay/${id}`),
  },

  husbandry: {
    getAll: () => api.get(`/husbandry/my-listings/${getPhone()}`),
    create: (data: any) => api.post('/husbandry/create', { ...data, userId: getPhone() }),
    toggle: (id: string) => api.patch(`/husbandry/toggle-status/${id}`),
    delete: (id: string) => api.delete(`/husbandry/delete/${id}`),
  },
};

export default api;