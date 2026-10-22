import { CATEGORY_NAMES } from "./categories";
import type { Region } from "./regions";

export type Place = {
  id: string;
  title: string;
  address: string;
  tel?: string;
  image?: string;
  lat?: number;
  lng?: number;
  category?: string;
  /** 유형별 분류에서 못 찾아 주제 전체에서 대신 고른 장소인지 */
  fallback?: boolean;
};

export type PlaceFetcher = (region: Region, category: string) => Promise<Place[]>;

const BASE = "https://apis.data.go.kr/B551011/KorService2";
// 같은 지역·분류 결과는 6시간 동안 Next 데이터 캐시에서 재사용한다 (개발계정 일 1,000건 제한).
const REVALIDATE_SECONDS = 60 * 60 * 6;

/** "A05020100" → { cat1: "A05", cat2: "A0502", cat3: "A05020100" } */
export function categoryParams(code: string): Record<string, string> {
  const params: Record<string, string> = { cat1: code.slice(0, 3) };
  if (code.length >= 5) params.cat2 = code.slice(0, 5);
  if (code.length >= 9) params.cat3 = code;
  return params;
}

type RawItem = Record<string, string | undefined>;

export function toPlace(item: RawItem): Place {
  const lng = Number(item.mapx);
  const lat = Number(item.mapy);
  const image = item.firstimage || item.firstimage2;
  return {
    id: item.contentid ?? "",
    title: item.title ?? "",
    address: [item.addr1, item.addr2].filter(Boolean).join(" "),
    tel: item.tel ? item.tel.replace(/<[^>]+>/g, " ").trim() || undefined : undefined,
    // 응답 이미지는 http로 오므로 https로 바꿔 혼합 콘텐츠 경고를 막는다.
    image: image ? image.replace(/^http:\/\//, "https://") : undefined,
    lat: Number.isFinite(lat) && lat !== 0 ? lat : undefined,
    lng: Number.isFinite(lng) && lng !== 0 ? lng : undefined,
    category: item.cat3 ? CATEGORY_NAMES[item.cat3] : undefined,
  };
}

/** 지역·분류로 이미지가 있는 장소를 최근 수정순으로 가져온다. */
export const fetchPlaces: PlaceFetcher = async (region, category) => {
  const key = process.env.TOUR_API_KEY;
  if (!key) throw new Error("TOUR_API_KEY가 설정되지 않았습니다.");
  const qs = new URLSearchParams({
    serviceKey: key,
    MobileOS: "ETC",
    MobileApp: "mbti-recommendations",
    _type: "json",
    arrange: "Q",
    numOfRows: "30",
    pageNo: "1",
    areaCode: region.areaCode,
    ...(region.sigunguCode ? { sigunguCode: region.sigunguCode } : {}),
    ...categoryParams(category),
  });
  const res = await fetch(`${BASE}/areaBasedList2?${qs}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`TourAPI HTTP ${res.status}`);
  const body = await res.json();
  const code = body?.response?.header?.resultCode;
  if (code !== "0000") throw new Error(`TourAPI resultCode ${code ?? "unknown"}`);
  const items = body.response.body?.items;
  const list: RawItem[] = items && typeof items === "object" ? [items.item ?? []].flat() : [];
  return list.map(toPlace).filter((p) => p.id && p.title);
};

/**
 * 추천 문구마다 장소를 하나씩 고른다.
 * 문구별 분류 코드를 앞에서부터 찾아보고, 없으면 주제 전체(fallback)에서 찾는다.
 * 같은 장소가 두 번 나오지 않게 하고, 후보 중에서는 무작위로 골라 볼 때마다 조금씩 달라지게 한다.
 */
export async function pickPlaces(
  region: Region,
  criteria: string[][],
  fallback: string[],
  fetcher: PlaceFetcher = fetchPlaces,
  random: () => number = Math.random
): Promise<{ places: (Place | null)[]; failed: boolean }> {
  const cache = new Map<string, Promise<Place[] | null>>();
  const load = (code: string) => {
    if (!cache.has(code)) cache.set(code, fetcher(region, code).catch(() => null));
    return cache.get(code)!;
  };
  // 첫 번째 코드들은 미리 한꺼번에 요청해 기다리는 시간을 줄인다.
  criteria.forEach((codes) => codes[0] && load(codes[0]));

  const used = new Set<string>();
  const places: (Place | null)[] = [];
  let anySucceeded = false;
  for (const codes of criteria) {
    let chosen: Place | null = null;
    const steps = [...codes.map((code) => ({ code, fallback: false })), ...fallback.map((code) => ({ code, fallback: true }))];
    for (const step of steps) {
      const list = await load(step.code);
      if (list === null) continue;
      anySucceeded = true;
      const candidates = list.filter((p) => !used.has(p.id));
      if (candidates.length > 0) {
        const picked = candidates[Math.floor(random() * candidates.length)];
        chosen = step.fallback ? { ...picked, fallback: true } : picked;
        break;
      }
    }
    if (chosen) used.add(chosen.id);
    places.push(chosen);
  }
  return { places, failed: !anySucceeded };
}
