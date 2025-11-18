/**
 * API Response Types
 * 모든 API 응답에 대한 타입 정의
 */

// Generic API Response
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth API Responses
export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    subscription_status: 'free' | 'premium';
  };
}

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  subscription_status: 'free' | 'premium';
  created_at: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
}

// Trends API Responses
export interface TrendsResponse {
  trends: TrendData[];
  total: number;
}

export interface ComparisonResponse {
  decade: string;
  countries: string[];
  comparison: TrendData[];
}

export interface TrendData {
  id: number;
  decade: '1990s' | '2000s' | '2010s' | '2020s';
  country: 'korea' | 'usa' | 'japan' | 'china';
  title: string;
  description: string;
  websites: Website[];
  design_trends: string[];
  tech_stack: string[];
  user_behavior: string[];
  market_share?: number;
  is_premium: boolean;
  created_at: string;
}

export interface Website {
  name: string;
  url: string;
  description: string;
  screenshot_url?: string;
  launch_year: number;
  category: string;
}

// Stripe API Responses
export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface PortalSessionResponse {
  url: string;
}

// Contact API Response
export interface ContactResponse {
  message: string;
  id: number;
}

// Admin API Responses
export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  subscription_status: 'free' | 'premium';
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  totalRevenue: number;
  recentSignups: number;
}

export interface AdminSystemResponse {
  version: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: {
    model: string;
    cores: number;
  };
}

// Error Response
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  details?: any;
}
