"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import styles from "@/styles/c-css/Section6.module.css";
import responseStyles from "@/styles/C-response/C-response-section6.module.css";

const DEFAULT_ITEMS = [
  {
    id: 1,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-1.png",
    tag: "가온",
    title: "리뷰이벤트",
    desc: "가온이벤트 강의 최대 30%할인",
  },
  {
    id: 2,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-2.png",
    tag: "가온",
    title: "온라인 강의 어떻게 진행하나요?",
    desc: "실시간 쌍방향으로 이루어지는 콘텐츠 중심 수업! 실습과제 피드백도 이루어집니다.",
  },
  {
    id: 3,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-3.png",
    tag: "강아지센터",
    title: "Join the Happy Pack!",
    desc: "Join the Happy Pack!",
  },
  {
    id: 4,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-4.png",
    tag: "미래예견훈련소",
    title: "엄마, 나 학교갈래요!",
    desc: "반려동물 맡기세요!",
  },
  {
    id: 5,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-2.png",
    tag: "가온",
    title: "리뷰이벤트",
    desc: "가온이벤트 강의 최대 30%할인",
  },
  {
    id: 6,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-4.png",
    tag: "가온",
    title: "온라인 강의 어떻게 진행하나요?",
    desc: "실시간 쌍방향으로 이루어지는 콘텐츠 중심 수업! 실습과제 피드백도 이루어집니다.",
  },
  {
    id: 7,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-1.png",
    tag: "강아지센터",
    title: "Join the Happy Pack!",
    desc: "Join the Happy Pack!",
  },
  {
    id: 8,
    img: "https://kjwon2025.github.io/gaonimg/img/sec6-3.png",
    tag: "미래예견훈련소",
    title: "엄마, 나 학교갈래요!",
    desc: "반려동물 맡기세요!",
  },
];

const Section6 = ({ items = DEFAULT_ITEMS }) => {
  const wrapRef = useRef(null);
  const titleRefs = useRef([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [paused, setPaused] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // fade-in 상태
  const [showTitle, setShowTitle] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const measurePerPage = () => {
    const el = wrapRef.current;
    if (!el) return;
    const usable = el.clientWidth;
    const cardW = 310;
    const gap = 20;
    setItemsPerPage(Math.max(1, Math.floor((usable + gap) / (cardW + gap))));
  };

  useLayoutEffect(() => {
    measurePerPage();
    const onResize = () => requestAnimationFrame(measurePerPage);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    titleRefs.current.forEach((el) => {
      if (!el) return;
      const cs = getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight);
      const lines = Math.round(el.scrollHeight / lineHeight);
      el.classList.toggle("smallTitle", lines > 1);
    });
  });

  const totalPages = 4; // 페이지 4개로 고정

  const pageItems = useMemo(() => {
    const slice = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const idx = ((currentPage - 1) * itemsPerPage + i) % items.length; // 아이템 반복
      slice.push(items[idx]);
    }
    return slice;
  }, [currentPage, items, itemsPerPage]);

  const goPage = (p) => {
    const next = ((p - 1 + totalPages) % totalPages) + 1;
    setCurrentPage(next);
    setManualPause(true);
  };

  const prevPage = () => goPage(currentPage - 1);
  const nextPage = () => goPage(currentPage + 1);

  useEffect(() => {
    if (paused || manualPause || totalPages <= 1) return;
    const id = setInterval(
      () => setCurrentPage((prev) => (prev % totalPages) + 1),
      4000
    );
    return () => clearInterval(id);
  }, [paused, manualPause, totalPages]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // IntersectionObserver로 fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowTitle(true);
          setTimeout(() => setShowCards(true), 700);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.sec6} ${isMobile ? responseStyles.sec6 : ""}`}>
      <div
        className={`${styles.sec6Wrap} ${isMobile ? responseStyles.sec6Wrap : ""
          }`}
        ref={wrapRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 제목 */}
        <div
          className={`${styles.sec6Title} ${showTitle ? styles.fadeIn : styles.hidden
            }`}
        >
          <span>What's Ga on</span>
          <div
            className={`${styles.sec6Line} ${isMobile ? responseStyles.sec6Line : ""
              }`}
          />
        </div>

        {/* 카드 & 페이지네이션 */}
        <div className={`${showCards ? styles.fadeIn : styles.hidden}`}>
          <div
            className={`${styles.sec6Cards} ${isMobile ? responseStyles.sec6Cards : ""
              }`}
          >
            {pageItems.map((it, i) => (
              <div
                key={i}
                className={`${styles.sec6Card} ${isMobile ? responseStyles.sec6Card : ""
                  }`}
              >
                {it.img && (
                  <Image
                    src={it.img}
                    alt={it.title}
                    width={310}
                    height={360}
                    priority={i < itemsPerPage}
                  />
                )}
                <div
                  className={`${styles.sec6Textbox} ${isMobile ? responseStyles.sec6Textbox : ""
                    }`}
                >
                  {it.tag && (
                    <p
                      className={`${styles.sec6Tag} ${isMobile ? responseStyles.sec6Tag : ""
                        }`}
                    >
                      {it.tag}
                    </p>
                  )}
                  <p
                    ref={(el) => (titleRefs.current[i] = el)}
                    className={`${styles.sec6Title2} ${isMobile ? responseStyles.sec6Title2 : ""
                      }`}
                  >
                    {it.title}
                  </p>
                  {it.desc && (
                    <p
                      className={`${styles.sec6Desc} ${isMobile ? responseStyles.sec6Desc : ""
                        }`}
                    >
                      {it.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`${styles.sec6Pagenation} ${isMobile ? responseStyles.sec6Pagenation : ""
              }`}
          >
            <button
              onClick={prevPage}
              disabled={totalPages <= 1}
              className={`${styles.sec6Pagebtn} ${isMobile ? responseStyles.sec6Pagebtn : ""
                }`}
            >
              <div
                className={`${styles.arrowSoft} ${styles.arrowLeft}`}
                style={{ "--color": currentPage === 1 ? "#bbb" : "#2b2b2b" }}
              />
            </button>
            <span
              className={`${styles.sec6Pageinfo} ${isMobile ? responseStyles.sec6Pageinfo : ""
                }`}
            >
              {currentPage} / {totalPages}
            </span>
            <Icon
              icon="material-symbols:motion-play-outline"
              color="#2b2b2b"
              width="34"
            />
            <button
              onClick={nextPage}
              disabled={totalPages <= 1}
              className={`${styles.sec6Pagebtn} ${isMobile ? responseStyles.sec6Pagebtn : ""
                }`}
            >
              <div
                className={`${styles.arrowSoft} ${styles.arrowRight}`}
                style={{
                  "--color": currentPage === totalPages ? "#bbb" : "#2b2b2b",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section6;
