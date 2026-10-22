import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PlaceMap from "@/components/PlaceMap";
import { createClient } from "@/lib/supabase/server";
import { getCharacter } from "@/lib/mbti/characters";
import { findTopic, TOPICS } from "@/lib/mbti/topics";
import { CRITERIA, TOPIC_FALLBACK } from "@/lib/tour/criteria";
import { pickPlaces, type Place } from "@/lib/tour/places";
import { QUICK_REGIONS, regionFromCodes, resolveRegion, type Region } from "@/lib/tour/regions";

type SearchParams = { area?: string; sigungu?: string; q?: string };

function regionQuery(region: Region) {
  const qs = new URLSearchParams({ area: region.areaCode });
  if (region.sigunguCode) qs.set("sigungu", region.sigunguCode);
  return qs.toString();
}

export default async function RecommendPage({
  params,
  searchParams,
}: {
  params: Promise<{ topic: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { topic: slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();
  const query = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("mbti")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.mbti) redirect("/test");
  const character = getCharacter(profile.mbti);

  // 지역: 직접 입력(q) → 코드(area/sigungu) → 기본값 서울 순서로 정한다.
  const typed = query.q?.trim() ?? "";
  const candidates = typed ? resolveRegion(typed) : [];
  const region: Region | undefined = typed
    ? candidates.length === 1
      ? candidates[0]
      : undefined
    : regionFromCodes(query.area, query.sigungu) ?? regionFromCodes("1");
  const isQuick = !!region && !region.sigunguCode && QUICK_REGIONS.some((r) => r.areaCode === region.areaCode);

  const { data: items } = await supabase
    .from("recommendations")
    .select("id, title, description")
    .eq("mbti", profile.mbti)
    .eq("topic", topic.slug)
    .order("sort_order");

  const criteria = CRITERIA[profile.mbti]?.[topic.slug];
  const result =
    region && criteria
      ? await pickPlaces(region, criteria, TOPIC_FALLBACK[topic.slug])
      : { places: [] as (Place | null)[], failed: false };

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          {topic.label} <em>추천</em>
        </div>
        <p className="brand-sub">
          {profile.mbti} · {character.name} ({character.title})
        </p>
      </div>

      <section className="card region-picker" aria-label="지역 선택">
        <h2>어디로 갈까요?</h2>
        <div className="chips">
          {QUICK_REGIONS.map((r) => (
            <Link
              key={r.areaCode}
              href={`/recommend/${topic.slug}?area=${r.areaCode}`}
              className={`chip${isQuick && region?.areaCode === r.areaCode ? " active" : ""}`}
            >
              {r.label}
            </Link>
          ))}
        </div>
        <details className="region-other" open={!isQuick}>
          <summary className={`chip${!isQuick ? " active" : ""}`}>그 외 (직접 입력)</summary>
          <form action={`/recommend/${topic.slug}`} method="get" className="region-form">
            <input name="q" defaultValue={typed} placeholder="예: 강릉, 제주, 부산 해운대구" aria-label="지역 이름" />
            <button type="submit" className="btn">
              찾기
            </button>
          </form>
        </details>
        {typed && candidates.length === 0 && (
          <p role="alert">&lsquo;{typed}&rsquo;에 해당하는 지역을 찾지 못했어요. 시·군·구 이름으로 다시 입력해 주세요.</p>
        )}
        {candidates.length > 1 && (
          <div>
            <p>같은 이름의 지역이 여러 곳 있어요. 골라 주세요.</p>
            <div className="chips">
              {candidates.map((c) => (
                <Link key={`${c.areaCode}-${c.sigunguCode}`} href={`/recommend/${topic.slug}?${regionQuery(c)}`} className="chip">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <nav className="tabs">
        {TOPICS.map((t) => (
          <Link
            key={t.slug}
            href={region ? `/recommend/${t.slug}?${regionQuery(region)}` : `/recommend/${t.slug}`}
            className={`tab${t.slug === topic.slug ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {region && (
        <p className="center region-now">
          <strong>{region.label}</strong>에서 {profile.mbti}에게 맞는 {topic.label} 3곳
        </p>
      )}
      {result.failed && (
        <div className="card" role="alert">
          장소 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      {region && items && items.length > 0
        ? items.map((item, i) => {
            const place = result.places[i];
            return (
              <article key={item.id} className="card rec">
                <div className="rec-no">{i + 1}</div>
                <div>
                  <p className="rec-why">왜 {profile.mbti}에게 맞을까?</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                {place ? (
                  <div className="place">
                    {place.image && (
                      // 공공누리 이미지는 변형하지 않고 그대로 보여 준다(잘라내지 않음).
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="place-photo" src={place.image} alt={place.title} loading="lazy" />
                    )}
                    <h4>
                      {place.title}
                      {place.category && <span className="place-cat">{place.category}</span>}
                    </h4>
                    <p className="place-addr">{place.address}</p>
                    {place.tel && <p className="place-tel">☎ {place.tel}</p>}
                    {place.lat !== undefined && place.lng !== undefined && (
                      <>
                        <PlaceMap lat={place.lat} lng={place.lng} label={place.title} no={i + 1} />
                        <a
                          className="place-link"
                          href={`https://map.kakao.com/link/map/${encodeURIComponent(place.title)},${place.lat},${place.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          카카오맵에서 보기 →
                        </a>
                      </>
                    )}
                  </div>
                ) : (
                  !result.failed && <p className="place place-empty">이 지역에서는 딱 맞는 곳을 찾지 못했어요.</p>
                )}
              </article>
            );
          })
        : region && <div className="card">아직 준비된 추천이 없어요.</div>}

      {result.places.some(Boolean) && (
        <p className="center credit">장소 정보·사진 제공: 한국관광공사 (공공누리)</p>
      )}

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/">← 홈으로</Link>
      </p>
    </main>
  );
}
