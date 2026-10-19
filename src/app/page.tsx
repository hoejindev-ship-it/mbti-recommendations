import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 16px" }}>
      <h1>MBTI 맞춤 추천</h1>
      <p>{user?.email} 님, 환영합니다.</p>
      <p>다음 단계에서 MBTI 검사를 추가합니다. (여행 · 맛집 · 쇼핑 추천)</p>
      <form action="/auth/signout" method="post">
        <button type="submit">로그아웃</button>
      </form>
    </main>
  );
}
