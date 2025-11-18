/**
 * Application Constants
 * 애플리케이션 전역 상수
 */

// API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30초

// OAuth
export const GOOGLE_OAUTH_URL = `${API_URL}/auth/google`;
export const KAKAO_OAUTH_URL = `${API_URL}/auth/kakao`;

// Token
export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15분 (밀리초)
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일 (밀리초)
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 만료 5분 전에 갱신 (밀리초)

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;

// Toast
export const TOAST_AUTO_CLOSE = 3000; // 3초
export const TOAST_POSITION = 'top-right' as const;

// Cache
export const CACHE_DURATION = 5 * 60 * 1000; // 5분 (밀리초)

// Retry
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1초

// Subscription
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

// Countries
export const COUNTRIES = {
  KOREA: 'korea',
  USA: 'usa',
  JAPAN: 'japan',
  CHINA: 'china',
} as const;

export const COUNTRY_LABELS: Record<string, string> = {
  korea: '한국',
  usa: '미국',
  japan: '일본',
  china: '중국',
};

// Decades
export const DECADES = {
  NINETEEN_NINETIES: '1990s',
  TWO_THOUSANDS: '2000s',
  TWENTY_TENS: '2010s',
  TWENTY_TWENTIES: '2020s',
} as const;

export const DECADE_LABELS: Record<string, string> = {
  '1990s': '1990년대',
  '2000s': '2000년대',
  '2010s': '2010년대',
  '2020s': '2020년대',
};

// Timeline Filter Configuration
export const DECADES_CONFIG = [
  { value: '1990s' as const, label: '1990년대', color: 'from-blue-500 to-cyan-500' },
  { value: '2000s' as const, label: '2000년대', color: 'from-purple-500 to-pink-500' },
  { value: '2010s' as const, label: '2010년대', color: 'from-orange-500 to-red-500' },
  { value: '2020s' as const, label: '2020년대', color: 'from-green-500 to-teal-500' },
] as const;

export const COUNTRIES_CONFIG = [
  { value: 'korea' as const, label: '한국', flag: '🇰🇷' },
  { value: 'usa' as const, label: '미국', flag: '🇺🇸' },
  { value: 'japan' as const, label: '일본', flag: '🇯🇵' },
  { value: 'china' as const, label: '중국', flag: '🇨🇳' },
] as const;

export const COUNTRY_EMOJIS: Record<string, string> = {
  korea: '🇰🇷',
  usa: '🇺🇸',
  japan: '🇯🇵',
  china: '🇨🇳',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TIMELINE: '/timeline',
  PRICING: '/pricing',
  ACCOUNT: '/account',
  ADMIN: '/admin',
  PAYMENT_SUCCESS: '/payment-success',
  COMPARE: '/compare',
  BOOKMARKS: '/bookmarks',
  INSIGHTS: '/insights',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  REFUND: '/refund-policy',
  NOT_FOUND: '*',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  BOOKMARKS: 'bookmarks',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;
