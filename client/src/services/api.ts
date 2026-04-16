import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:3000/api`; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
    updateProfile: (data: any) => api.put('/auth/update-profile', data),
    uploadProfileImage: (formData: FormData) => api.post('/auth/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    removeProfileImage: () => api.delete('/auth/profile-image'),
    deleteAccount: () => api.delete('/auth/delete-account'),
  },

  farms: {
    getAll: () => api.get(`/farms/${getPhone() || 'me'}`),
    add: (data: any) => api.post('/farms/add', { ...data, userId: getPhone() }),
    update: (farmId: string, data: any) => api.patch(`/farms/edit/${farmId}`, data),
    getSummary: () => api.get(`/farms/summary/${getPhone() || 'me'}`),
    getProfit: (farmId: string) => api.get(`/farms/profit/${farmId}`),
    addYield: (data: any) => api.post('/farms/yield/add', data),
    addActivity: (data: any) => api.post('/farms/activity/add', data),
    getActivities: (farmId: string) => api.get(`/farms/activities/${farmId}`),
    harvest: (farmId: string, data: any) => api.patch(`/farms/harvest/${farmId}`, data),
    delete: (farmId: string) => api.delete(`/farms/${farmId}`),
  },

  expenses: {
    getAll: () => api.get('/expenses', { params: { userId: getPhone() } }),
    create: (data: any) => api.post('/expenses', { ...data, userId: getPhone() }),
    delete: (id: string) => api.delete(`/expenses/${id}`),
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
    delete: (id: string) => api.delete(`/vehicles/${id}`),
  },

  husbandry: {
    getAll: () => api.get(`/husbandry/my-listings/${getPhone()}`),
    create: (data: any) => api.post('/husbandry/create', { ...data, userId: getPhone() }),
    toggle: (id: string) => api.patch(`/husbandry/toggle-status/${id}`),
    delete: (id: string) => api.delete(`/husbandry/delete/${id}`),
  },

  weather: {
    get: (lat: number, lon: number) => api.get('/weather', { params: { lat, lon } }),
  },

  analytics: {
    getSummary: () => api.get('/analytics/summary'),
  },
  
  community: {
    getFeed: (params?: any) => api.get('/community/posts', { params }),
    createPost: (formData: FormData) => api.post('/community/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    toggleLike: (postId: string) => api.post(`/community/posts/${postId}/like`),
    addComment: (postId: string, data: any) => api.post(`/community/posts/${postId}/comments`, data),
    getComments: (postId: string) => api.get(`/community/posts/${postId}/comments`),
  },

  bot: {
    chat: (message: string) => api.post('/bot/chat', { message }),
  },
};

export default api;