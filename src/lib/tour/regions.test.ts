import { describe, expect, it } from "vitest";
import { regionFromCodes, resolveRegion } from "./regions";

describe("resolveRegion", () => {
  it("시도 이름과 줄임말을 찾는다", () => {
    expect(resolveRegion("제주")).toEqual([{ areaCode: "39", label: "제주특별자치도" }]);
    expect(resolveRegion("경북")).toEqual([{ areaCode: "35", label: "경상북도" }]);
    expect(resolveRegion("광주")).toEqual([{ areaCode: "5", label: "광주" }]);
  });

  it("시군구 이름은 '시/군/구'를 붙이든 빼든 찾는다", () => {
    expect(resolveRegion("강릉")).toEqual([{ areaCode: "32", sigunguCode: "1", label: "강원특별자치도 강릉시" }]);
    expect(resolveRegion("강릉시")).toEqual(resolveRegion("강릉"));
  });

  it("'광주시'는 광주광역시가 아니라 경기 광주시로 찾는다", () => {
    const [r] = resolveRegion("광주시");
    expect(r.areaCode).toBe("31");
    expect(r.label).toBe("경기도 광주시");
  });

  it("같은 이름이 여러 곳이면 후보를 모두 돌려준다", () => {
    expect(resolveRegion("고성").map((r) => r.label)).toEqual(["강원특별자치도 고성군", "경상남도 고성군"]);
    expect(resolveRegion("중구").length).toBeGreaterThan(3);
  });

  it("시도와 함께 입력하면 그 시도 안에서만 찾는다", () => {
    expect(resolveRegion("부산 중구")).toEqual([{ areaCode: "6", sigunguCode: "15", label: "부산 중구" }]);
    expect(resolveRegion("서울 강남")).toEqual([{ areaCode: "1", sigunguCode: "1", label: "서울 강남구" }]);
  });

  it("없는 지역이나 빈 입력은 빈 배열", () => {
    expect(resolveRegion("아틀란티스")).toEqual([]);
    expect(resolveRegion("   ")).toEqual([]);
  });
});

describe("regionFromCodes", () => {
  it("코드를 검증해서 지역으로 바꾼다", () => {
    expect(regionFromCodes("1")).toEqual({ areaCode: "1", label: "서울" });
    expect(regionFromCodes("32", "1")?.label).toBe("강원특별자치도 강릉시");
  });

  it("잘못된 시도 코드는 undefined, 잘못된 시군구 코드는 시도만 남긴다", () => {
    expect(regionFromCodes("999")).toBeUndefined();
    expect(regionFromCodes(undefined)).toBeUndefined();
    expect(regionFromCodes("1", "999")).toEqual({ areaCode: "1", label: "서울" });
  });
});
