"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
      else if (data.session) {
        router.push("/");
        router.refresh();
      } else setMessage("가입 확인 메일을 보냈습니다. 메일의 링크를 눌러 주세요.");
    }
    setLoading(false);
  }

  return (
    <main className="page">
      <div className="brand">
        <div className="brand-badge">
          MBTI <em>맞춤</em> 추천
        </div>
        <p className="brand-sub">나의 성격에 맞는 여행 · 맛집 · 쇼핑</p>
      </div>
      <div className="card">
        <h1>{mode === "login" ? "로그인" : "회원가입"}</h1>
        <div className="haori" />
        <form onSubmit={handleSubmit} className="stack">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
          </button>
        </form>
        {message && <p role="alert">{message}</p>}
        <p style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage(null);
            }}
          >
            {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </button>
        </p>
      </div>
    </main>
  );
}
