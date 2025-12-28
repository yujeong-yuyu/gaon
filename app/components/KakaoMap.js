"use client";

import { useEffect, useRef } from "react";

export default function KakaoMap({ lat, lng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;

    // 카카오 SDK 로드
    const scriptId = "kakao-map-sdk";
    const existingScript = document.getElementById(scriptId);

    const loadMap = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        // ✅ 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    if (existingScript) {
      if (window.kakao?.maps) loadMap();
      else existingScript.onload = loadMap;
      return;
    }

    // 스크립트 동적 삽입
    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=4ba957fbfdd2a83bcb87a83ef3e313bb&autoload=false";
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "10px",
      }}
    />
  );
}
