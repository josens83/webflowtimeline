import { create } from 'zustand';
import { AuthState, User } from '../types';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });

      toast.success('로그인 성공!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || '로그인 실패');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });

      toast.success('회원가입 성공!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || '회원가입 실패');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.info('로그아웃되었습니다');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      set({ user: response.data, token, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
