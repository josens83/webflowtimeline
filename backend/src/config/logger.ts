import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

/**
 * Winston Logger 설정
 * - 구조화된 로깅
 * - 일별 로그 로테이션
 * - 레벨별 파일 분리
 * - 프로덕션/개발 환경 분리
 */

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 로그 레벨에 따른 색상
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// 현재 로그 레벨 결정 (환경변수 또는 기본값)
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : process.env.LOG_LEVEL || 'info';
};

// 커스텀 포맷 정의
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 콘솔용 포맷 (개발 환경)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    let msg = `${timestamp} [${level}]: ${message}`;

    // 추가 메타데이터가 있으면 출력
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`;
    }

    return msg;
  })
);

// 로그 파일 저장 경로
const logDir = path.join(__dirname, '../../logs');

// Transport 설정
const transports: winston.transport[] = [
  // 콘솔 출력 (개발 환경)
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? customFormat : consoleFormat,
  }),
];

// 프로덕션 환경에서만 파일 로깅 활성화
if (process.env.NODE_ENV === 'production') {
  // 모든 로그 (daily rotation)
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // 14일 보관
      format: customFormat,
    })
  );

  // 에러 로그만 (daily rotation)
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // 30일 보관
      level: 'error',
      format: customFormat,
    })
  );

  // HTTP 요청 로그 (daily rotation)
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: 'http-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d', // 7일 보관
      level: 'http',
      format: customFormat,
    })
  );
}

// Winston Logger 생성
const logger = winston.createLogger({
  level: level(),
  levels,
  format: customFormat,
  transports,
  // Unhandled exceptions & rejections 처리
  exceptionHandlers: process.env.NODE_ENV === 'production' ? [
    new DailyRotateFile({
      dirname: logDir,
      filename: 'exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ] : [],
  rejectionHandlers: process.env.NODE_ENV === 'production' ? [
    new DailyRotateFile({
      dirname: logDir,
      filename: 'rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ] : [],
  exitOnError: false, // 에러 발생 시 프로세스 종료하지 않음
});

/**
 * HTTP 요청 로깅 미들웨어용 스트림
 */
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

/**
 * 구조화된 로깅 헬퍼 함수
 */
export const log = {
  error: (message: string, meta?: Record<string, any>) => {
    logger.error(message, meta);
  },

  warn: (message: string, meta?: Record<string, any>) => {
    logger.warn(message, meta);
  },

  info: (message: string, meta?: Record<string, any>) => {
    logger.info(message, meta);
  },

  http: (message: string, meta?: Record<string, any>) => {
    logger.http(message, meta);
  },

  debug: (message: string, meta?: Record<string, any>) => {
    logger.debug(message, meta);
  },

  // 특정 사용자 액션 로깅
  userAction: (userId: number, action: string, details?: Record<string, any>) => {
    logger.info('User Action', {
      userId,
      action,
      ...details,
    });
  },

  // API 요청 로깅
  apiRequest: (method: string, path: string, statusCode: number, duration: number, meta?: Record<string, any>) => {
    logger.http('API Request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta,
    });
  },

  // 데이터베이스 쿼리 로깅
  dbQuery: (query: string, duration: number, error?: Error) => {
    if (error) {
      logger.error('Database Query Failed', {
        query: query.substring(0, 100),
        duration: `${duration}ms`,
        error: error.message,
      });
    } else if (duration > 1000) {
      logger.warn('Slow Database Query', {
        query: query.substring(0, 100),
        duration: `${duration}ms`,
      });
    } else {
      logger.debug('Database Query', {
        query: query.substring(0, 100),
        duration: `${duration}ms`,
      });
    }
  },

  // 보안 이벤트 로깅
  security: (event: string, details: Record<string, any>) => {
    logger.warn(`Security Event: ${event}`, details);
  },

  // 성능 메트릭 로깅
  performance: (metric: string, value: number, unit: string = 'ms') => {
    logger.info('Performance Metric', {
      metric,
      value,
      unit,
    });
  },
};

export default logger;
