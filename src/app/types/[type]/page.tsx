import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTERS, getCharacter } from "@/lib/mbti/characters";
import { CELEBRITIES, CELEBRITY_NOTICE, MAX_CELEBRITIES } from "@/lib/mbti/celebrities";
import { TYPE_INFO } from "@/lib/mbti/typeInfo";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";
import Character from "@/components/Character";

export default async function TypeDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: raw } = await params;
  const type = raw.toUpperCase();
  if (!CHARACTERS[type]) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("mbti")
    .eq("user_id", user.id)
    .maybeSingle();

  const c = getCharacter(type);
  const info = TYPE_INFO[type];
  const celebs = (CELEBRITIES[type] ?? []).slice(0, MAX_CELEBRITIES);

  return (
    <main className="page" style={{ ["--accent" as string]: c.accent }}>
      <div className="card center">
        <Character mbti={type} size={190} />
        <div className="seal-tag">{type}</div>
        <h1>{info.nickname}</h1>
        <p>
          어울리는 강아지는 <strong>{c.name}</strong>
        </p>
        <p className="muted">{c.title}</p>
        {me?.mbti === type && <p className="muted">내 유형이에요 🐾</p>}
      </div>

      <div className="card">
        <h2>이런 성격이에요</h2>
        <div className="divider" />
        <p>{info.summary}</p>
        <p className="muted" style={{ marginTop: 8 }}>
          한 줄 요약: {MBTI_DESCRIPTIONS[type]}
        </p>
      </div>

      <div className="card">
        <h2>강점과 약점</h2>
        <div className="divider" />
        <h3 className="sub">이런 점이 멋져요</h3>
        <ul className="bullets">
          {info.strengths.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className="sub">이런 점은 조심해요</h3>
        <ul className="bullets">
          {info.weaknesses.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>관계별 해석</h2>
        <div className="divider" />
        <h3 className="sub">연애</h3>
        <p>{info.love}</p>
        <h3 className="sub">일</h3>
        <p>{info.work}</p>
        <h3 className="sub">친구</h3>
        <p>{info.friends}</p>
      </div>

      {celebs.length > 0 && (
        <div className="card">
          <h2>이 유형으로 자주 얘기되는 연예인</h2>
          <div className="divider" />
          <p className="chips">
            {celebs.map((n) => (
              <span key={n} className="chip">
                {n}
              </span>
            ))}
          </p>
          <p className="muted" style={{ marginTop: 12 }}>
            {CELEBRITY_NOTICE}
          </p>
        </div>
      )}

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/types">← 유형 도감으로</Link>
      </p>
    </main>
  );
}
