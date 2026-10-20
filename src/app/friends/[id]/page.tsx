import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCharacter } from "@/lib/mbti/characters";
import { computeCompatibility } from "@/lib/mbti/compatibility";
import Character from "@/components/Character";

export default async function CompatibilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("mbti, nickname")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me?.mbti) redirect("/test");

  // 수락된 친구만 목록에 MBTI가 포함된다
  const { data } = await supabase.rpc("list_friendships");
  const friend = (
    (data ?? []) as {
      friend_id: string;
      nickname: string;
      mbti: string | null;
      status: string;
    }[]
  ).find((r) => r.friend_id === id && r.status === "accepted");
  if (!friend || !friend.mbti) notFound();

  const mine = getCharacter(me.mbti);
  const theirs = getCharacter(friend.mbti);
  const result = computeCompatibility(me.mbti, friend.mbti);

  return (
    <main className="page" style={{ ["--accent" as string]: mine.accent }}>
      <div className="brand">
        <div className="brand-badge">
          우리의 <em>궁합</em>
        </div>
      </div>

      <div className="card center">
        <div className="duo">
          <div style={{ ["--accent" as string]: mine.accent }}>
            <Character mbti={me.mbti} size={120} />
            <div className="seal-tag">{me.mbti}</div>
            <div>{me.nickname ?? "나"}</div>
          </div>
          <div className="duo-x">×</div>
          <div style={{ ["--accent" as string]: theirs.accent }}>
            <Character mbti={friend.mbti} size={120} />
            <div className="seal-tag">{friend.mbti}</div>
            <div>{friend.nickname}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="score">{result.score}점</div>
        <h1>{result.grade}</h1>
        <p>{result.headline}</p>
      </div>

      <div className="card">
        <h2>이런 점이 잘 맞아요</h2>
        <div className="divider" />
        <ul className="bullets">
          {result.strengths.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>이런 점을 보완해 보세요</h2>
        <div className="divider" />
        <ul className="bullets">
          {result.complements.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>성향 비교</h2>
        <div className="divider" />
        <div className="stack">
          {result.axes.map((a) => (
            <div key={a.axis} className="axis">
              <div className="axis-head">
                <strong>{a.label}</strong>
                <span className={a.same ? "tag same" : "tag diff"}>{a.same ? "같아요" : "달라요"}</span>
              </div>
              <div className="muted">
                {a.mine} · {a.theirs}
              </div>
            </div>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          궁합은 재미로 보는 참고용이에요. 실제 관계는 서로의 노력으로 만들어져요.
        </p>
      </div>

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/friends">← 친구 목록으로</Link>
      </p>
    </main>
  );
}
