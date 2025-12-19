"use client";

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import styles from "../styles/c-css/Sec1.module.css";

function Sec1() {
  const [visible, setVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef(null);

  const descriptions = [
    <>
      올바른 식습관 형성과 편식 개선 훈련을 진행해요.
      <br />
      간식과 보상을 활용해 즐겁게 식습관을 바로잡아요.
      <br />
      강아지의 건강 상태에 맞춘 맞춤형 급여법을 배워요.
    </>,
    <>
      안전한 실내생활과 기본 매너를 배우는 과정이에요.
      <br />
      가정 내 위험 요소를 인식하고 올바르게 행동하도록 훈련해요.
      <br />
      가족 구성원과 조화롭게 지낼 수 있는 생활 습관을 만들어줘요.
    </>,
    <>
      배변 신호를 이해하고 올바른 장소에서 배변하도록 훈련해요.
      <br />
      간식과 칭찬을 활용해 긍정적으로 습관을 만들고
      <br />
      문제 행동을 교정해 일상에서 잘 적용할 수 있게 도와줘요.
    </>,
    <>
      강아지가 혼자 있을 때 불안해하거나 짖는 행동을 줄여요.
      <br />
      점진적으로 혼자 있는 시간을 늘리며 안정감을 길러요.
      <br />
      칭찬과 보상으로 자신감을 키워 일상에 적용해요.
    </>,
    <>
      다른 강아지와 사람과의 긍정적인 교류를 학습해요.
      <br />
      안전하고 즐거운 환경에서 사회적 기술을 회복해요.
      <br />
      올바른 놀이와 훈련으로 자신감 있는 행동을 키워요.
    </>,
    <>
      산책 중 다른 사람과 강아지에 대한 적응력을 높여요.
      <br />
      다양한 환경에서 안정적으로 행동하도록 훈련해요.
      <br />
      올바른 리드 사용과 보상으로 즐거운 산책 습관을 길러요.
    </>,
    <>
      불필요한 짖음과 하울링을 줄이는 방법을 배워요.
      <br />
      스트레스 상황에서 안정적으로 반응하도록 훈련해요.
      <br />
      긍정적인 보상과 반복 연습으로 조용한 습관을 만들어줘요.
    </>,
    <>
      강아지의 성향과 문제 행동에 맞춘 맞춤형 훈련을 진행해요.
      <br />
      개별 집중 훈련으로 빠르고 효율적인 학습을 돕습니다.
      <br />
      보호자와 함께 실생활에 바로 적용할 수 있도록 지도해요.
    </>,
    <>
      동물보건사 자격증 취득을 위한 기본 이론과 실습을 배워요.
      <br />
      반려동물 건강 관리와 위생, 응급처치 방법을 학습해요.
      <br />
      시험 준비와 현장 실무 적용까지 단계별로 안내합니다.
    </>,
    <>
      반려동물 관리사 자격증 취득을 위한 기초 교육 과정이에요.
      <br />
      반려동물 행동, 건강 관리, 생활 안전 등 필수 지식을 배워요.
      <br />
      실무 적용과 시험 준비까지 단계별로 안내합니다.
    </>,
    <>
      애견미용자격증 과정으로 기본 미용 기술을 배워요.
      <br />
      털 손질, 목욕, 스타일링 등 실습 중심 교육이에요.
      <br />
      자격증 취득과 현장 실무 적용까지 안내합니다.
    </>,
    <>
      반려동물을 위한 아로마 테라피 기본 지식을 배워요.
      <br />
      스트레스 완화, 안정, 건강 증진을 위한 안전한 활용법을 학습해요.
      <br />
      실습과 사례 중심으로 일상에서 바로 적용할 수 있어요.
    </>,
    <>
      문제 행동을 분석하고 올바르게 교정하는 방법을 배워요.
      <br />
      행동 습관 형성, 문제 행동 예방을 실습 중심으로 학습해요.
      <br />
      보호자와 함께 일상에 적용할 수 있는 실전 노하우까지 제공합니다.
    </>,
    <>
      반려동물의 외형과 스타일을 아름답게 꾸미는 기술을 배워요.
      <br />
      털 모양, 컷팅, 장식 활용 등 다양한 스타일링 실습 중심 교육이에요.
      <br />
      실무에서 바로 적용 가능한 트렌디한 디자인과 관리법을 제공합니다.
    </>,
    <>
      반려동물의 미용과 위생을 전문적으로 관리하는 기술을 배워요.
      <br />
      털 손질, 목욕, 발톱 관리 등 실습 중심의 트리밍 교육이에요.
      <br />
      자격증 취득과 현장 적용까지 실무 노하우를 제공합니다.
    </>,
    <>
      건강과 심리 안정에 도움되는 아로마 관리 기법을 배워요.
      <br />
      스트레스 완화, 면역력 증진을 실습 중심으로 학습해요.
      <br />
      일상과 현장에서 바로 적용 가능한 전문 관리 방법을 제공합니다.
    </>,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftBoxIndices = !isChanged ? [0, 1] : [8, 9];
  const baseIndex = !isChanged ? 2 : 10;

  const protectorTitles = [
    "식습관 관리 & 편식 개선",
    "실내 안전 / 생활 매너 교육",
    "배변 습관 완성 클래스",
    "분리불안 집중 개선",
    "사회성 회복 훈련",
    "산책 사회화 훈련",
    "짖음 / 하울링 개선 훈련",
    "1:1 맞춤 클래스",
  ];

  const certificateTitles = [
    "동물보건사",
    "반려 동물 관리사",
    "애견 미용 자격증",
    "펫 아로마 테라피",
    "반려 동물 행동 교정사",
    "펫 스타일링",
    "펫 트리머",
    "반려 동물 아로마 관리사",
  ];

  const allTitles = [...protectorTitles, ...certificateTitles];

  const allImages = [
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon1.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon1_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon2.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon2_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon5.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon5_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon3.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon3_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon4.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon4_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon6.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon6_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon7.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon7_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1icon8.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1icon8_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc1.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc1_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc2.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc2_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc3.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc3_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc4.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc4_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc5.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc5_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc6.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc6_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc7.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc7_2.png"
    ],
    [
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc8.png",
      "https://kjwon2025.github.io/gaonimg/img/sec1iconlc8_2.png"
    ]
  ];


  useEffect(() => {
    const protectorOrder = [0, 1, 2, 3, 4, 5, 6, 7];
    const certificateOrder = [8, 9, 10, 11, 12, 13, 14, 15];

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (!isChanged) {
          const currentIdx = protectorOrder.indexOf(prev);
          return protectorOrder[(currentIdx + 1) % protectorOrder.length];
        } else {
          const currentIdx = certificateOrder.indexOf(prev);
          return certificateOrder[(currentIdx + 1) % certificateOrder.length];
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isChanged]);

  const handleNextClick = () => {
    setIsChanged((prev) => {
      const nextMode = !prev;
      setActiveIndex(nextMode ? 8 : 0);
      return nextMode;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setShowButton(true), 700);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.sec1Wrap}>
      <div
        ref={containerRef}
        className={`${styles.sec1Container} ${visible ? styles.fadeIn : styles.hidden
          }`}
      >
        <div className={styles.sec1Leftbox}>
          <span
            style={{ color: isChanged ? "#86BCDE" : "#ffcf77" }}
            className={visible ? styles.fadeIn : styles.hidden}
          >
            {isChanged ? "자격증 교육" : "보호자 교육"}
          </span>
          <span
            style={{ color: isChanged ? "#143F70" : "#F39535" }}
            className={visible ? styles.fadeIn : styles.hidden}
          >
            {allTitles[activeIndex]}
          </span>
          <span
            className={
              styles.sec1Classinfo +
              (visible ? ` ${styles.fadeIn}` : ` ${styles.hidden}`)
            }
          >
            {activeIndex >= 0 && activeIndex < descriptions.length
              ? descriptions[activeIndex]
              : null}
          </span>

          <Link href="/class1">
            <div
              className={`${styles.sec1Move} ${showButton ? styles.fadeIn : styles.hidden}`}
            >
              <span style={{ color: isChanged ? "#143F70" : "#F39535" }}>
                수강하러가기
              </span>
              <svg
                style={{ color: isChanged ? "#143F70" : "#F39535" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="m19 12l12 12l-12 12"
                />
              </svg>
            </div>
          </Link>

          <div
            className={`${styles.sec1Leftconbox} ${isChanged ? styles.changed : styles.default
              } ${showButton ? styles.fadeIn : styles.hidden}`}
          >
            {leftBoxIndices.map((idx, i) => {
              const [normalImg, hoverImg] = allImages[idx];
              const [isHovered, setIsHovered] = useState(false);
              return (
                <div
                  key={i}
                  className={`${styles.sec1Box} ${activeIndex === idx ? styles.active : ""
                    } ${i === 0 ? styles.rightline : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    className={styles.sec1Img}
                    src={
                      isHovered || activeIndex === idx ? normalImg : hoverImg
                    }
                    alt={allTitles[idx]}
                  />
                  <span>{allTitles[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`${styles.sec1Rightconbox} ${isChanged ? styles.changed : styles.default
            } ${showButton ? styles.fadeIn : styles.hidden}`}
        >
          {(!isChanged
            ? protectorTitles.slice(2)
            : certificateTitles.slice(2)
          ).map((title, idx) => {
            const boxIndex = baseIndex + idx;
            const [normalImg, hoverImg] = allImages[boxIndex];
            const [isHovered, setIsHovered] = useState(false);
            return (
              <div
                key={idx}
                className={`${styles.sec1Box} ${activeIndex === boxIndex ? styles.active : ""
                  }`}
                onClick={() => setActiveIndex(boxIndex)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  className={styles.sec1Img}
                  src={
                    isHovered || activeIndex === boxIndex ? normalImg : hoverImg
                  }
                  alt={title}
                />
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`${styles.sec1Nextbtn} ${isChanged ? styles.changed : styles.default}`}  // 'default' 클래스를 추가
        onClick={handleNextClick}
      >
        <svg
          className={styles.sec1Rightarrow}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 12h16m0 0l-6-6m6 6l-6 6"
          />
        </svg>
      </div>
    </div>
  );
}

export default Sec1;
