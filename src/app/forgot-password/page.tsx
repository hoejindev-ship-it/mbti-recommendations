"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const params = useSearchParams();
  const expired = params.get("error") === "expired";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/auth/reset`,
    });
    // 가입 여부가 드러나지 않도록 결과와 상관없이 같은 안내를 보여 준다.
    // 요청 횟수 제한에 걸린 경우만 따로 알린다.
    if (error?.status === 429) setError("요청이 너무 많아요. 잠시 후 다시 시도해 주세요.");
    else setSent(true);
    setLoading(false);
  }

  return (
    <div className="card">
      <h1>비밀번호 재설정</h1>
      <div className="divider" />
      {expired && !sent && (
        <p role="alert" style={{ marginBottom: 12 }}>
          링크가 만료되었거나 이미 사용되었어요. 다시 요청해 주세요.
        </p>
      )}
      {sent ? (
        <p role="status">
          입력한 이메일로 가입된 계정이 있다면 재설정 링크를 보냈어요. 메일함(스팸함 포함)을 확인해 주세요. 링크는 일정 시간 뒤에 만료돼요.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="stack">
          <p className="muted">가입할 때 쓴 이메일을 입력하면 비밀번호를 다시 정할 수 있는 링크를 보내 드려요.</p>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "보내는 중..." : "재설정 링크 받기"}
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      <p style={{ marginTop: 16 }}>
        <Link href="/login">← 로그인으로 돌아가기</Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <main className="page">
      <div className="brand">
        <div className="brand-badge">
          MBTI <em>맞춤</em> 추천
        </div>
      </div>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
