import { describe, expect, it } from "vitest";
import { CELEBRITIES } from "./celebrities";
import { CHARACTERS } from "./characters";
import { MBTI_DESCRIPTIONS } from "./descriptions";
import { TYPE_INFO } from "./typeInfo";

const TYPES = Object.keys(CHARACTERS).sort();

describe("유형 데이터", () => {
  it("16유형이 모든 데이터에 빠짐없이 있다", () => {
    expect(TYPES).toHaveLength(16);
    expect(Object.keys(TYPE_INFO).sort()).toEqual(TYPES);
    expect(Object.keys(CELEBRITIES).sort()).toEqual(TYPES);
    expect(Object.keys(MBTI_DESCRIPTIONS).sort()).toEqual(TYPES);
  });

  it("유형 정보에 빈 항목이 없다", () => {
    for (const t of TYPES) {
      const i = TYPE_INFO[t];
      expect(i.summary.length).toBeGreaterThan(10);
      expect(i.strengths).toHaveLength(3);
      expect(i.weaknesses).toHaveLength(3);
      expect(i.love && i.work && i.friends).toBeTruthy();
    }
  });

  it("연예인 목록에 중복이 없고 유형당 2명 이상이다", () => {
    const all = Object.values(CELEBRITIES).flat();
    expect(new Set(all).size).toBe(all.length);
    for (const t of TYPES) expect(CELEBRITIES[t].length).toBeGreaterThanOrEqual(2);
  });
});
