import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTERS, getCharacter } from "@/lib/mbti/characters";
import { TYPE_INFO } from "@/lib/mbti/typeInfo";
import Character from "@/components/Character";

export default async function TypesPage() {
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
  const mine = getCharacter(me?.mbti);

  return (
    <main className="page" style={{ ["--accent" as string]: mine.accent }}>
      <div className="brand">
        <div className="brand-badge">
          MBTI <em>유형</em> 도감
        </div>
        <p className="brand-sub">16가지 유형과 어울리는 강아지를 만나 보세요</p>
      </div>

      <div className="type-grid">
        {Object.keys(CHARACTERS)
          .sort()
          .map((type) => {
            const c = CHARACTERS[type];
            return (
              <Link
                key={type}
                href={`/types/${type}`}
                className={`type-card${me?.mbti === type ? " mine" : ""}`}
                style={{ ["--accent" as string]: c.accent }}
              >
                <Character mbti={type} size={96} />
                <strong>{type}</strong>
                <span>{c.name}</span>
                <span className="muted">{TYPE_INFO[type].nickname}</span>
                {me?.mbti === type && <em className="mine-tag">나</em>}
              </Link>
            );
          })}
      </div>

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/">← 홈으로</Link>
      </p>
    </main>
  );
}
