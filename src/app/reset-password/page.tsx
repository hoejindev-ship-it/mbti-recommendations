"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("비밀번호가 서로 달라요.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(
        error.message.toLowerCase().includes("different")
          ? "이전과 다른 비밀번호를 입력해 주세요."
          : "비밀번호를 바꾸지 못했어요. 링크를 다시 받아 시도해 주세요."
      );
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="page">
      <div className="brand">
        <div className="brand-badge">
          새 <em>비밀번호</em>
        </div>
      </div>
      <div className="card">
        <h1>새 비밀번호 설정</h1>
        <div className="divider" />
        <form onSubmit={handleSubmit} className="stack">
          <input
            type="password"
            placeholder="새 비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "변경 중..." : "비밀번호 변경하기"}
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      </div>
    </main>
  );
}
