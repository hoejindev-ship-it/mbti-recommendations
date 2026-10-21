import { AXES, QUESTIONS, type Axis } from "./questions";

const LETTERS: Record<Axis, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

export type AxisScores = Record<Axis, number>;

/**
 * answers: 문항 id -> 1~5 점수.
 * 축별로 (점수 - 3)을 앞 글자 방향이면 +, 뒤 글자 방향이면 -로 합산해
 * 앞 글자(E/S/T/J) 쪽 비율을 0~100(%)으로 돌려준다. 50이면 정확히 중간이다.
 */
export function computeScores(answers: Record<number, number>): AxisScores {
  const raw: AxisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const max: AxisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`문항 ${q.id}의 답변이 올바르지 않습니다.`);
    }
    raw[q.axis] += (value - 3) * (q.agree === "first" ? 1 : -1);
    max[q.axis] += 2;
  }

  const scores = {} as AxisScores;
  for (const axis of AXES) {
    scores[axis] = Math.round(((raw[axis] + max[axis]) / (2 * max[axis])) * 100);
  }
  return scores;
}

/** 앞 글자 비율이 50% 이상이면 앞 글자(E/S/T/J), 아니면 뒤 글자(I/N/F/P). */
export function mbtiFromScores(scores: AxisScores): string {
  return AXES.map((axis) => LETTERS[axis][scores[axis] >= 50 ? 0 : 1]).join("");
}

export function computeMbti(answers: Record<number, number>): string {
  return mbtiFromScores(computeScores(answers));
}

export interface AxisBar {
  axis: Axis;
  first: { letter: string; percent: number };
  second: { letter: string; percent: number };
  /** 45~55%: 어느 쪽이라고 말하기 어려운 경계 */
  borderline: boolean;
}

export function toAxisBars(scores: AxisScores): AxisBar[] {
  return AXES.map((axis) => {
    const p = scores[axis];
    return {
      axis,
      first: { letter: LETTERS[axis][0], percent: p },
      second: { letter: LETTERS[axis][1], percent: 100 - p },
      borderline: p >= 45 && p <= 55,
    };
  });
}

/** DB에서 읽은 값이 올바른 형태일 때만 돌려준다. */
export function parseScores(value: unknown): AxisScores | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const out = {} as AxisScores;
  for (const axis of AXES) {
    const n = v[axis];
    if (typeof n !== "number" || n < 0 || n > 100) return null;
    out[axis] = n;
  }
  return out;
}
