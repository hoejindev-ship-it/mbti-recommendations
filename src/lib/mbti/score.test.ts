import { describe, expect, it } from "vitest";
import { QUESTIONS } from "./questions";
import { computeMbti } from "./score";

function answerAll(fn: (agree: "first" | "second", axis: string) => number) {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, fn(q.agree, q.axis)]));
}

describe("computeMbti", () => {
  it("앞 글자 문항에 모두 동의하면 ESTJ", () => {
    expect(computeMbti(answerAll((a) => (a === "first" ? 5 : 1)))).toBe("ESTJ");
  });

  it("뒤 글자 문항에 모두 동의하면 INFP", () => {
    expect(computeMbti(answerAll((a) => (a === "second" ? 5 : 1)))).toBe("INFP");
  });

  it("축별로 섞인 응답: 외향·직관·사고·인식 = ENTP", () => {
    const answers = answerAll((agree, axis) => {
      const wantFirst = axis === "EI" || axis === "TF";
      return agree === (wantFirst ? "first" : "second") ? 5 : 1;
    });
    expect(computeMbti(answers)).toBe("ENTP");
  });

  it("모두 보통(3)이면 동점이므로 앞 글자 ESTJ", () => {
    expect(computeMbti(answerAll(() => 3))).toBe("ESTJ");
  });

  it("답변이 빠지면 에러", () => {
    expect(() => computeMbti({ 1: 3 })).toThrow();
  });
});
