import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * Rate Limiting Configuration
 * DDoS 및 브루트포스 공격 방어
 */

// 일반 API 요청 제한 (분당 100회)
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100, // 최대 100회
  message: {
    success: false,
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '1분'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
      retryAfter: '1분'
    });
  }
});

// 인증 관련 엄격한 제한 (5분당 10회)
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5분
  max: 10, // 최대 10회
  message: {
    success: false,
    message: '로그인 시도가 너무 많습니다. 5분 후 다시 시도해주세요.',
    retryAfter: '5분'
  },
  skipSuccessfulRequests: true, // 성공한 요청은 카운트에서 제외
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '로그인 시도가 너무 많습니다. 5분 후 다시 시도해주세요.',
      retryAfter: '5분'
    });
  }
});

// 회원가입 제한 (시간당 3회)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 3, // 최대 3회
  message: {
    success: false,
    message: '회원가입 시도가 너무 많습니다. 1시간 후 다시 시도해주세요.',
    retryAfter: '1시간'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '회원가입 시도가 너무 많습니다. 1시간 후 다시 시도해주세요.',
      retryAfter: '1시간'
    });
  }
});

// 결제 관련 엄격한 제한 (시간당 20회)
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 20, // 최대 20회
  message: {
    success: false,
    message: '결제 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '1시간'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '결제 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      retryAfter: '1시간'
    });
  }
});

// API 키 생성 제한 (일일 5회)
export const apiKeyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24시간
  max: 5, // 최대 5회
  message: {
    success: false,
    message: 'API 키 생성 제한을 초과했습니다. 내일 다시 시도해주세요.',
    retryAfter: '24시간'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'API 키 생성 제한을 초과했습니다. 내일 다시 시도해주세요.',
      retryAfter: '24시간'
    });
  }
});

// 비밀번호 재설정 제한 (시간당 3회)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 3, // 최대 3회
  message: {
    success: false,
    message: '비밀번호 재설정 요청이 너무 많습니다. 1시간 후 다시 시도해주세요.',
    retryAfter: '1시간'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '비밀번호 재설정 요청이 너무 많습니다. 1시간 후 다시 시도해주세요.',
      retryAfter: '1시간'
    });
  }
});

// Contact Form 제한 (시간당 5회)
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 5, // 최대 5회
  message: {
    success: false,
    message: '문의 제출이 너무 많습니다. 1시간 후 다시 시도해주세요.',
    retryAfter: '1시간'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: '문의 제출이 너무 많습니다. 1시간 후 다시 시도해주세요.',
      retryAfter: '1시간'
    });
  }
});
