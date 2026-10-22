import { SIDO } from "./regionCodes";

export type Region = { areaCode: string; sigunguCode?: string; label: string };

// 화면 상단에 버튼으로 보여 줄 지역. 나머지는 "그 외(직접 입력)"로 찾는다.
export const QUICK_REGIONS = ["1", "2", "3", "4", "5", "7", "6"].map((code) => {
  const sido = SIDO.find((s) => s.code === code)!;
  return { areaCode: code, label: sido.name };
});

// 입력하기 쉬운 줄임말 → 시도 코드
const SIDO_ALIASES: Record<string, string> = {
  서울특별시: "1", 서울시: "1",
  인천광역시: "2", 인천시: "2",
  대전광역시: "3", 대전시: "3",
  대구광역시: "4", 대구시: "4",
  광주광역시: "5",
  부산광역시: "6", 부산시: "6",
  울산광역시: "7", 울산시: "7",
  세종: "8", 세종시: "8",
  경기: "31",
  강원: "32", 강원도: "32",
  충북: "33",
  충남: "34",
  경북: "35",
  경남: "36",
  전북: "37", 전라북도: "37",
  전남: "38",
  제주: "39", 제주도: "39",
};

const normalize = (s: string) => s.replace(/\s+/g, "");
// "강릉시" → "강릉", "해운대구" → "해운대" (단, "중구"처럼 한 글자가 되면 그대로 둔다)
const stripSuffix = (s: string) => (s.length > 2 ? s.replace(/[시군구]$/, "") : s);

function sidoLabel(code: string) {
  return SIDO.find((s) => s.code === code)!.name;
}

function findSido(token: string): string | undefined {
  const t = normalize(token);
  if (SIDO_ALIASES[t]) return SIDO_ALIASES[t];
  return SIDO.find((s) => s.name === t || (t.length >= 2 && s.name.startsWith(t)))?.code;
}

function findSigungu(token: string, onlySido?: string): Region[] {
  const t = stripSuffix(normalize(token));
  if (!t) return [];
  const found: Region[] = [];
  for (const s of SIDO) {
    if (onlySido && s.code !== onlySido) continue;
    for (const [code, name] of s.sigungu) {
      if (stripSuffix(name) === t) {
        found.push({ areaCode: s.code, sigunguCode: code, label: `${s.name} ${name}` });
      }
    }
  }
  return found;
}

/**
 * 직접 입력한 지역 이름을 TourAPI 지역 코드로 바꾼다.
 * "강릉", "부산 해운대구", "경북" 같은 입력을 받으며, 같은 이름이 여러 곳이면 후보를 모두 돌려준다.
 * 시도 이름과 시군구 이름이 겹치는 경우(예: 경기 광주시 / 광주광역시)는 시도를 우선한다.
 */
export function resolveRegion(input: string): Region[] {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  if (tokens.length >= 2) {
    const sido = findSido(tokens[0]);
    if (sido) {
      const rest = tokens.slice(1).join("");
      const matches = findSigungu(rest, sido);
      if (matches.length > 0) return matches;
    }
  }

  const sido = findSido(tokens.join(""));
  if (sido) return [{ areaCode: sido, label: sidoLabel(sido) }];

  return findSigungu(tokens.join(""));
}

/** URL 쿼리(area, sigungu)를 검증해서 지역으로 바꾼다. 잘못된 값이면 undefined. */
export function regionFromCodes(area?: string, sigungu?: string): Region | undefined {
  const sido = SIDO.find((s) => s.code === area);
  if (!sido) return undefined;
  if (!sigungu) return { areaCode: sido.code, label: sido.name };
  const sgg = sido.sigungu.find(([code]) => code === sigungu);
  if (!sgg) return { areaCode: sido.code, label: sido.name };
  return { areaCode: sido.code, sigunguCode: sgg[0], label: `${sido.name} ${sgg[1]}` };
}
