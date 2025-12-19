"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/c-css/Allmenu.module.css";
import responseStyles from "@/styles/C-response/response-Allmenu.module.css";

export default function Allmenu({ closeMenu }) {
  const router = useRouter();

  const menuContents = {
    회사소개: {
      title: "회사소개",
      description: "회사의 철학과 비전. 그리고 프로세스를 소개합니다.",
      path: "/",
    },
    "보호자 교육": {
      title: "보호자 교육",
      description: "올바른 반려 생활을 위해 교육 프로그램을 제공합니다.",
      path: "/category1",
    },
    "자격증 교육": {
      title: "자격증 교육",
      description: "반려 관련 자격증 취득을 위한 전문 교육 과정입니다.",
      path: "/category2",
    },
    커뮤니티: {
      title: "커뮤니티",
      description:
        "반려인들이 서로의 이야기를 나누고\n함께 배우며 성장하는 공간입니다.\n질문과 후기를 통해 우리의 반려 생활을\n더 따뜻하게 만들어보세요.",
      path: "/Community_list",
    },
    "마이 페이지": {
      title: "마이 페이지",
      description: "내 정보와 활동 내역을 확인할 수 있습니다.",
      path: "/mypage",
    },
    장바구니: {
      title: "장바구니",
      description: "선택한 교육과 상품을 확인하고 결제할 수 있습니다.",
      path: "/cart2",
    },
    로그인: {
      title: "로그인",
      description: "계정에 로그인하여 서비스를 이용하세요.",
      path: "/login",
    },
  };

  const desktopPositions = {
    회사소개: { top: "50px", right: "470px" },
    "보호자 교육": { top: "170px", right: "490px" },
    "자격증 교육": { top: "300px", right: "530px" },
    커뮤니티: { top: "440px", right: "530px" },
    "마이 페이지": { top: "600px", right: "530px" },
    장바구니: { top: "730px", right: "520px" },
    로그인: { top: "850px", right: "470px" },
  };

  const padPositions = {
    회사소개: { top: "50px", left: "500px", transform: "translateX(-50%)" },
    "보호자 교육": {
      top: "170px",
      left: "450px",
      transform: "translateX(-50%)",
    },
    "자격증 교육": {
      top: "290px",
      left: "420px",
      transform: "translateX(-50%)",
    },
    커뮤니티: { top: "410px", left: "410px", transform: "translateX(-50%)" },
    "마이 페이지": {
      top: "530px",
      left: "410px",
      transform: "translateX(-50%)",
    },
    장바구니: { top: "650px", left: "430px", transform: "translateX(-50%)" },
    로그인: { top: "760px", left: "470px", transform: "translateX(-50%)" },
  };

  const mobilePositions = {
    회사소개: { top: "120px", left: "280px", transform: "translateX(-50%)" },
    "보호자 교육": {
      top: "210px",
      left: "220px",
      transform: "translateX(-50%)",
    },
    "자격증 교육": {
      top: "310px",
      left: "190px",
      transform: "translateX(-50%)",
    },
    커뮤니티: { top: "50%", left: "160px", transform: "translate(-50%, -50%)" },
    "마이 페이지": {
      top: "510px",
      left: "190px",
      transform: "translateX(-50%)",
    },
    장바구니: { top: "610px", left: "220px", transform: "translateX(-50%)" },
    로그인: { top: "700px", left: "290px", transform: "translateX(-50%)" },
  };

  const [menuPositions, setMenuPositions] = useState(() => {
    if (typeof window === "undefined") return desktopPositions;
    if (window.innerWidth >= 1300) return desktopPositions;
    if (window.innerWidth >= 768) return padPositions;
    return mobilePositions;
  });

  const [hovered, setHovered] = useState("커뮤니티");
  const [animate, setAnimate] = useState(false);

  // 이미지 위치 반응형 state
  const [imgStyle, setImgStyle] = useState({
    left: "50%",
    transform: "translate(-70%, -50%)",
  });

  // wrap clip-path 반응형 state
  const [wrapStyle, setWrapStyle] = useState({
    clipPath: "circle(0% at 1810px 35px)",
  });

  // 반응형 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1300) {
        setMenuPositions(desktopPositions);
        setImgStyle({ left: "50%", transform: "translate(-70%, -50%)" });
        setWrapStyle({ clipPath: "circle(150% at 800px 1000px)" });
      } else if (window.innerWidth >= 768) {
        setMenuPositions(padPositions);
        setImgStyle({
          left: "40%",
          transform: "translate(-150%, -50%)",
          width: "160px",
          height: "160px",
        });
        setWrapStyle({ clipPath: "circle(150% at 800px 500px)" });
      } else {
        setMenuPositions(mobilePositions);
        setImgStyle({ display: "none" });
        setWrapStyle({ clipPath: "circle(150% at 800px 500px)" });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기값 설정
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 애니메이션 및 scroll lock
  useEffect(() => {
    setAnimate(true);
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      className={`${styles.amWrap} ${animate ? styles.amAnimateIn : ""} ${responseStyles.amAnimateInResponsive || ""
        }`}
      style={wrapStyle} // ✅ wrap 위치만 적용
    >
      <div className={`${styles.amCircle1} ${responseStyles.amCircle1}`}></div>
      <div className={`${styles.amCircle2} ${responseStyles.amCircle2}`}></div>
      <div className={`${styles.amCircle3} ${responseStyles.amCircle3}`}></div>

      <img
        className={`${styles.amImg} ${responseStyles.amImg}`}
        src="https://kjwon2025.github.io/gaonimg/img/logofront2.png"
        alt="logo"
        style={{ ...imgStyle, zIndex: 1 }} // ✅ 이미지 위치만 반응형
      />

      {/* 글씨 건드리지 않음 */}
      <div
        className={`${styles.amTitle} ${responseStyles.amTitle}`}
        style={{ zIndex: 10 }}
      >
        <p>{menuContents[hovered].title}</p>
        <span>
          {menuContents[hovered].description.split("\n").map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </span>
      </div>

      {Object.keys(menuContents).map((menu) => (
        <span
          key={menu}
          className={`${styles.amMenu} ${responseStyles.amMenu} ${hovered === menu
            ? `${styles.amSelected} ${responseStyles.amSelected}` : ""
            }`}
          style={menuPositions[menu]}
          onMouseEnter={() => setHovered(menu)}
          onClick={() => {
            router.push(menuContents[menu].path);
            closeMenu();
          }}
        >
          {menu}
        </span>
      ))}

      <div
        className={`${styles.amMove} ${responseStyles.amMove}`}
        onClick={closeMenu}
      >
        <span className={`${styles.amBack} ${responseStyles.amBack}`}>
          BACK
        </span>
        <svg
          className={`${styles.amRightarrow} ${responseStyles.amRightarrow}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.5"
            d="M4 12h16m0 0l-6-6m6 6l-6 6"
          />
        </svg>
      </div>
    </div>
  );
}
