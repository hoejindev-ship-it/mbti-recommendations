"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QUESTIONS, SCALE_LABELS } from "@/lib/mbti/questions";
import { computeMbti, computeScores } from "@/lib/mbti/score";

const STORAGE_KEY = "mbti-test-progress-v2";

export default function TestPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resumed, setResumed] = useState(false);

  // 새로고침해도 이어서 풀 수 있도록 진행 상황을 브라우저에 임시 저장한다.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved.index === "number" && saved.index > 0 && saved.index < QUESTIONS.length) {
        setAnswers(saved.answers ?? {});
        setIndex(saved.index);
        setResumed(true);
      }
    } catch {
      // 저장소를 쓸 수 없으면 처음부터 진행한다.
    }
  }, []);

  function persist(nextIndex: number, nextAnswers: Record<number, number>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ index: nextIndex, answers: nextAnswers }));
    } catch {
      // 무시
    }
  }

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
        scores: computeScores(finalAnswers),
        tested_at: new Date().toISOString(),
      });
    if (error) {
      setError("결과를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setSaving(false);
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 무시
    }
    router.push("/result");
    router.refresh();
  }

  function choose(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (isLast) save(next);
    else {
      setIndex(index + 1);
      persist(index + 1, next);
    }
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
        {resumed && index > 0 && (
          <div className="resume">이전에 풀던 곳({index + 1}번)부터 이어서 시작해요.</div>
        )}
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
