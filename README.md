# mbti-recommendations
MBTI 성격에 따라 원하는 것을 추천해 준다.

## 개발 환경
```bash
cp .env.example .env.local   # Supabase URL / anon key 입력
npm install
npm run dev
```
Supabase 대시보드 > Authentication > URL Configuration 에 `http://localhost:3000/auth/callback` 을 추가하세요.
