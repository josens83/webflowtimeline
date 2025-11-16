export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  subscription_status: 'free' | 'premium';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
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

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    subscription_status: string;
  };
}

export interface JWTPayload {
  id: number;
  email: string;
  subscription_status: string;
}
