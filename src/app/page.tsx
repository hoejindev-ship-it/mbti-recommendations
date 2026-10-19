import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";
import { TOPICS } from "@/lib/mbti/topics";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("mbti")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();
  const mbti = profile?.mbti;

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 16px" }}>
      <h1>MBTI 맞춤 추천</h1>
      <p>{user?.email} 님, 환영합니다.</p>
      {mbti ? (
        <>
          <p>
            나의 MBTI: <strong>{mbti}</strong> ({MBTI_DESCRIPTIONS[mbti]})
          </p>
          <p>
            <Link href="/test">다시 검사하기</Link>
          </p>
          <h2>어떤 추천을 받아볼까요?</h2>
          <p>
            {TOPICS.map((t) => (
              <Link key={t.slug} href={`/recommend/${t.slug}`} style={{ marginRight: 16 }}>
                {t.label}
              </Link>
            ))}
          </p>
        </>
      ) : (
        <p>
          <Link href="/test">MBTI 검사 시작하기</Link>
        </p>
      )}
      <form action="/auth/signout" method="post">
        <button type="submit">로그아웃</button>
      </form>
    </main>
  );
}
