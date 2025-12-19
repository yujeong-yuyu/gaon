"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/c-css/Section4.module.css";
import { FiSearch } from "react-icons/fi";
import { regions, placesByRegion } from "@/data/Section4_data";
/* 카카오지도 */
import KakaoMap from "@/components/KakaoMap";
/* 오픈웨더 */
import {
  getWeatherData,
  regionCoords,
} from "@/data/Section4_weather_data";

function Section4() {
  const [selectedRegion, setSelectedRegion] = useState("ansan");
  const [places, setPlaces] = useState(placesByRegion["ansan"]);
  const [selectedPlace, setSelectedPlace] = useState(null); // ✅ 모달 상태 추가

  // ✅ 추가: 날씨 데이터 상태
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    setPlaces(placesByRegion[selectedRegion]);
  }, [selectedRegion]);

  useEffect(() => {
    if (sliderRef1.current) sliderRef1.current.scrollLeft = 0;
    if (sliderRef2.current) sliderRef2.current.scrollLeft = 0;
  }, [selectedRegion]);

  // ✅ 추가: 선택된 지역이 바뀔 때마다 날씨 데이터 갱신
  useEffect(() => {
    async function fetchWeather() {
      const { lat, lon } = regionCoords[selectedRegion];
      const data = await getWeatherData(lat, lon);
      setWeatherData(data);
    }
    fetchWeather();
  }, [selectedRegion]);

  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  let targetScrollLeft = 0;
  let animationFrameId = null;

  // ✅ 자연스러운 가로 드래그 + 이미지 줄 유지 버전
  const handleMouseDown = (e, ref) => {
    e.preventDefault();
    const slider = ref.current;
    if (!slider) return;

    setIsDragging(true);
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
    slider.style.cursor = "grabbing"; // 시각 피드백
  };

  const handleMouseLeave = (ref) => {
    const slider = ref.current;
    if (!slider) return;

    slider.isDown = false;
    setIsDragging(false);
    slider.style.cursor = "grab";
  };

  const handleMouseUp = (ref) => {
    const slider = ref.current;
    if (!slider) return;

    slider.isDown = false;
    setIsDragging(false);
    slider.style.cursor = "grab";
  };

  const handleMouseMove = (e, ref) => {
    const slider = ref.current;
    if (!slider?.isDown) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.8; // 감도: 1.8 정도가 자연스러움
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const handleSearch = (value) => {
    if (!value) return;

    // ✅ 기존 강조 제거
    document.querySelectorAll(`.${styles.placeName}`).forEach((el) => {
      el.style.color = "";
      el.style.fontWeight = "";
    });

    const matchedRegionKey = Object.keys(regions).find((key) =>
      regions[key].name.includes(value)
    );

    if (matchedRegionKey) {
      setSelectedRegion(matchedRegionKey);
      return;
    }

    let foundRegionKey = null;
    let foundPlaceIndex = null;

    for (const [regionKey, places] of Object.entries(placesByRegion)) {
      const index = places.findIndex((p) => p.name.includes(value));
      if (index !== -1) {
        foundRegionKey = regionKey;
        foundPlaceIndex = index;
        break;
      }
    }

    if (foundRegionKey) {
      setSelectedRegion(foundRegionKey);
      setTimeout(() => {
        const slider =
          foundPlaceIndex < 4 ? sliderRef1.current : sliderRef2.current;
        if (slider) {
          const cardWidth =
            slider.querySelector(`.${styles.placeCard}`)?.offsetWidth || 250;
          const scrollPos = (foundPlaceIndex % 4) * cardWidth;
          slider.scrollTo({ left: scrollPos, behavior: "smooth" });
        }

        // ✅ 강조 처리 (텍스트 색상 + 두께 변경)
        const target = slider.querySelectorAll(`.${styles.placeName}`)[
          foundPlaceIndex % 4
        ];
        if (target) {
          target.style.color = "#F39535";
          target.style.fontWeight = "700";

          // ✅ 1.5초 후 원래 상태 복귀
          setTimeout(() => {
            target.style.color = "";
            target.style.fontWeight = "";
          }, 1500);
        }
      }, 300);
    } else {
      // ✅ alert 중복 방지 코드
      if (!window.alertShown) {
        window.alertShown = true;
        alert(
          "등록된 지역 또는 장소가 없습니다. (가능 지역: 안산, 강릉, 대전, 부산, 제주)"
        );
        setTimeout(() => (window.alertShown = false), 1000); // 1초 후 다시 가능하게
      }
    }
  };

  // ✅ 미세먼지 등급별 색상
  const getAirQualityColor = (level) => {
    if (level === "좋음") return "#3CB371"; // 초록
    if (level === "보통") return "#FFA500"; // 주황
    if (level === "나쁨") return "#FF4D4D"; // 빨강
    return "#888"; // 로딩 중 등
  };

  // ✅ 모달 열기/닫기
  const openModal = (place) => setSelectedPlace(place);
  const closeModal = () => setSelectedPlace(null);

  return (
    <div className={styles.sec4AllBox}>
      <div className={styles.sec4Inner1300}>
        <div className={styles.sec4TitleBox}>
          <h2 className={styles.sec4Title}>오늘의 산책지수와 장소</h2>
          <span className={styles.sec4Line}></span>
        </div>
        <p className={styles.sec4Subtitle}>
          오늘같은 날씨에 강아지와 이런 장소 어때요?
        </p>

        <div className={styles.sec4Content}>
          <div className={styles.sec4LeftBox}>
            <div className={styles.sec4WeatherBox}>
              <div className={styles.weatherInfo}>
                <div className={styles.weatherRowTop}>
                  {/* ✅ 수정된 부분 (아이콘 + 온도 표시) */}
                  <p>
                    {weatherData ? (
                      <>
                        {weatherData.icon} {/* ✅ React 아이콘 바로 렌더링 */}
                        {`${weatherData.condition} ${weatherData.temp}°C`}
                      </>
                    ) : (
                      "날씨 불러오는 중..."
                    )}
                  </p>
                  <p className={styles.mapLocation}>
                    {regions[selectedRegion].name}
                  </p>
                </div>

                <div className={styles.weatherRowMid}>
                  {/* ✅ 수정된 부분 (미세먼지 색상 변경) */}
                  <p
                    className={styles.goodAir}
                    style={{
                      color: weatherData
                        ? getAirQualityColor(weatherData.airQuality)
                        : "#888",
                    }}
                  >
                    미세먼지:{" "}
                    {weatherData ? weatherData.airQuality : "로딩 중..."}
                  </p>
                </div>

                <div className={styles.weatherRowBottom}>
                  {/* ✅ 수정된 부분 (산책지수 색상 고정) */}
                  <p className={styles.walkIndex} style={{ color: "#F39535" }}>
                    산책 지수: {weatherData ? weatherData.walkIndex : "-"}
                  </p>
                </div>
              </div>

              <div className={styles.mapBox}>
                <div className={styles.mapContainer}>
                  <img
                    src={regions[selectedRegion].mapImg}
                    alt={`${regions[selectedRegion].name} 지도`}
                    className={styles.mapImage}
                  />

                  {Object.entries(regions).map(([key, region]) => {
                    const positions = {
                      ansan: { top: "27%", left: "30%" },
                      gangneung: { top: "12%", left: "70%" },
                      daejeon: { top: "42%", left: "45%" },
                      busan: { top: "68%", left: "78%" },
                      jeju: { top: "94%", left: "35%" },
                    };
                    return (
                      <button
                        key={key}
                        className={`${styles.mapHotspot} ${selectedRegion === key ? styles.activeHotspot : ""
                          }`}
                        style={positions[key]}
                        onClick={() => setSelectedRegion(key)}
                        aria-label={region.name}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sec4RightBox}>
            <div className={styles.sec4SearchBox}>
              <input
                type="text"
                placeholder="지역 또는 장소를 입력해주세요.(서비스 가능 지역: 안산, 강릉, 부산, 제주, 대전)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.target.value.trim());
                  }
                }}
              />
              <FiSearch
                className={styles.searchIcon}
                onClick={() => {
                  const input = document.querySelector(
                    `.${styles.sec4SearchBox} input`
                  );
                  handleSearch(input.value.trim());
                }}
              />
            </div>

            <div className={styles.sec4SlideWrapper}>
              <div
                className={styles.horizontalScrollRow}
                ref={sliderRef1}
                onMouseDown={(e) => handleMouseDown(e, sliderRef1)}
                onMouseLeave={() => handleMouseLeave(sliderRef1)}
                onMouseUp={() => handleMouseUp(sliderRef1)}
                onMouseMove={(e) => handleMouseMove(e, sliderRef1)}
              >
                {places.slice(0, 4).map((place) => (
                  <div
                    key={place.id}
                    className={styles.placeCard}
                    onClick={() => openModal(place)}
                  >
                    <div className={styles.imgBox}>
                      <img src={place.img} alt={place.name} />
                      <div className={styles.tag}>{place.tag}</div>
                    </div>
                    <p className={styles.placeName}>{place.name}</p>
                  </div>
                ))}
              </div>

              <div
                className={styles.horizontalScrollRow}
                ref={sliderRef2}
                onMouseDown={(e) => handleMouseDown(e, sliderRef2)}
                onMouseLeave={() => handleMouseLeave(sliderRef2)}
                onMouseUp={() => handleMouseUp(sliderRef2)}
                onMouseMove={(e) => handleMouseMove(e, sliderRef2)}
              >
                {places.slice(4, 8).map((place) => (
                  <div
                    key={place.id}
                    className={styles.placeCard}
                    onClick={() => openModal(place)}
                  >
                    <div className={styles.imgBox}>
                      <img src={place.img} alt={place.name} />
                      <div className={styles.tag}>{place.tag}</div>
                    </div>
                    <p className={styles.placeName}>{place.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPlace && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ✕
            </button>

            {/* ✅ 왼쪽: 지도 */}
            <div className={styles.modalLeft}>
              <h2 className={styles.modalTitle}>{selectedPlace.name}</h2>
              <KakaoMap lat={selectedPlace.lat} lng={selectedPlace.lng} />
            </div>

            {/* ✅ 오른쪽: 기존 정보 유지 */}
            <div className={styles.modalRight}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>장소</span>
                <span className={styles.modalValue}>{selectedPlace.name}</span>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>주소</span>
                <div className={styles.modalValue}>
                  <p>{selectedPlace.address}</p>
                </div>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>TEL</span>
                <span className={styles.modalValue}>02-558-6606</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>MAIL</span>
                <span className={styles.modalValue}>contact@jfactory.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Section4;
