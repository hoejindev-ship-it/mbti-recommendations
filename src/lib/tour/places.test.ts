import { describe, expect, it } from "vitest";
import { categoryParams, pickPlaces, toPlace, type Place, type PlaceFetcher } from "./places";

const region = { areaCode: "1", label: "서울" };
const place = (id: string): Place => ({ id, title: `장소${id}`, address: "" });

function fakeFetcher(data: Record<string, Place[] | Error>) {
  const calls: string[] = [];
  const fetcher: PlaceFetcher = async (_region, code) => {
    calls.push(code);
    const v = data[code] ?? [];
    if (v instanceof Error) throw v;
    return v;
  };
  return { fetcher, calls };
}

describe("categoryParams", () => {
  it("코드 길이에 맞춰 대/중/소분류를 채운다", () => {
    expect(categoryParams("A05")).toEqual({ cat1: "A05" });
    expect(categoryParams("A0502")).toEqual({ cat1: "A05", cat2: "A0502" });
    expect(categoryParams("A05020100")).toEqual({ cat1: "A05", cat2: "A0502", cat3: "A05020100" });
  });
});

describe("toPlace", () => {
  it("좌표·이미지·전화번호를 정리한다", () => {
    const p = toPlace({
      contentid: "1", title: "가게", addr1: "서울 중구", addr2: "1층",
      mapx: "126.97", mapy: "37.56", firstimage: "http://tong.visitkorea.or.kr/a.jpg",
      tel: "02-123-4567<br>010-1", cat3: "A05020100",
    });
    expect(p).toEqual({
      id: "1", title: "가게", address: "서울 중구 1층", tel: "02-123-4567 010-1",
      image: "https://tong.visitkorea.or.kr/a.jpg", lat: 37.56, lng: 126.97, category: "한식",
    });
  });

  it("좌표가 비었거나 0이면 지도 정보를 넣지 않는다", () => {
    const p = toPlace({ contentid: "1", title: "가게", mapx: "", mapy: "0" });
    expect(p.lat).toBeUndefined();
    expect(p.lng).toBeUndefined();
  });
});

describe("pickPlaces", () => {
  it("문구마다 서로 다른 장소를 하나씩 고른다", async () => {
    const { fetcher } = fakeFetcher({ A05020100: [place("1"), place("2"), place("3")] });
    const { places, failed } = await pickPlaces(region, [["A05020100"], ["A05020100"], ["A05020100"]], [], fetcher, () => 0);
    expect(places.map((p) => p?.id)).toEqual(["1", "2", "3"]);
    expect(failed).toBe(false);
  });

  it("앞 코드에 결과가 없으면 다음 코드, 그다음 주제 전체로 넘어간다", async () => {
    const { fetcher } = fakeFetcher({ B: [place("b")], F: [place("f")] });
    const { places } = await pickPlaces(region, [["A", "B"], ["A"]], ["F"], fetcher, () => 0);
    expect(places.map((p) => p?.id)).toEqual(["b", "f"]);
    expect(places.map((p) => p?.fallback)).toEqual([undefined, true]);
  });

  it("후보가 모자라면 남는 자리는 null", async () => {
    const { fetcher } = fakeFetcher({ A: [place("1")] });
    const { places, failed } = await pickPlaces(region, [["A"], ["A"], ["A"]], [], fetcher, () => 0);
    expect(places.map((p) => p?.id ?? null)).toEqual(["1", null, null]);
    expect(failed).toBe(false);
  });

  it("같은 코드는 한 번만 요청한다", async () => {
    const { fetcher, calls } = fakeFetcher({ A: [place("1"), place("2")] });
    await pickPlaces(region, [["A"], ["A"]], [], fetcher, () => 0);
    expect(calls).toEqual(["A"]);
  });

  it("요청이 일부 실패해도 다른 코드로 이어 가고, 모두 실패하면 failed", async () => {
    const partial = fakeFetcher({ A: new Error("x"), B: [place("b")] });
    const r1 = await pickPlaces(region, [["A", "B"]], [], partial.fetcher);
    expect(r1.places[0]?.id).toBe("b");
    expect(r1.failed).toBe(false);

    const all = fakeFetcher({ A: new Error("x") });
    const r2 = await pickPlaces(region, [["A"]], [], all.fetcher);
    expect(r2).toEqual({ places: [null], failed: true });
  });
});
