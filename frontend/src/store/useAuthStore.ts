import { create } from 'zustand';
import { authAPI } from '../services/api';
import { tokenManager } from '../utils/tokenManager';
import { showErrorToast, showSuccessToast, showInfoToast } from '../utils/errorHandler';
import type { User } from '../types';

/**
 * Auth Store 인터페이스
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * Auth Store
 * 인증 상태 관리
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: tokenManager.hasTokens(),
  isLoading: false,

  /**
   * 로그인
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await authAPI.login(email, password);
      const { accessToken, refreshToken, user } = response.data;

      // 토큰 저장
      tokenManager.setTokens(accessToken, refreshToken);

      // 상태 업데이트
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      showSuccessToast('로그인 성공!');
    } catch (error) {
      set({ isLoading: false });
      showErrorToast(error);
      throw error;
    }
  },

  /**
   * 회원가입
   */
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });

    try {
      const response = await authAPI.register(email, password, name);
      const { accessToken, refreshToken, user } = response.data;

      // 토큰 저장
      tokenManager.setTokens(accessToken, refreshToken);

      // 상태 업데이트
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      showSuccessToast('회원가입 성공!');
    } catch (error) {
      set({ isLoading: false });
      showErrorToast(error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();

      // 서버에 로그아웃 요청 (토큰 무효화)
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 상태 초기화
      tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
      });

      showInfoToast('로그아웃되었습니다');
    }
  },

  /**
   * 인증 상태 확인
   */
  checkAuth: async () => {
    if (!tokenManager.hasTokens()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      // 인증 실패 시 토큰 삭제
      tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  /**
   * 토큰 수동 갱신
   */
  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authAPI.refreshToken(refreshToken);
      const { accessToken } = response.data;

      // 새 Access Token 저장
      tokenManager.setAccessToken(accessToken);
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃
      tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },
}));
