import { describe, expect, it } from "vitest";
import { CHARACTERS } from "./characters";
import { computeCompatibility } from "./compatibility";

const TYPES = Object.keys(CHARACTERS);

describe("computeCompatibility", () => {
  it("모든 조합의 점수가 0~100 범위이고 4개 축을 분석한다", () => {
    for (const a of TYPES) {
      for (const b of TYPES) {
        const r = computeCompatibility(a, b);
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
        expect(r.axes).toHaveLength(4);
      }
    }
  });

  it("점수는 서로 바꿔도 같다(대칭)", () => {
    for (const a of TYPES) {
      for (const b of TYPES) {
        expect(computeCompatibility(a, b).score).toBe(computeCompatibility(b, a).score);
      }
    }
  });

  it("같은 유형끼리는 모든 축이 same", () => {
    const r = computeCompatibility("ENFP", "ENFP");
    expect(r.axes.every((x) => x.same)).toBe(true);
  });

  it("축이 모두 다르면 different로 표시", () => {
    const r = computeCompatibility("ISTJ", "ENFP");
    expect(r.axes.every((x) => !x.same)).toBe(true);
  });
});

describe("점수 분포", () => {
  it("점수가 넓게 퍼지고 등급이 여러 종류 나온다", () => {
    const scores = TYPES.flatMap((a) => TYPES.map((b) => computeCompatibility(a, b).score));
    expect(Math.min(...scores)).toBeLessThanOrEqual(50);
    expect(Math.max(...scores)).toBeGreaterThanOrEqual(95);
    const grades = new Set(
      TYPES.flatMap((a) => TYPES.map((b) => computeCompatibility(a, b).grade))
    );
    expect(grades.size).toBeGreaterThanOrEqual(4);
  });
});
