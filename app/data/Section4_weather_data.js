"use client";

import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSprinkle,
  WiSnow,
  WiFog,
  WiThunderstorm,
} from "react-icons/wi";

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// ✅ 영어 → 한국어 날씨 변환 + 아이콘 추가
function translateCondition(desc) {
  const map = {
    Clear: { text: "맑음", icon: <WiDaySunny size={32} color="#FDB813" /> },
    Clouds: { text: "구름 많음", icon: <WiCloud size={32} color="#9E9E9E" /> },
    Rain: { text: "비", icon: <WiRain size={32} color="#2196F3" /> },
    Drizzle: { text: "이슬비", icon: <WiSprinkle size={32} color="#64B5F6" /> },
    Snow: { text: "눈", icon: <WiSnow size={32} color="#90CAF9" /> },
    Mist: { text: "안개", icon: <WiFog size={32} color="#B0BEC5" /> },
    Fog: { text: "안개", icon: <WiFog size={32} color="#B0BEC5" /> },
    Haze: { text: "실안개", icon: <WiFog size={32} color="#B0BEC5" /> },
    Thunderstorm: {
      text: "천둥번개",
      icon: <WiThunderstorm size={32} color="#673AB7" />,
    },
  };
  return (
    map[desc] || { text: "흐림", icon: <WiCloud size={32} color="#9E9E9E" /> }
  );
}

// ✅ 미세먼지 → 텍스트 + 색상 반환
function getAirQualityInfo(pm2_5) {
  if (pm2_5 <= 15) return { text: "좋음", color: "#4CAF50" }; // 초록
  if (pm2_5 <= 35) return { text: "보통", color: "#FFC107" }; // 노랑
  if (pm2_5 <= 75) return { text: "나쁨", color: "#FF5722" }; // 주황
  return { text: "매우 나쁨", color: "#D32F2F" }; // 빨강
}

// ✅ 산책지수 (0~100점)
function getWalkIndex(temp, condition, pm2_5) {
  let score = 100;

  if (temp < -5 || temp > 35) score -= 60;
  else if (temp < 0 || temp > 30) score -= 40;
  else if (temp < 10 || temp > 25) score -= 20;

  if (["비", "눈", "이슬비", "천둥번개"].includes(condition)) score -= 50;
  else if (condition === "구름 많음" || condition === "흐림") score -= 10;

  if (pm2_5 > 75) score -= 50;
  else if (pm2_5 > 35) score -= 30;
  else if (pm2_5 > 15) score -= 10;

  return Math.max(0, Math.min(100, score));
}

// ✅ 지역 좌표
export const regionCoords = {
  ansan: { name: "안산", lat: 37.3219, lon: 126.8309 },
  daejeon: { name: "대전", lat: 36.3504, lon: 127.3845 },
  busan: { name: "부산", lat: 35.1796, lon: 129.0756 },
  jeju: { name: "제주", lat: 33.4996, lon: 126.5312 },
  gangneung: { name: "강릉", lat: 37.7519, lon: 128.8761 },
};

// ✅ 메인 fetch 함수
export async function getWeatherData(lat, lon) {
  if (!OPENWEATHER_API_KEY) {
    console.error(
      "❌ .env.local에 NEXT_PUBLIC_WEATHER_API_KEY 설정이 필요합니다."
    );
    return null;
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherJson = await weatherRes.json();

    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    const airJson = await airRes.json();

    const pm2_5 = airJson.list?.[0]?.components?.pm2_5 ?? 0;

    // const temp = Math.round(weatherJson.main.temp);
    const temp = Math.round(weatherJson.main?.temp ?? 0);

    const conditionEng = weatherJson.weather?.[0]?.main || "Clouds";

    const { text: condition, icon } = translateCondition(conditionEng);

    const { text: airQuality, color: airColor } = getAirQualityInfo(pm2_5);
    const walkIndex = getWalkIndex(temp, condition, pm2_5);

    // ✅ 이제 아이콘 경로 + 색상까지 같이 반환
    return { temp, condition, icon, airQuality, airColor, walkIndex };
  } catch (error) {
    console.error("🌧 날씨 데이터 불러오기 실패:", error);
    return null;
  }
}
