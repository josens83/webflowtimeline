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

export default api;
