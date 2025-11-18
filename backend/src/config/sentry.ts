import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

/**
 * Sentry 초기화 및 설정
 * 에러 트래킹, 성능 모니터링, 프로파일링
 */
export function initSentry(app: Express) {
  // Sentry DSN이 설정되지 않은 경우 초기화하지 않음 (개발 환경)
  if (!process.env.SENTRY_DSN) {
    console.log('ℹ️  Sentry DSN not configured, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 프로덕션에서는 10% 샘플링

    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      // HTTP 트레이싱
      Sentry.httpIntegration(),

      // Express 통합
      Sentry.expressIntegration(),

      // CPU 프로파일링
      nodeProfilingIntegration(),
    ],

    // Release 추적
    release: process.env.npm_package_version || '1.0.0',

    // 에러 필터링 (민감한 정보 제외)
    beforeSend(event, hint) {
      // 개발 환경에서는 콘솔에도 출력
      if (process.env.NODE_ENV === 'development') {
        console.error('🐛 Sentry Event:', event);
      }

      // 민감한 정보 제거
      if (event.request) {
        delete event.request.cookies;

        // Authorization 헤더 마스킹
        if (event.request.headers) {
          if (event.request.headers.authorization) {
            event.request.headers.authorization = '[Filtered]';
          }
          if (event.request.headers.cookie) {
            event.request.headers.cookie = '[Filtered]';
          }
        }
      }

      // 요청 본문에서 비밀번호 제거
      if (event.request?.data) {
        const data = event.request.data;
        if (typeof data === 'object') {
          if ('password' in data) data.password = '[Filtered]';
          if ('newPassword' in data) data.newPassword = '[Filtered]';
          if ('currentPassword' in data) data.currentPassword = '[Filtered]';
        }
      }

      return event;
    },

    // 무시할 에러 타입
    ignoreErrors: [
      // 네트워크 에러
      'Network request failed',
      'NetworkError',

      // 타임아웃 에러
      'timeout',
      'TimeoutError',

      // 취소된 요청
      'AbortError',
      'Request aborted',

      // 일반적인 봇 에러
      'Non-Error promise rejection captured',
    ],

    // 트랜잭션 이름 커스터마이징
    beforeSendTransaction(event) {
      // API 경로를 정규화하여 그룹화
      if (event.transaction) {
        event.transaction = event.transaction
          .replace(/\/\d+/g, '/:id') // 숫자 ID를 :id로 대체
          .replace(/\/[a-f0-9]{24}/g, '/:objectId'); // MongoDB ObjectId 패턴
      }
      return event;
    },
  });

  console.log('✅ Sentry initialized successfully');
}

/**
 * Sentry Request Handler (라우팅 전에 호출)
 */
export const sentryRequestHandler = () => {
  return (req: any, res: any, next: any) => next(); // Deprecated in v8, express integration handles this
};

/**
 * Sentry Tracing Handler (라우팅 전에 호출)
 */
export const sentryTracingHandler = () => {
  return (req: any, res: any, next: any) => next(); // Deprecated in v8, express integration handles this
};

/**
 * Sentry Error Handler (에러 핸들링 전에 호출)
 */
export const sentryErrorHandler = () => {
  return (err: any, req: any, res: any, next: any) => {
    // Sentry v8에서는 expressIntegration이 자동으로 처리
    if (err.status && (err.status < 400 || err.status === 401 || err.status === 404)) {
      // 401, 404는 Sentry에 전송하지 않음
      return next(err);
    }
    Sentry.captureException(err);
    next(err);
  };
};

/**
 * 수동 에러 캡처 (컨트롤러에서 사용)
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
}

/**
 * 메시지 캡처 (경고, 정보 로그)
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  } else {
    console.log(`[${level}] ${message}`, context);
  }
}

/**
 * 사용자 컨텍스트 설정
 */
export function setUserContext(user: { id: number; email: string; subscription_status?: string }) {
  if (process.env.SENTRY_DSN) {
    Sentry.setUser({
      id: String(user.id),
      email: user.email,
      subscription_status: user.subscription_status,
    });
  }
}

/**
 * 트랜잭션 시작 (성능 모니터링)
 */
export function startTransaction(name: string, op: string) {
  if (process.env.SENTRY_DSN) {
    return Sentry.startSpan({ name, op }, (span) => span);
  }
  return null;
}

export default Sentry;
