"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/c-css/Section3.module.css";

export default function Section3() {
  const [isOn, setIsOn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentIndex, setContentIndex] = useState(0);
  const speechRef = useRef(null);
  const nextTriggerRef = useRef(null);

  const contents = [
    {
      before: "https://kjwon2025.github.io/gaonimg/img/category-1.png",
      after: "https://kjwon2025.github.io/gaonimg/img/category-1.png",
      left: "강아지가 공격성이 높아요..",
      right: (
        <>
          이제 다른 강아지나 사람을 물지도 않고{" "}
          <span className={styles.highlight}>얌전히</span> 잘 지내네요! 혼자
          두어도 <span className={styles.highlight}>사고치지 않아서 </span>
          마음이 한결 편안해졌습니다.
        </>
      ),
    },
  ];

  const current = contents[contentIndex];

  // 첫 번째 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (speechRef.current) observer.observe(speechRef.current);
    return () => observer.disconnect();
  }, []);

  // 두 번째 IntersectionObserver
  useEffect(() => {
    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
              setContentIndex(1);
              setVisible(true);
            }, 400);
          }, 500);
          observer2.disconnect();
        }
      },
      {
        threshold: 1.0,
        rootMargin: "300px 0px -200px 0px",
      }
    );

    if (nextTriggerRef.current) observer2.observe(nextTriggerRef.current);
    return () => observer2.disconnect();
  }, []);

  return (
    <div className={styles.sec3AllBox}>
      <div className={styles.sec3Inner1300}>
        <div className={styles.sec3TitleBox}>
          <span className={styles.sec3Title}>Before & After</span>
          <span className={styles.sec3Line}></span>
        </div>

        <div className={styles.sec3VideoSpeechWrapper} ref={speechRef}>
          {/* 왼쪽 영상 영역 */}
          <div
            className={`${styles.sec3VideoWrapper} ${visible ? styles.fadeInVideo : ""
              }`}
          >
            <div className={styles.sec3BeforeTxt}>
              {isOn ? "After" : "Before"}
            </div>

            <div className={styles.sec3Autoplay}>
              <video
                key={isOn ? "after" + contentIndex : "before" + contentIndex}
                src={
                  isOn
                    ? "https://kjwon2025.github.io/gaonimg/video/sec3-after.mp4"
                    : "https://kjwon2025.github.io/gaonimg/video/sec3-before.mp4"
                }
                autoPlay
                muted
                loop
                playsInline
                className={`${styles.sec3Video} ${styles.fadeVideo}`}
              />
              {/* 토글 스위치 */}
              <div
                className={`${styles.sec3ToggleSwitch} ${isOn ? styles.on : styles.off
                  }`}
                onClick={() => setIsOn(!isOn)}
              >
                <div className={styles.toggleCircle}></div>
                <span className={styles.toggleText}>
                  {isOn ? "After" : "Before"}
                </span>
              </div>
            </div>
          </div>

          {/* 오른쪽 말풍선 영역 */}
          <div className={styles.sec3SpeechWrapper}>
            <img
              className={`${styles.speechQuoteLeft} ${visible ? styles.fadeInLeft : ""
                }`}
              src="https://kjwon2025.github.io/gaonimg/img/sec3-left.png"
              alt="왼쪽 큰따옴표"
            />

            <div
              className={`${styles.speech} ${styles.speechLeft} ${visible ? styles.fadeInLeft : ""
                }`}
            >
              {current.left}
            </div>

            <div
              className={`${styles.speechRightWrapper} ${visible ? styles.fadeInRight : ""
                }`}
            >
              <img
                className={styles.speechRightOverlay}
                src="https://kjwon2025.github.io/gaonimg/img/sec3-border.png"
                alt="텍스트 위 이미지"
              />
              <div className={`${styles.speech} ${styles.speechRight}`}>
                {current.right}
              </div>
            </div>

            <img
              className={`${styles.speechQuoteRight} ${visible ? styles.fadeInRight : ""
                }`}
              src="https://kjwon2025.github.io/gaonimg/img/sec3-right.png"
              alt="오른쪽 큰따옴표"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
