"use client";

import { useContext } from "react";
import Link from "next/link";
import styles from "../styles/c-css/Header2.module.css";
import { MenuContext } from "../context/MenuContext";

export default function Header2() {
  const { setIsMenuOpen } = useContext(MenuContext); // 전역 메뉴 제어

  return (
    <div className={styles.wrapHD2}>
      <div className={styles.containerHD2}>
        <Link href="/">
          <img
            src="https://kjwon2025.github.io/gaonimg/img/gaonlogo2.png"
            alt="logo"
          />
        </Link>

        <div className={styles.menuboxHD2}>
          <div className={styles.mmspanHD2}>
            <Link href="/category1"><span>보호자</span></Link>
            <Link href="/category2"><span>자격증</span></Link>
            <Link href="/Community_list"><span>커뮤니티</span></Link>
          </div>

          <svg
            className={styles.hambtnHD2}
            onClick={() => setIsMenuOpen(true)} // 전역 메뉴 열기
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ cursor: "pointer" }}
          >
            <path
              fill="currentColor"
              d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
