import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../mbti/characters";
import { TOPICS } from "../mbti/topics";
import { CATEGORY_NAMES } from "./categories";
import { CRITERIA, TOPIC_FALLBACK } from "./criteria";

describe("유형별 장소 분류 코드", () => {
  it("16유형 x 3주제 x 3문구가 빠짐없이 있다", () => {
    expect(Object.keys(CRITERIA).sort()).toEqual(Object.keys(CHARACTERS).sort());
    for (const byTopic of Object.values(CRITERIA)) {
      for (const t of TOPICS) {
        expect(byTopic[t.slug]).toHaveLength(3);
        for (const codes of byTopic[t.slug]) expect(codes.length).toBeGreaterThan(0);
      }
    }
  });

  it("모든 코드가 TourAPI 분류 코드표에 있다", () => {
    const all = [
      ...Object.values(CRITERIA).flatMap((byTopic) => Object.values(byTopic).flat(2)),
      ...Object.values(TOPIC_FALLBACK).flat(),
    ];
    for (const code of all) expect(CATEGORY_NAMES[code], code).toBeDefined();
  });
});
