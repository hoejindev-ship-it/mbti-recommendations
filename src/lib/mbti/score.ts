import { QUESTIONS, type Axis } from "./questions";

const LETTERS: Record<Axis, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

/**
 * answers: 문항 id -> 1~5 점수.
 * 축별로 (점수 - 3)을 앞 글자 방향이면 +, 뒤 글자 방향이면 -로 합산한다.
 * 합이 0 이상이면 앞 글자(E/S/T/J), 음수면 뒤 글자(I/N/F/P).
 */
export function computeMbti(answers: Record<number, number>): string {
  const totals: Record<Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`문항 ${q.id}의 답변이 올바르지 않습니다.`);
    }
    totals[q.axis] += (value - 3) * (q.agree === "first" ? 1 : -1);
  }

  return (Object.keys(LETTERS) as Axis[])
    .map((axis) => LETTERS[axis][totals[axis] >= 0 ? 0 : 1])
    .join("");
}
