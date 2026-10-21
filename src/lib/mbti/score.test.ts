import { describe, expect, it } from "vitest";
import { AXES, QUESTIONS } from "./questions";
import { computeMbti, computeScores, mbtiFromScores, parseScores, toAxisBars } from "./score";

function answerAll(fn: (agree: "first" | "second", axis: string) => number) {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, fn(q.agree, q.axis)]));
}

describe("문항 구성", () => {
  it("축마다 12문항이고 앞/뒤 글자 문항이 6개씩이다", () => {
    expect(QUESTIONS).toHaveLength(48);
    for (const axis of AXES) {
      const qs = QUESTIONS.filter((q) => q.axis === axis);
      expect(qs).toHaveLength(12);
      expect(qs.filter((q) => q.agree === "first")).toHaveLength(6);
    }
  });

  it("id가 1부터 연속이고 같은 축 문항이 연달아 나오지 않는다", () => {
    QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
      if (i > 0) expect(q.axis).not.toBe(QUESTIONS[i - 1].axis);
    });
  });
});

describe("computeMbti / computeScores", () => {
  it("앞 글자 문항에 모두 동의하면 ESTJ, 모든 축 100%", () => {
    const answers = answerAll((a) => (a === "first" ? 5 : 1));
    expect(computeMbti(answers)).toBe("ESTJ");
    expect(computeScores(answers)).toEqual({ EI: 100, SN: 100, TF: 100, JP: 100 });
  });

  it("뒤 글자 문항에 모두 동의하면 INFP, 모든 축 0%", () => {
    const answers = answerAll((a) => (a === "second" ? 5 : 1));
    expect(computeMbti(answers)).toBe("INFP");
    expect(computeScores(answers)).toEqual({ EI: 0, SN: 0, TF: 0, JP: 0 });
  });

  it("축별로 섞인 응답: 외향·직관·사고·인식 = ENTP", () => {
    const answers = answerAll((agree, axis) => {
      const wantFirst = axis === "EI" || axis === "TF";
      return agree === (wantFirst ? "first" : "second") ? 5 : 1;
    });
    expect(computeMbti(answers)).toBe("ENTP");
  });

  it("모두 보통(3)이면 50%로 동점이며 앞 글자 ESTJ", () => {
    const answers = answerAll(() => 3);
    expect(computeScores(answers)).toEqual({ EI: 50, SN: 50, TF: 50, JP: 50 });
    expect(computeMbti(answers)).toBe("ESTJ");
  });

  it("모든 문항에 '그렇다(5)'만 눌러도 앞/뒤 문항이 상쇄되어 50%", () => {
    expect(computeScores(answerAll(() => 5))).toEqual({ EI: 50, SN: 50, TF: 50, JP: 50 });
  });

  it("답변이 빠지면 에러", () => {
    expect(() => computeMbti({ 1: 3 })).toThrow();
  });
});

describe("toAxisBars / parseScores", () => {
  it("앞/뒤 비율의 합이 100이고 경계(45~55%)를 표시한다", () => {
    const bars = toAxisBars({ EI: 62, SN: 50, TF: 20, JP: 45 });
    expect(bars[0]).toMatchObject({ first: { letter: "E", percent: 62 }, second: { letter: "I", percent: 38 }, borderline: false });
    expect(bars[1].borderline).toBe(true);
    expect(bars[2].second).toEqual({ letter: "F", percent: 80 });
    expect(bars[3].borderline).toBe(true);
    for (const b of bars) expect(b.first.percent + b.second.percent).toBe(100);
  });

  it("비율로 계산한 유형이 일치한다", () => {
    expect(mbtiFromScores({ EI: 40, SN: 70, TF: 49, JP: 50 })).toBe("ISFJ");
  });

  it("잘못된 형태의 값은 null", () => {
    expect(parseScores(null)).toBeNull();
    expect(parseScores({ EI: 50 })).toBeNull();
    expect(parseScores({ EI: 50, SN: 120, TF: 1, JP: 2 })).toBeNull();
    expect(parseScores({ EI: 50, SN: 60, TF: 1, JP: 2 })).toEqual({ EI: 50, SN: 60, TF: 1, JP: 2 });
  });
});
