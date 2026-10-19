import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MBTI_DESCRIPTIONS } from "@/lib/mbti/descriptions";

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

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 16px" }}>
      <p>나의 MBTI</p>
      <h1 style={{ fontSize: 56 }}>{profile.mbti}</h1>
      <p>{MBTI_DESCRIPTIONS[profile.mbti]}</p>
      <p>
        <Link href="/">홈으로</Link> · <Link href="/test">다시 검사하기</Link>
      </p>
    </main>
  );
}
