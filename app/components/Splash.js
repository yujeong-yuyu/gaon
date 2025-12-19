"use client";

import styles from "@/styles/c-css/Splash.module.css";

export default function Splash({ onNext }) {
  return (
    <div className={styles.wrapSP}>
      <img
        src="https://kjwon2025.github.io/gaonimg/img/splash.png"
        alt="splash"
      />
      <div className={styles.containerSP}>
        <img
          src="https://kjwon2025.github.io/gaonimg/img/logofront1.png"
          alt="logo"
        />
        <span className={styles.gaonSP}>GAON</span>
        <div className={styles.lineSP}></div>
        <span className={styles.subtitleSP}>온라인 반려견 교육 플랫폼</span>
      </div>
      <div className={styles.nextbtnboxSP}>
        <div className={styles.circle1SP}></div>
        <div className={styles.circle2SP}></div>
        <div className={styles.circle3SP} onClick={onNext}></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={onNext}>
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
  );
}
