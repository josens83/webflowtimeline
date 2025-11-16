export interface User {
  id: number;
  email: string;
  name: string;
  subscription_status: 'free' | 'premium';
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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export type Decade = '1990s' | '2000s' | '2010s' | '2020s';
export type Country = 'korea' | 'usa' | 'japan' | 'china';
