import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL, API_TIMEOUT } from '../config/constants';
import { tokenManager } from '../utils/tokenManager';
import { isUnauthorizedError } from '../utils/errorHandler';
import type {
  AuthResponse,
  ProfileResponse,
  RefreshTokenResponse,
  TrendsResponse,
  ComparisonResponse,
  CheckoutSessionResponse,
  PortalSessionResponse,
  ContactResponse,
  AdminUsersResponse,
  AdminStatsResponse,
  AdminSystemResponse,
} from '../types/api.types';

/**
 * Axios 인스턴스 생성
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 토큰 갱신 중복 방지를 위한 Promise
 */
let refreshTokenPromise: Promise<string> | null = null;

/**
 * Request Interceptor
 * 모든 요청에 Access Token 추가
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenManager.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 401 에러 시 자동으로 토큰 갱신 시도
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 Unauthorized && 재시도하지 않은 요청
    if (isUnauthorizedError(error) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 중이면 대기
        if (refreshTokenPromise) {
          const newAccessToken = await refreshTokenPromise;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        }

        // 토큰 갱신 시작
        refreshTokenPromise = refreshAccessToken();
        const newAccessToken = await refreshTokenPromise;
        refreshTokenPromise = null;

        // 새 토큰으로 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Access Token 갱신
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<RefreshTokenResponse>(
    `${API_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const { accessToken } = response.data;
  tokenManager.setAccessToken(accessToken);

  return accessToken;
}

// ==========================================
// Auth APIs
// ==========================================
export const authAPI = {
  /**
   * 회원가입
   */
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),

  /**
   * 로그인
   */
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  /**
   * 프로필 조회
   */
  getProfile: () =>
    api.get<ProfileResponse>('/auth/profile'),

  /**
   * 프로필 업데이트
   */
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put<ProfileResponse>('/auth/profile', data),

  /**
   * 비밀번호 변경
   */
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),

  /**
   * 토큰 갱신
   */
  refreshToken: (refreshToken: string) =>
    api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken }),

  /**
   * 로그아웃
   */
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  /**
   * 모든 디바이스에서 로그아웃
   */
  logoutAll: () =>
    api.post('/auth/logout-all'),
};

// ==========================================
// Trends APIs
// ==========================================
export const trendsAPI = {
  /**
   * 모든 트렌드 조회
   */
  getAll: () =>
    api.get<TrendsResponse>('/trends'),

  /**
   * 특정 연대 트렌드 조회
   */
  getByDecade: (decade: string) =>
    api.get<TrendsResponse>(`/trends/decade/${decade}`),

  /**
   * 특정 국가 트렌드 조회
   */
  getByCountry: (country: string) =>
    api.get<TrendsResponse>(`/trends/country/${country}`),

  /**
   * 트렌드 비교
   */
  compare: (countries: string[], decade: string) =>
    api.get<ComparisonResponse>('/trends/compare', {
      params: { countries: countries.join(','), decade },
    }),
};

// ==========================================
// Stripe APIs
// ==========================================
export const stripeAPI = {
  /**
   * 결제 세션 생성
   */
  createCheckoutSession: () =>
    api.post<CheckoutSessionResponse>('/stripe/create-checkout-session'),

  /**
   * 고객 포털 세션 생성
   */
  createPortalSession: () =>
    api.post<PortalSessionResponse>('/stripe/create-portal-session'),
};

// ==========================================
// Contact APIs
// ==========================================
export const contactAPI = {
  /**
   * 문의 제출
   */
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post<ContactResponse>('/contact', data),
};

// ==========================================
// Admin APIs
// ==========================================
export const adminAPI = {
  // Users
  getUsers: () => api.get<AdminUsersResponse>('/admin/users'),
  getStats: () => api.get<AdminStatsResponse>('/admin/stats'),
  updateSubscription: (userId: number, subscription_status: string) =>
    api.put(`/admin/users/${userId}/subscription`, { subscription_status }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),

  // System
  getSystemInfo: () => api.get<AdminSystemResponse>('/admin/system'),

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
