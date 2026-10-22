"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type Props = { lat: number; lng: number; label: string; no: number };

// OpenStreetMap 타일 위에 장소 위치를 번호 마커로 보여 준다. (API 키가 필요 없음)
export default function PlaceMap({ lat, lng, label, no }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    // leaflet은 window를 참조하므로 브라우저에서만 불러온다.
    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        // 모바일에서 페이지를 스크롤하다 지도가 끌려가지 않도록 한다.
        dragging: !L.Browser.mobile,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.marker([lat, lng], {
        icon: L.divIcon({ className: "map-pin", html: `<span><b>${no}</b></span>`, iconSize: [32, 32], iconAnchor: [16, 32] }),
        title: label,
        alt: label,
      }).addTo(map);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, label, no]);

  return <div ref={ref} className="place-map" role="img" aria-label={`${label} 위치 지도`} />;
}
