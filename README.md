# Web Trends Timeline - 유료 서비스

1990년대부터 2020년대까지 한국, 미국, 일본, 중국의 웹 트렌드 변화를 분석하는 프리미엄 서비스

## 📋 프로젝트 개요

웹 트렌드의 역사를 인터랙티브하게 탐색하고, 국가별/시대별 비교 분석을 제공하는 SaaS 플랫폼

## 🎯 주요 기능

### 무료 티어
- ✅ 기본 타임라인 뷰 (1990s-2020s)
- ✅ 제한적인 국가 데이터 (한국 + 1개국)
- ✅ 시대별 주요 트렌드 요약

### 프리미엄 티어 ($9.99/월)
- ⭐ 전체 국가 데이터 접근 (한국, 미국, 일본, 중국)
- ⭐ 상세 비교 분석 도구
- ⭐ 고급 필터링 및 검색
- ⭐ PDF/Excel 내보내기
- ⭐ 인포그래픽 생성 도구
- ⭐ API 액세스

## 🏗️ 기술 스택

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Chart.js / Recharts
- React Router
- Zustand (상태 관리)

### Backend
- Node.js + Express
- TypeScript
- SQLite (개발) / PostgreSQL (프로덕션)
- JWT 인증
- Stripe 결제

## 📁 프로젝트 구조

```
webflowtimeline/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
├── backend/           # Express 백엔드
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   └── package.json
├── shared/            # 공유 타입 및 유틸리티
└── package.json       # Root package.json
```

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
# 프론트엔드 + 백엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:frontend
npm run dev:backend
```

### 환경 변수 설정
```bash
# backend/.env
DATABASE_URL=sqlite:./database.db
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# frontend/.env
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📊 데이터 구조

각 시대별로 4개국의 웹 트렌드 데이터:
- 주요 웹사이트 및 서비스
- 디자인 트렌드
- 기술 스택 변화
- 사용자 행동 패턴
- 시장 점유율

## 💳 결제 플랜

| 기능 | 무료 | 프리미엄 |
|------|------|----------|
| 기본 타임라인 | ✅ | ✅ |
| 전체 국가 데이터 | ❌ | ✅ |
| 비교 분석 | ❌ | ✅ |
| 내보내기 | ❌ | ✅ |
| API 액세스 | ❌ | ✅ |
| 가격 | 무료 | $9.99/월 |

## 📱 반응형 지원

- 데스크톱 (1920px+)
- 태블릿 (768px - 1919px)
- 모바일 (320px - 767px)

## 🔐 보안

- JWT 기반 인증
- HTTPS 전용
- SQL Injection 방지
- XSS 방지
- CSRF 토큰

## 📄 라이선스

MIT License

## 👥 기여

Pull Request는 언제나 환영합니다!
