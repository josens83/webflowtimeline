import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Trends APIs
export const trendsAPI = {
  getAll: () =>
    api.get('/trends'),

  getByDecade: (decade: string) =>
    api.get(`/trends/decade/${decade}`),

  getByCountry: (country: string) =>
    api.get(`/trends/country/${country}`),

  compare: (countries: string[], decade: string) =>
    api.get('/trends/compare', {
      params: { countries: countries.join(','), decade }
    }),
};

// Stripe APIs
export const stripeAPI = {
  createCheckoutSession: () =>
    api.post('/stripe/create-checkout-session'),

  createPortalSession: () =>
    api.post('/stripe/create-portal-session'),
};

// Contact APIs
export const contactAPI = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),
};

// Admin APIs
export const adminAPI = {
  // Users
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  updateSubscription: (userId: number, subscription_status: string) =>
    api.put(`/admin/users/${userId}/subscription`, { subscription_status }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),

  // System
  getSystemInfo: () => api.get('/admin/system'),

  // Contacts
  getContacts: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/admin/contacts', { params }),
  getContactStats: () => api.get('/admin/contacts/stats'),
  getContact: (id: number) => api.get(`/admin/contacts/${id}`),
  updateContact: (id: number, data: { status: string; admin_reply?: string }) =>
    api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id: number) => api.delete(`/admin/contacts/${id}`),
};

export default api;
