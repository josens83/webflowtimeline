import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import routes from './routes';
import { seedTrendsData } from './data/seedData';
import db from './config/database';
import { generalLimiter } from './middleware/rateLimiter';
import {
  initSentry,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler
} from './config/sentry';
import logger, { log, morganStream } from './config/logger';
import { initRedis, closeRedis } from './config/redis';
import passport, { initPassport } from './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// Sentry 초기화 (최상단에 위치해야 함)
// ==========================================
initSentry(app);

// ==========================================
// Redis 초기화
// ==========================================
initRedis();

// ==========================================
// Passport OAuth 초기화
// ==========================================
initPassport();

// ==========================================
// Security Middleware
// ==========================================

// Helmet - 보안 헤더 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Stripe 연동을 위해 비활성화
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1년
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS - 엄격한 출처 제한
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
];

if (process.env.PRODUCTION_URL) {
  allowedOrigins.push(process.env.PRODUCTION_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86400 // 24 hours
}));

// Rate Limiting - DDoS 방어
app.use(generalLimiter);

// NoSQL Injection 방지
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Potential NoSQL injection attempt: ${key}`);
  },
}));

// HTTP Parameter Pollution 방지
app.use(hpp());

// Request Logging (Winston과 통합)
app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
      : ':method :url :status :response-time ms',
    { stream: morganStream }
  )
);

// Sentry Request & Tracing Handlers (라우트 전에 배치)
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// Body parsing - special handling for Stripe webhook
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==========================================
// Error Handling
// ==========================================

// Sentry Error Handler (반드시 에러 핸들러 이전에 배치)
app.use(sentryErrorHandler());

// Custom Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  // 로깅
  if (statusCode >= 500) {
    log.error('Server Error', {
      statusCode,
      message,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
  } else if (statusCode >= 400) {
    log.warn('Client Error', {
      statusCode,
      message,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Check if database is empty and seed data
db.get('SELECT COUNT(*) as count FROM trends', [], (err, row: any) => {
  if (!err && row.count === 0) {
    log.info('Seeding initial data...');
    seedTrendsData();
  }
});

app.listen(PORT, () => {
  log.info('Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    apiUrl: `http://localhost:${PORT}/api`,
    healthUrl: `http://localhost:${PORT}/health`,
  });

  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

// ==========================================
// Graceful Shutdown
// ==========================================
process.on('SIGTERM', async () => {
  log.info('SIGTERM signal received: closing HTTP server');
  await closeRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  log.info('SIGINT signal received: closing HTTP server');
  await closeRedis();
  process.exit(0);
});

export default app;
