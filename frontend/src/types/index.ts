/**
 * Core Application Types
 * 애플리케이션 전역 타입 정의
 */

// User (Full profile from /profile endpoint)
export interface User {
  id: number;
  email: string;
  name: string;
  subscription_status: 'free' | 'premium';
  created_at?: string; // Optional: only available from profile endpoint
}

// Website
export interface Website {
  name: string;
  url: string;
  description: string;
  screenshot_url?: string;
  launch_year: number;
  category: string;
}

// Trend Data
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

// Type Aliases
export type Decade = '1990s' | '2000s' | '2010s' | '2020s';
export type Country = 'korea' | 'usa' | 'japan' | 'china';
export type SubscriptionStatus = 'free' | 'premium';

// Re-export API types for convenience
export type {
  AuthResponse,
  ProfileResponse,
  RefreshTokenResponse,
  TrendsResponse,
  ComparisonResponse,
  CheckoutSessionResponse,
  PortalSessionResponse,
  ContactResponse,
  ApiError,
} from './api.types';
