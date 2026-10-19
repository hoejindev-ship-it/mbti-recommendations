import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCharacter } from "@/lib/mbti/characters";
import { findTopic, TOPICS } from "@/lib/mbti/topics";

export default async function RecommendPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

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

  const { data: items } = await supabase
    .from("recommendations")
    .select("id, title, description")
    .eq("mbti", profile.mbti)
    .eq("topic", topic.slug)
    .order("sort_order");

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          {topic.label} <em>추천</em>
        </div>
        <p className="brand-sub">
          {profile.mbti} · {character.name} ({character.title})
        </p>
      </div>

      <nav className="tabs">
        {TOPICS.map((t) => (
          <Link
            key={t.slug}
            href={`/recommend/${t.slug}`}
            className={`tab${t.slug === topic.slug ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {items && items.length > 0 ? (
        items.map((item, i) => (
          <div key={item.id} className="card rec">
            <div className="rec-no">{i + 1}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="card">아직 준비된 추천이 없어요.</div>
      )}

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/">← 홈으로</Link>
      </p>
    </main>
  );
}
