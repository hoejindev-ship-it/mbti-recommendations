import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";
import { getCharacter } from "@/lib/mbti/characters";
import { TOPICS } from "@/lib/mbti/topics";
import Character from "@/components/Character";

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
  const character = getCharacter(mbti);

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          MBTI <em>맞춤</em> 추천
        </div>
        <p className="brand-sub">{user?.email} 님, 어서 오세요</p>
      </div>

      {mbti ? (
        <>
          <div className="card center">
            <Character mbti={mbti} size={170} />
            <div className="seal-tag">{mbti}</div>
            <h1>{character.name}</h1>
            <p className="muted">{character.title}</p>
            <p>{MBTI_DESCRIPTIONS[mbti]}</p>
            <div className="haori" />
            <Link href="/test" className="btn btn-ghost">
              다시 검사하기
            </Link>
          </div>
          <div className="card">
            <h2>어떤 추천을 받아볼까요?</h2>
            <div className="haori" />
            <div className="stack">
              {TOPICS.map((t) => (
                <Link key={t.slug} href={`/recommend/${t.slug}`} className="btn">
                  {t.label} 추천 보기
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card center">
          <h1>성격 검사를 시작해 볼까요?</h1>
          <p className="muted">24개 문항에 답하면 나의 MBTI를 알 수 있어요.</p>
          <div className="haori" />
          <Link href="/test" className="btn">
            MBTI 검사 시작하기
          </Link>
        </div>
      )}

      <form action="/auth/signout" method="post" className="center" style={{ marginTop: 24 }}>
        <button type="submit" className="btn btn-ghost" style={{ color: "var(--paper)", borderColor: "var(--paper)" }}>
          로그아웃
        </button>
      </form>
    </main>
  );
}
