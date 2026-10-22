import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TourAPI(한국관광공사 국문 관광정보) 연동 전 응답 구조를 확인하기 위한 임시 점검용 엔드포인트.
// 로그인한 사용자만 호출할 수 있고, 인증키는 응답에 절대 포함하지 않는다.
const BASE = "https://apis.data.go.kr/B551011/KorService2";

type Probe = { name: string; op: string; params: Record<string, string> };

const PROBES: Probe[] = [
  { name: "관광지(12) 서울", op: "areaBasedList2", params: { contentTypeId: "12", areaCode: "1" } },
  { name: "음식점(39) 서울", op: "areaBasedList2", params: { contentTypeId: "39", areaCode: "1" } },
  { name: "쇼핑(38) 서울", op: "areaBasedList2", params: { contentTypeId: "38", areaCode: "1" } },
  { name: "키워드 '북카페'", op: "searchKeyword2", params: { keyword: "북카페" } },
  { name: "지역코드", op: "areaCode2", params: {} },
];

async function runProbe(key: string, probe: Probe) {
  const qs = new URLSearchParams({
    serviceKey: key,
    MobileOS: "ETC",
    MobileApp: "mbti-recommendations",
    _type: "json",
    numOfRows: "3",
    pageNo: "1",
    ...probe.params,
  });
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}/${probe.op}?${qs}`, { cache: "no-store" });
    const text = await res.text();
    let body: unknown = null;
    try {
      body = JSON.parse(text);
    } catch {
      return { ...probe, status: res.status, ms: Date.now() - started, raw: text.slice(0, 400) };
    }
    const response = (body as { response?: Record<string, unknown> }).response ?? {};
    const header = response.header as { resultCode?: string; resultMsg?: string } | undefined;
    const b = response.body as
      | { totalCount?: number; items?: { item?: Record<string, unknown>[] } | "" }
      | undefined;
    const items = b && b.items && typeof b.items === "object" ? b.items.item ?? [] : [];
    return {
      ...probe,
      status: res.status,
      ms: Date.now() - started,
      resultCode: header?.resultCode,
      resultMsg: header?.resultMsg,
      totalCount: b?.totalCount,
      fields: items[0] ? Object.keys(items[0]) : [],
      samples: items,
      raw: header ? undefined : text.slice(0, 400),
    };
  } catch (e) {
    return { ...probe, error: e instanceof Error ? e.message.replaceAll(key, "***") : "unknown" };
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = process.env.TOUR_API_KEY;
  if (!key) return NextResponse.json({ error: "TOUR_API_KEY not set" }, { status: 500 });

  const results = [];
  for (const probe of PROBES) results.push(await runProbe(key, probe));
  const json = JSON.stringify({ keyLength: key.length, results }).replaceAll(key, "***");
  return new NextResponse(json, { headers: { "content-type": "application/json" } });
}
