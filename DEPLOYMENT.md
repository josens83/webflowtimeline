# 배포 가이드

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# .env 파일을 열고 실제 값으로 수정
```

필수 환경 변수:
- `JWT_SECRET`: 랜덤한 긴 문자열
- `STRIPE_SECRET_KEY`: Stripe 대시보드에서 발급
- `STRIPE_WEBHOOK_SECRET`: Stripe CLI로 생성
- `STRIPE_PRICE_ID`: Stripe에서 생성한 가격 ID

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
# .env 파일을 열고 실제 값으로 수정
```

필수 환경 변수:
- `VITE_STRIPE_PUBLIC_KEY`: Stripe 공개 키

### 3. 개발 서버 실행

```bash
# 루트 디렉토리에서
npm run dev
```

이 명령어는 프론트엔드(포트 5173)와 백엔드(포트 3001)를 동시에 실행합니다.

## Stripe 설정

### 1. Stripe 계정 생성
https://stripe.com 에서 계정 생성

### 2. 가격 생성
- Stripe 대시보드 → Products → Create product
- 월간 구독: $9.99/month
- Price ID 복사 → `STRIPE_PRICE_ID`에 설정

### 3. Webhook 설정 (로컬)
```bash
# Stripe CLI 설치
brew install stripe/stripe-cli/stripe

# Stripe 로그인
stripe login

# Webhook 리스닝
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

생성된 webhook secret을 `STRIPE_WEBHOOK_SECRET`에 설정

### 4. Webhook 설정 (프로덕션)
- Stripe 대시보드 → Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/stripe/webhook`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

## 프로덕션 배포

### 옵션 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

환경 변수 설정:
- `VITE_API_URL`: Backend API URL
- `VITE_STRIPE_PUBLIC_KEY`: Stripe 공개 키

#### Backend (Railway)
```bash
cd backend
npm run build

# Railway 배포
railway login
railway init
railway up
```

환경 변수 설정:
- `PORT`: 3001
- `NODE_ENV`: production
- `DATABASE_URL`: PostgreSQL URL (Railway에서 제공)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `FRONTEND_URL`

### 옵션 2: Docker

```bash
# 루트 디렉토리에서
docker-compose up -d
```

### 옵션 3: VPS (Ubuntu)

#### Backend
```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
sudo npm install -g pm2

# 프로젝트 클론 및 설치
git clone <repo-url>
cd webflowtimeline/backend
npm install
npm run build

# PM2로 실행
pm2 start dist/server.js --name webtrends-api
pm2 save
pm2 startup
```

#### Frontend
```bash
cd ../frontend
npm install
npm run build

# Nginx 설정
sudo nano /etc/nginx/sites-available/webtrends

# 아래 내용 추가:
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/webflowtimeline/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Nginx 활성화
sudo ln -s /etc/nginx/sites-available/webtrends /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 데이터베이스 마이그레이션

### SQLite → PostgreSQL (프로덕션용)

1. PostgreSQL 설치 및 데이터베이스 생성
2. Backend 코드에서 `sqlite3` → `pg` 변경
3. 환경 변수 `DATABASE_URL` 설정

## 모니터링

### PM2 모니터링
```bash
pm2 monit
pm2 logs
```

### 로그 확인
```bash
# Backend 로그
pm2 logs webtrends-api

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] JWT_SECRET이 강력한 랜덤 문자열인지 확인
- [ ] HTTPS 설정 (Let's Encrypt)
- [ ] CORS 설정 확인
- [ ] Rate limiting 적용
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] Helmet.js 적용 확인

## 성능 최적화

- [ ] Frontend 빌드 최적화 (코드 스플리팅)
- [ ] 이미지 최적화
- [ ] CDN 사용 고려
- [ ] 데이터베이스 인덱스 추가
- [ ] Redis 캐싱 고려
- [ ] Nginx gzip 압축

## 백업

### 데이터베이스 백업
```bash
# SQLite
cp database.db database.backup.db

# PostgreSQL
pg_dump -U username dbname > backup.sql
```

## 문제 해결

### CORS 에러
- Backend의 CORS 설정 확인
- Frontend URL이 정확한지 확인

### Stripe Webhook 실패
- Webhook secret이 올바른지 확인
- Endpoint URL이 정확한지 확인

### 데이터베이스 연결 실패
- DATABASE_URL 확인
- 방화벽 설정 확인
