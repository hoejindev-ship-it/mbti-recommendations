"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QUESTIONS, SCALE_LABELS } from "@/lib/mbti/questions";
import { computeMbti } from "@/lib/mbti/score";

export default function TestPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;

  async function save(finalAnswers: Record<number, number>) {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        mbti: computeMbti(finalAnswers),
        tested_at: new Date().toISOString(),
      });
    if (error) {
      setError("결과를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setSaving(false);
      return;
    }
    router.push("/result");
    router.refresh();
  }

  function choose(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (isLast) save(next);
    else setIndex(index + 1);
  }

  return (
    <main className="page">
      <div className="brand">
        <div className="brand-badge">
          성격 <em>검사</em>
        </div>
        <p className="brand-sub">
          {index + 1} / {QUESTIONS.length}
        </p>
      </div>
      <div className="card">
        <div className="progress">
          <span style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <h2 className="question">{question.text}</h2>
        <div className="stack">
          {SCALE_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              disabled={saving}
              onClick={() => choose(i + 1)}
              className={`choice${answers[question.id] === i + 1 ? " selected" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        {error && <p role="alert">{error}</p>}
        <p style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={index === 0 || saving}
            onClick={() => setIndex(index - 1)}
          >
            이전
          </button>
        </p>
      </div>
    </main>
  );
}
