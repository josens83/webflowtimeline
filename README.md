# 🌐 Web Trends Timeline - 프리미엄 SaaS 플랫폼

> 1990년대부터 2020년대까지 한국, 미국, 일본, 중국의 웹 트렌드 변화를 분석하는 프리미엄 서비스

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)

## 📋 프로젝트 개요

Web Trends Timeline은 웹 역사를 인터랙티브하게 탐색하고, 국가별/시대별 비교 분석을 제공하는 SaaS 플랫폼입니다.
4개국(한국, 미국, 일본, 중국)의 웹 트렌드를 1990년대부터 2020년대까지 체계적으로 분석하고 시각화합니다.

## ✨ 주요 기능

### 🆓 무료 티어
- ✅ 기본 타임라인 뷰 (1990s-2020s)
- ✅ 제한적인 국가 데이터 (한국 + 1개국)
- ✅ 시대별 주요 트렌드 요약
- ✅ 기본 검색 기능

### ⭐ 프리미엄 티어 ($9.99/월)
- 🌍 **전체 국가 데이터 접근** (한국, 미국, 일본, 중국)
- 📊 **고급 비교 분석 도구** (Bar, Radar, Line 차트)
- 💾 **북마크 관리 시스템**
- 📈 **인사이트 대시보드** (종합 통계 및 트렌드 분석)
- 📥 **내보내기 기능** (PDF, Excel, JSON)
- 🔍 **고급 필터링 및 검색**
- 📱 **PWA 지원** (오프라인 모드, 설치 가능)
- 🔗 **소셜 공유 기능** (Twitter, Facebook, 링크 복사)
- 📉 **시각화 차트** (국가별/시대별 트렌드 라인차트)

## 🏗️ 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts (Bar, Line, Pie, Radar)
- **Routing**: React Router v6
- **State**: Zustand
- **Animation**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Export**: jsPDF, jsPDF-AutoTable, XLSX

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express + TypeScript
- **Database**: SQLite (개발) / PostgreSQL (프로덕션)
- **Authentication**: JWT
- **Payment**: Stripe
- **Security**: Helmet, CORS, bcryptjs
- **Logging**: Morgan

### PWA
- **Service Worker**: Workbox
- **Manifest**: Web App Manifest
- **Icons**: Multi-size PNG icons (72px - 512px)
- **Offline Support**: Cache-first strategy

## 📁 프로젝트 구조

```
webflowtimeline/
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 컴포넌트
│   │   │   ├── ExportButton.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   ├── TimelineChart.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   └── ...
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── TimelinePage.tsx
│   │   │   ├── ComparePage.tsx
│   │   │   ├── BookmarksPage.tsx
│   │   │   ├── InsightsPage.tsx
│   │   │   └── ...
│   │   ├── services/          # API 서비스
│   │   ├── store/             # Zustand 스토어
│   │   ├── types/             # TypeScript 타입
│   │   └── utils/             # 유틸리티 함수
│   ├── public/
│   │   ├── icons/             # PWA 아이콘
│   │   ├── manifest.json      # PWA 매니페스트
│   │   └── sw.js              # Service Worker
│   └── package.json
├── backend/                    # Express 백엔드
│   ├── src/
│   │   ├── routes/            # API 라우트
│   │   ├── controllers/       # 컨트롤러
│   │   ├── middleware/        # 미들웨어
│   │   ├── config/            # 설정
│   │   └── data/              # 시드 데이터
│   └── package.json
├── shared/                     # 공유 타입
├── scripts/                    # 빌드 스크립트
│   └── generate-icons.js      # 아이콘 생성 스크립트
└── package.json               # Root package.json
```

## 🚀 시작하기

### 1️⃣ 사전 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **Git**: 최신 버전

### 2️⃣ 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/webflowtimeline.git
cd webflowtimeline

# 의존성 설치 (모든 워크스페이스)
npm install
```

### 3️⃣ 환경 변수 설정

#### Backend 환경 변수 (`backend/.env`)
```env
# 데이터베이스
DATABASE_URL=sqlite:./database.db

# JWT 인증
JWT_SECRET=your-super-secret-jwt-key-change-this

# Stripe 결제
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# 서버 설정
PORT=3001
NODE_ENV=development
```

#### Frontend 환경 변수 (`frontend/.env`)
```env
# API 엔드포인트
VITE_API_URL=http://localhost:3001

# Stripe 공개 키
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### 4️⃣ 개발 서버 실행

```bash
# 프론트엔드 + 백엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:3001
```

### 5️⃣ PWA 아이콘 생성 (선택사항)

```bash
# SVG에서 모든 크기의 PNG 아이콘 생성
npm run generate-icons
```

이 명령은 다음 아이콘들을 생성합니다:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 (PWA)
- 180x180 (Apple Touch Icon)
- 32x32 (Favicon)

## 📊 데이터 구조

각 트렌드 데이터는 다음 정보를 포함합니다:

```typescript
interface TrendData {
  id: number;
  decade: '1990s' | '2000s' | '2010s' | '2020s';
  country: 'korea' | 'usa' | 'japan' | 'china';
  title: string;
  description: string;
  websites: Website[];           // 주요 웹사이트 목록
  design_trends: string[];       // 디자인 트렌드
  tech_stack: string[];          // 기술 스택
  user_behavior: string[];       // 사용자 행동 패턴
  market_share: number;          // 시장 점유율
  is_premium: boolean;           // 프리미엄 콘텐츠 여부
}
```

### 데이터 커버리지
- **시대**: 4개 (1990s, 2000s, 2010s, 2020s)
- **국가**: 4개 (한국, 미국, 일본, 중국)
- **총 트렌드 항목**: 16개
- **웹사이트 데이터**: 각 트렌드당 4-6개

## 🔧 빌드 및 배포

### 프로덕션 빌드

```bash
# 전체 프로젝트 빌드
npm run build

# 개별 빌드
npm run build:frontend
npm run build:backend
```

### 배포 체크리스트

#### Frontend
- [ ] 환경 변수 설정 (`.env.production`)
- [ ] Vite 빌드 실행
- [ ] `dist` 폴더를 정적 호스팅 서비스에 배포 (Vercel, Netlify, etc.)
- [ ] HTTPS 설정
- [ ] PWA 매니페스트 및 Service Worker 검증

#### Backend
- [ ] 프로덕션 데이터베이스 설정 (PostgreSQL 권장)
- [ ] 환경 변수 설정
- [ ] TypeScript 컴파일
- [ ] PM2 또는 Docker로 프로세스 관리
- [ ] CORS 설정 업데이트
- [ ] Stripe Webhook 엔드포인트 등록

## 💳 결제 플랜 비교

| 기능 | 무료 | 프리미엄 ($9.99/월) |
|------|------|---------------------|
| 기본 타임라인 | ✅ | ✅ |
| 전체 국가 데이터 (4개국) | ❌ (제한적) | ✅ |
| 비교 분석 도구 | ❌ | ✅ |
| 인사이트 대시보드 | ❌ | ✅ |
| 북마크 저장 | ✅ | ✅ |
| PDF/Excel/JSON 내보내기 | ❌ | ✅ |
| 고급 검색 및 필터링 | ❌ | ✅ |
| 소셜 공유 | ✅ | ✅ |
| PWA 설치 | ✅ | ✅ |

## 📱 PWA 기능

### 설치 방법
1. 웹사이트 방문 (HTTPS 필수)
2. 브라우저 주소창 또는 메뉴에서 "설치" 버튼 클릭
3. 또는 앱 내 설치 프롬프트 사용

### 오프라인 지원
- Service Worker를 통한 캐시 전략
- 네트워크 우선, 캐시 폴백
- 정적 자산 사전 캐싱

### 지원 플랫폼
- ✅ Android (Chrome, Samsung Internet)
- ✅ iOS/iPadOS (Safari 16.4+)
- ✅ Windows (Edge, Chrome)
- ✅ macOS (Safari, Chrome)

## 🔐 보안

### 인증 및 인가
- **JWT**: HTTP-only 쿠키 또는 Authorization 헤더
- **Password Hashing**: bcrypt (salt rounds: 10)
- **Token Expiration**: 24시간

### API 보안
- **CORS**: 허용된 오리진만 접근
- **Rate Limiting**: IP당 요청 제한
- **Helmet**: 보안 HTTP 헤더
- **Input Validation**: 모든 입력 검증

### 결제 보안
- **Stripe**: PCI-DSS 준수 결제 처리
- **Webhook Signature**: 서명 검증
- **HTTPS Only**: 모든 통신 암호화

## 🧪 테스트

```bash
# 전체 테스트 실행
npm run test

# 커버리지 리포트
npm run test:coverage

# Lint 검사
npm run lint
```

## 📚 API 문서

### 인증 엔드포인트

#### `POST /api/auth/register`
새 사용자 등록

**요청 본문:**
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "secure-password"
}
```

**응답:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com",
    "subscription_status": "free"
  }
}
```

#### `POST /api/auth/login`
사용자 로그인

#### `GET /api/auth/profile`
현재 사용자 프로필 조회 (인증 필요)

### 트렌드 엔드포인트

#### `GET /api/trends`
모든 트렌드 조회

**쿼리 파라미터:**
- `decade`: 1990s | 2000s | 2010s | 2020s
- `country`: korea | usa | japan | china

#### `GET /api/trends/compare`
국가별 트렌드 비교 (프리미엄 전용)

**쿼리 파라미터:**
- `countries`: 쉼표로 구분된 국가 코드
- `decade`: 비교할 시대

### 결제 엔드포인트

#### `POST /api/stripe/create-checkout-session`
Stripe 결제 세션 생성 (인증 필요)

#### `POST /api/stripe/webhook`
Stripe Webhook 핸들러

## 🐛 트러블슈팅

### 일반적인 문제

**Q: 아이콘이 표시되지 않습니다**
```bash
# 아이콘 재생성
npm run generate-icons
```

**Q: 데이터베이스 연결 오류**
```bash
# 데이터베이스 초기화
cd backend
rm database.db
npm run dev  # 자동으로 재생성됨
```

**Q: Service Worker가 업데이트되지 않습니다**
```bash
# 브라우저 DevTools > Application > Service Workers
# "Unregister" 클릭 후 페이지 새로고침
```

**Q: Stripe 결제가 작동하지 않습니다**
- `.env` 파일의 Stripe 키 확인
- Stripe 대시보드에서 Webhook 엔드포인트 확인
- 테스트 모드 키 사용 중인지 확인

## 📈 로드맵

### Phase 1 ✅ (완료)
- [x] 기본 인증 시스템
- [x] 타임라인 뷰
- [x] Stripe 결제 통합
- [x] 프리미엄/무료 티어 구분

### Phase 2 ✅ (완료)
- [x] PWA 구현
- [x] 비교 분석 도구
- [x] 내보내기 기능 (PDF, Excel, JSON)
- [x] 고급 검색 및 필터링

### Phase 3 ✅ (완료)
- [x] 전체 데이터 완성 (16개 트렌드)
- [x] 소셜 공유 기능
- [x] 시각화 차트
- [x] 북마크 시스템

### Phase 4 ✅ (완료)
- [x] 북마크 관리 페이지
- [x] 인사이트 대시보드
- [x] PWA 아이콘 생성
- [x] 문서화 완성

### Phase 5 🔮 (예정)
- [ ] 관리자 대시보드
- [ ] 사용자 활동 분석
- [ ] 다국어 지원 (영어, 일본어, 중국어)
- [ ] REST API 공개 (프리미엄)
- [ ] 커뮤니티 기능 (댓글, 평가)

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코드 스타일
- ESLint + Prettier 설정 준수
- TypeScript strict mode
- 의미 있는 커밋 메시지

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

## 👨‍💻 개발자

**josens83**
- GitHub: [@josens83](https://github.com/josens83)
- Repository: [webflowtimeline](https://github.com/josens83/webflowtimeline)

## 🙏 감사의 말

- [React](https://react.dev/) - UI 프레임워크
- [Vite](https://vitejs.dev/) - 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Recharts](https://recharts.org/) - 차트 라이브러리
- [Stripe](https://stripe.com/) - 결제 처리
- [Lucide Icons](https://lucide.dev/) - 아이콘

---

⭐ 이 프로젝트가 도움이 되었다면 GitHub에서 Star를 눌러주세요!
