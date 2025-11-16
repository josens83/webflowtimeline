# API 문서

## Base URL
```
http://localhost:3001/api
```

## 인증

대부분의 엔드포인트는 JWT 토큰이 필요합니다.

### 헤더
```
Authorization: Bearer <token>
```

## 엔드포인트

### 인증 (Authentication)

#### 회원가입
```http
POST /auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "subscription_status": "free"
  }
}
```

#### 로그인
```http
POST /auth/login
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "subscription_status": "free"
  }
}
```

#### 프로필 조회
```http
GET /auth/profile
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "subscription_status": "free",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 트렌드 데이터 (Trends)

#### 전체 트렌드 조회
```http
GET /trends
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "trends": [
    {
      "id": 1,
      "decade": "2020s",
      "country": "korea",
      "title": "한국 웹의 AI 시대",
      "description": "...",
      "websites": [...],
      "design_trends": [...],
      "tech_stack": [...],
      "user_behavior": [...],
      "is_premium": false
    }
  ],
  "user_tier": "free"
}
```

#### 시대별 트렌드 조회
```http
GET /trends/decade/:decade
```

Parameters:
- `decade`: 1990s, 2000s, 2010s, 2020s

Example:
```http
GET /trends/decade/2020s
```

Response:
```json
{
  "decade": "2020s",
  "trends": [...],
  "user_tier": "free"
}
```

#### 국가별 트렌드 조회
```http
GET /trends/country/:country
```

Parameters:
- `country`: korea, usa, japan, china

Example:
```http
GET /trends/country/korea
```

Response:
```json
{
  "country": "korea",
  "trends": [...],
  "user_tier": "free"
}
```

#### 트렌드 비교 (프리미엄 전용)
```http
GET /trends/compare?countries=korea,usa&decade=2020s
```

Query Parameters:
- `countries`: 쉼표로 구분된 국가 코드
- `decade`: 시대

Headers:
```
Authorization: Bearer <token>
```

**Note**: 이 엔드포인트는 프리미엄 사용자만 사용 가능합니다.

Response:
```json
{
  "decade": "2020s",
  "countries": ["korea", "usa"],
  "comparison": [...]
}
```

### 결제 (Stripe)

#### Checkout Session 생성
```http
POST /stripe/create-checkout-session
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Portal Session 생성
```http
POST /stripe/create-portal-session
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "url": "https://billing.stripe.com/..."
}
```

#### Webhook (Stripe에서 호출)
```http
POST /stripe/webhook
```

**Note**: 이 엔드포인트는 Stripe에서만 호출해야 합니다.

## 에러 코드

### 400 Bad Request
잘못된 요청 형식

```json
{
  "error": "All fields are required"
}
```

### 401 Unauthorized
인증 필요

```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
프리미엄 권한 필요

```json
{
  "error": "Premium subscription required",
  "message": "This feature is only available for premium users"
}
```

### 404 Not Found
리소스를 찾을 수 없음

```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
서버 오류

```json
{
  "error": "Server error"
}
```

## Rate Limiting

현재 Rate Limiting은 구현되지 않았습니다. 프로덕션 환경에서는 다음과 같이 제한할 것을 권장합니다:

- 인증 엔드포인트: 분당 5회
- 트렌드 조회: 분당 30회
- 결제 엔드포인트: 분당 3회

## CORS

허용된 Origin:
- 개발: `http://localhost:5173`
- 프로덕션: 환경 변수 `FRONTEND_URL`에 설정된 URL

## 웹훅 보안

Stripe Webhook은 서명 검증을 통해 보안이 유지됩니다.

## 예제 코드

### JavaScript (Fetch)
```javascript
// 로그인
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// 트렌드 조회
const trendsResponse = await fetch('http://localhost:3001/api/trends', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const trends = await trendsResponse.json();
```

### Python (Requests)
```python
import requests

# 로그인
response = requests.post(
    'http://localhost:3001/api/auth/login',
    json={
        'email': 'user@example.com',
        'password': 'password123'
    }
)

token = response.json()['token']

# 트렌드 조회
trends_response = requests.get(
    'http://localhost:3001/api/trends',
    headers={'Authorization': f'Bearer {token}'}
)

trends = trends_response.json()
```

### cURL
```bash
# 로그인
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# 트렌드 조회
curl http://localhost:3001/api/trends \
  -H "Authorization: Bearer $TOKEN"
```
