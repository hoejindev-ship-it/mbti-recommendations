import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";
import { getCharacter } from "@/lib/mbti/characters";
import Character from "@/components/Character";

export default async function ResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("mbti")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.mbti) redirect("/test");
  const character = getCharacter(profile.mbti);

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          검사 <em>결과</em>
        </div>
      </div>
      <div className="card center">
        <Character mbti={profile.mbti} size={200} />
        <div className="seal-tag">{profile.mbti}</div>
        <h1>당신은 {character.name}!</h1>
        <p className="muted">{character.title}</p>
        <p>{MBTI_DESCRIPTIONS[profile.mbti]}</p>
        <div className="haori" />
        <div className="stack">
          <Link href="/" className="btn">
            추천 받으러 가기
          </Link>
          <Link href="/test" className="btn btn-ghost">
            다시 검사하기
          </Link>
        </div>
      </div>
    </main>
  );
}
