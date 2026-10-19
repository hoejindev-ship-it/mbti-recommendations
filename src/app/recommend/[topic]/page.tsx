import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const { data: items } = await supabase
    .from("recommendations")
    .select("id, title, description")
    .eq("mbti", profile.mbti)
    .eq("topic", topic.slug)
    .order("sort_order");

  return (
    <main style={{ maxWidth: 560, margin: "60px auto", padding: "0 16px" }}>
      <p>
        <Link href="/">← 홈으로</Link>
      </p>
      <h1>
        {profile.mbti}를 위한 {topic.label} 추천
      </h1>
      <p>
        {TOPICS.map((t) => (
          <span key={t.slug} style={{ marginRight: 12 }}>
            {t.slug === topic.slug ? (
              <strong>{t.label}</strong>
            ) : (
              <Link href={`/recommend/${t.slug}`}>{t.label}</Link>
            )}
          </span>
        ))}
      </p>
      {items && items.length > 0 ? (
        <ol style={{ paddingLeft: 20 }}>
          {items.map((item) => (
            <li key={item.id} style={{ margin: "20px 0" }}>
              <strong>{item.title}</strong>
              <p style={{ margin: "4px 0 0" }}>{item.description}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>아직 준비된 추천이 없어요.</p>
      )}
    </main>
  );
}
