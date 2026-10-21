import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";
import { getCharacter } from "@/lib/mbti/characters";
import { TOPICS } from "@/lib/mbti/topics";
import Character from "@/components/Character";
import AxisBars from "@/components/AxisBars";
import { parseScores } from "@/lib/mbti/score";
import { QUESTIONS } from "@/lib/mbti/questions";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("mbti, scores")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();
  const mbti = profile?.mbti;
  const character = getCharacter(mbti);
  const scores = parseScores(profile?.scores);

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          MBTI <em>맞춤</em> 추천
        </div>
        <p className="brand-sub">{user?.email} 님, 어서 오세요 🐾</p>
      </div>

      {mbti ? (
        <>
          <div className="card center">
            <Character mbti={mbti} size={170} />
            <div className="seal-tag">{mbti}</div>
            <h1>{character.name}</h1>
            <p className="muted">{character.title}</p>
            <p>{MBTI_DESCRIPTIONS[mbti]}</p>
            <div className="divider" />
            {scores && (
              <>
                <AxisBars scores={scores} />
                <div className="divider" />
              </>
            )}
            <Link href="/test" className="btn btn-ghost">
              다시 검사하기
            </Link>
          </div>
          <div className="card">
            <h2>어떤 추천을 받아볼까요?</h2>
            <div className="divider" />
            <div className="stack">
              {TOPICS.map((t) => (
                <Link key={t.slug} href={`/recommend/${t.slug}`} className="btn">
                  {t.label} 추천 보기
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>친구와 궁합 보기</h2>
            <div className="divider" />
            <Link href="/friends" className="btn">
              친구 · 궁합 페이지로
            </Link>
          </div>
          <div className="card">
            <h2>MBTI 유형 도감</h2>
            <div className="divider" />
            <p className="muted" style={{ marginBottom: 12 }}>
              16가지 유형의 성격과 어울리는 강아지를 알아봐요.
            </p>
            <Link href="/types" className="btn">
              유형 도감 보기
            </Link>
          </div>
        </>
      ) : (
        <div className="card center">
          <h1>성격 검사를 시작해 볼까요?</h1>
          <p className="muted">{QUESTIONS.length}개 문항에 답하면 나의 MBTI를 알 수 있어요.</p>
          <div className="divider" />
          <Link href="/test" className="btn">
            MBTI 검사 시작하기
          </Link>
        </div>
      )}

      <form action="/auth/signout" method="post" className="center" style={{ marginTop: 24 }}>
        <button type="submit" className="btn btn-ghost">
          로그아웃
        </button>
      </form>
    </main>
  );
}
