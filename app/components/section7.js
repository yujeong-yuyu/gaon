"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/c-css/Section7.module.css";

const Section7 = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const [showTitle, setShowTitle] = useState(false);
  const [showStage, setShowStage] = useState(false);
  const wrapRef = useRef(null);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 769);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goMatch = () => {
    router.push("/match");
  };

  useEffect(() => {
    if (!wrapRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 강제로 reflow 발생시키기
          wrapRef.current.offsetHeight;

          setShowTitle(true);
          setTimeout(() => setShowStage(true), 700);

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(wrapRef.current);

    return () => {
      if (wrapRef.current) observer.unobserve(wrapRef.current);
    };
  }, []);


  return (
    <div className={styles.sec7} ref={wrapRef}>
      <div className={styles.sec7Wrap}>
        {/* 제목 */}
        <div
          className={`${styles.sec7Title} ${showTitle ? styles.fadeInTitle : styles.hidden
            }`}
        >
          <span>강아지 매칭 테스트</span>
          <div className={styles.sec7Line}></div>
        </div>

        {/* 카드 */}
        <div
          className={`${styles.sec7Stage} ${showStage ? styles.fadeInStage : styles.hidden
            }`}
        >
          <div
            className={styles.sec7Card}
            role="button"
            tabIndex={0}
            onClick={goMatch}
          >
            <div className={styles.sec7Texts}>
              <div className={styles.sec7Text1}>
                Puppy Match
                <br /> Test
              </div>
              <div className={styles.sec7Text2}>
                나와 맞는 강아지는 누굴까?
              </div>
            </div>

            <div className={styles.sec7Circles}>
              <div className={styles.sec7Circle1}></div>
              <div className={styles.sec7Circle2}></div>
              <div className={styles.sec7Circle3}></div>
              <svg className={styles.sec7ArrowRight} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="1"
                  d="M3 14h17l-5-5"
                />
              </svg>
            </div>
          </div>

          <div className={styles.sec7Back}></div>
        </div>
      </div>
    </div>
  );
};

export default Section7;
