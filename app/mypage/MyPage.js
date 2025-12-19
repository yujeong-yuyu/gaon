"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";  // Import useRouter for redirection
import { FiUser, FiBookmark, FiFileText, FiGift, FiAlertCircle, FiCamera } from "react-icons/fi";
import { IoCart } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { LuTicketPercent } from "react-icons/lu";
import { MdOutlineReceiptLong } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";

import Header2 from "../components/Header2.js";
import Footer2 from "../components/Footer2.js";

import s from "@/styles/p-css/Mypage.module.css";
import rs from "@/styles/P-response/response-Mypage.module.css";

// === localStorage 키 통일 ===
const LS_CART_KEY = "gaon_cart";
const LS_PAYMENTS_KEY = "gaon_payments";
const LS_PROGRESS_KEY = "gaon_progress";

// === 소셜공통: 닉네임/이미지 해석 유틸 ===
function resolveDisplayName(u) {
  if (!u) return "게스트";

  // 가장 가능성 높은 필드부터 후보 나열
  const candidates = [
    u.nickname,
    u.name,
    u.displayName,
    u.username,
    u.given_name,            // google
    u.response?.nickname,    // naver
    u.profile?.nickname,     // some providers
    u.kakao_account?.profile?.nickname, // kakao
    u.email?.split("@")[0],
  ];
  return candidates.find(Boolean) || "게스트";
}

function resolveProfileImage(u) {
  if (!u) return null;
  const candidates = [
    u.image,                                 // next-auth 기본
    u.picture,                               // google
    u.profile_image_url,                     // kakao (경우에 따라)
    u.kakao_account?.profile?.profile_image_url, // kakao
    u.response?.profile_image,               // naver(일부 스키마)
    u.avatar_url,                            // 기타
  ];
  return candidates.find(Boolean) || null;
}
function resolveUserId(u) {
  if (!u) return "";
  // nickname, name, displayName, username 순으로 표시
  const candidates = [u.nickname, u.name, u.displayName, u.username];
  return candidates.find(Boolean) || "";
}


export default function MyPage({ openMenu = () => { }, user }) {
  const router = useRouter(); // Initialize useRouter
  const [isClient, setIsClient] = useState(false);
  const [viewer, setViewer] = useState(user ?? null);   // ← 먼저 선언
  const isLoggedIn = !!viewer;
  const [cart, setCart] = useState([]); // 현재 UI에 직접 사용 안 하지만 유지
  const [payments, setPayments] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);
  const paymentRef = useRef(null);

  const couponCount = isLoggedIn ? 3 : 0;

  // === 사용자/스토리지 동기화 ===
  useEffect(() => {
    setIsClient(true);

    // 1) 로컬스토리지에서 user 있으면 반영
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser && !viewer) setViewer(storedUser);
      if (storedUser && !profileImg) {
        const img = resolveProfileImage(storedUser);
        if (img) setProfileImg(img);
      }
    } catch { }

    // 2) 공통 스토리지 로드
    try {
      const c = JSON.parse(localStorage.getItem(LS_CART_KEY) || "[]");
      const p = JSON.parse(localStorage.getItem(LS_PAYMENTS_KEY) || "[]");
      const g = JSON.parse(localStorage.getItem(LS_PROGRESS_KEY) || "[]");
      setCart(Array.isArray(c) ? c : []);
      setPayments(Array.isArray(p) ? p : []);
      setProgressList(Array.isArray(g) ? g : []);
    } catch {
      setCart([]); setPayments([]); setProgressList([]);
    }

    // 3) 서버 세션 확인(/api/me)로 최신 사용자 정보 동기화
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.ok && data.user) {
          setViewer(data.user);
          // 최신 정보 로컬에도 저장(원하면)
          try { localStorage.setItem("user", JSON.stringify(data.user)); } catch { }
          const img = resolveProfileImage(data.user);
          if (img) setProfileImg(img);
        }
      } catch { }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // === useEffect to initialize localStorage data ===
  useEffect(() => {
    setIsClient(true);
    try {
      const c = JSON.parse(localStorage.getItem(LS_CART_KEY) || "[]");
      const p = JSON.parse(localStorage.getItem(LS_PAYMENTS_KEY) || "[]");
      const g = JSON.parse(localStorage.getItem(LS_PROGRESS_KEY) || "[]");
      setCart(Array.isArray(c) ? c : []);
      setPayments(Array.isArray(p) ? p : []);
      setProgressList(Array.isArray(g) ? g : []);
    } catch {
      setCart([]);
      setPayments([]);
      setProgressList([]);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImg(URL.createObjectURL(file));
  };

  // Scroll to payment section
  const scrollToPayment = () => {
    if (!isClient) return;
    const el = paymentRef.current;
    if (!el) return;
    const root = document.documentElement;
    const headerH =
      parseInt(getComputedStyle(root).getPropertyValue("--header-h")) || 72;
    const gap = 24;
    const y = el.getBoundingClientRect().top + window.scrollY - (headerH + gap);
    window.scrollTo({ top: y, behavior: "smooth" });
  };


  const displayName = resolveDisplayName(viewer);
  const displayId = resolveUserId(viewer); // ✅ 추가

  const handleLogin = () => {
    // 필요하면 ?next 파라미터로 돌아올 위치 지정 가능
    router.push("/login");
  }

  const handleLogout = async () => {
    try {
      // Log out API call
      const response = await fetch("/api/logout", {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        // Clear user data from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("remember");
        localStorage.removeItem(LS_CART_KEY);
        localStorage.removeItem(LS_PAYMENTS_KEY);
        localStorage.removeItem(LS_PROGRESS_KEY);
        setViewer(null);
        setProfileImg(null);

        alert("로그아웃 되었습니다.");

        // Redirect to login page
        router.push("/login");  // Use router here
      } else {
        alert("로그아웃 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      alert("로그아웃 실패: " + err.message);
    }
  };

  const class1 = useMemo(() => {
    if (!Array.isArray(progressList)) return null;
    return progressList.find(v => v.lectureId === "class1") || null;
  }, [progressList]);

  // 내 강의실: 중복 제거(lectureId 기준)
  const lecturesUnique = useMemo(() => {
    if (!Array.isArray(progressList)) return [];
    const seen = new Set();
    return progressList.filter(v => {
      const key = v.lectureId ?? v.title; // lectureId 없을 때 title 대체
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [progressList])

  return (
    <>
      <Header2 openMenu={openMenu} />

      <div className={`${s["my-mypage"]} ${rs["my-mypage"]}`}>
        <div className={`${s["my-mypage-wrap"]} ${rs["my-mypage-wrap"]}`}>
          <input
            ref={fileInputRef}
            id="my-profileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          <div className={`${s["my-header"]} ${rs["my-header"]}`}>
            <h1 className={`${s["my-title"]} ${rs["my-title"]}`}>MY GAON</h1>
            <div className={`${s["my-line"]} ${rs["my-line"]}`} />
            <div className={`${s["my-linedot"]} ${rs["my-linedot"]}`} />
          </div>

          <div className={`${s["my-container"]} ${rs["my-container"]}`}>
            {/* LEFT */}
            <aside
              className={`${s["my-left"]} ${rs["my-left"]} ${s["desktop-only"]} ${rs["desktop-only"]}`}
            >
              <div className={`${s["my-profile"]} ${rs["my-profile"]}`}>
                <div
                  className={`${s["my-profile-imgbox"]} ${rs["my-profile-imgbox"]}`}
                >
                  <div
                    className={`${s["my-profile-img"]} ${rs["my-profile-img"]}`}
                  >
                    {profileImg ? (
                      <img
                        src={profileImg}
                        alt="프로필"
                        className={`${s["my-profile-preview"]} ${rs["my-profile-preview"]}`}
                      />
                    ) : (
                      <div
                        className={`${s["my-profile-placeholder"]} ${rs["my-profile-placeholder"]}`}
                      />
                    )}
                  </div>
                  <label
                    htmlFor="my-profileUpload"
                    className={`${s["my-profile-add"]} ${rs["my-profile-add"]}`}
                  >
                    <FiCamera />
                  </label>
                </div>
                <p className={`${s["my-profile-name"]} ${rs["my-profile-name"]}`}>
                  <strong>{displayName}님</strong>
                  <br />
                  반가워요!
                </p>
                {isLoggedIn ? (
                  <button
                    type="button"
                    className={`${s["my-profile-logout"]} ${rs["my-profile-logout"]}`}
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${s["my-profile-logout"]} ${rs["my-profile-logout"]}`}
                    onClick={handleLogin}
                  >
                    로그인
                  </button>
                )}
              </div>

              <nav
                className={`${s["my-menu"]} ${rs["my-menu"]}`}
                aria-label="사이드 메뉴"
              >
                <section
                  className={`${s["my-menu-section"]} ${rs["my-menu-section"]}`}
                >
                  <div className={`${s["my-menu-head"]} ${rs["my-menu-head"]}`}>
                    <FiUser
                      className={`${s["my-menu-icon"]} ${rs["my-menu-icon"]}`}
                    />
                    <span className={s["my-menu-title"]}>마이페이지</span>
                  </div>
                  <ul className={`${s["my-menu-list"]} ${rs["my-menu-list"]}`}>
                    <li>프로필</li>
                    <li>장바구니</li>
                    <li>
                      <button
                        type="button"
                        className={`${s["my-linklike"]} ${rs["my-linklike"]}`}
                        onClick={scrollToPayment}
                      >
                        결제 내역
                      </button>
                    </li>
                    <li>쿠폰</li>
                  </ul>
                </section>

                <section
                  className={`${s["my-menu-section"]} ${rs["my-menu-section"]}`}
                >
                  <div className={`${s["my-menu-head"]} ${rs["my-menu-head"]}`}>
                    <FiBookmark
                      className={`${s["my-menu-icon"]} ${rs["my-menu-icon"]}`}
                    />
                    <span className={s["my-menu-title"]}>내 강의실</span>
                  </div>
                  <ul className={`${s["my-menu-list"]} ${rs["my-menu-list"]}`}>
                    <li>진행중인 강의</li>
                    <li>수강 완료 강의</li>
                    <li>학습 기록</li>
                  </ul>
                </section>

                <section
                  className={`${s["my-menu-section"]} ${rs["my-menu-section"]}`}
                >
                  <div className={`${s["my-menu-head"]} ${rs["my-menu-head"]}`}>
                    <FiFileText
                      className={`${s["my-menu-icon"]} ${rs["my-menu-icon"]}`}
                    />
                    <span className={s["my-menu-title"]}>수료증</span>
                  </div>
                  <ul className={`${s["my-menu-list"]} ${rs["my-menu-list"]}`}>
                    <li>다운로드</li>
                  </ul>
                </section>

                <section
                  className={`${s["my-menu-section"]} ${rs["my-menu-section"]}`}
                >
                  <div className={`${s["my-menu-head"]} ${rs["my-menu-head"]}`}>
                    <FiGift
                      className={`${s["my-menu-icon"]} ${rs["my-menu-icon"]}`}
                    />
                    <span className={s["my-menu-title"]}>선물함</span>
                  </div>
                  <ul className={`${s["my-menu-list"]} ${rs["my-menu-list"]}`}>
                    <li>받은 선물</li>
                  </ul>
                </section>
              </nav>
            </aside>

            {/* 모바일 프로필/퀵메뉴 */}
            <div
              className={`${s["my-profile-m"]} ${rs["my-profile-m"]} ${s["mobile-only"]} ${rs["mobile-only"]}`}
            >
              <div
                className={`${s["my-profile-imgbox-m"]} ${rs["my-profile-imgbox-m"]}`}
              >
                <div
                  className={`${s["my-profile-img-m"]} ${rs["my-profile-img-m"]}`}
                >
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt="프로필"
                      className={`${s["my-profile-preview"]} ${rs["my-profile-preview"]}`}
                    />
                  ) : (
                    <div
                      className={`${s["my-profile-placeholder"]} ${rs["my-profile-placeholder"]}`}
                    />
                  )}
                </div>
                <label
                  htmlFor="my-profileUpload"
                  className={`${s["my-profile-add-m"]} ${rs["my-profile-add-m"]}`}
                >
                  <FiCamera />
                </label>
              </div>
              <p className={`${s["my-profile-name-m"]} ${rs["my-profile-name-m"]}`}>
                <strong>{displayName}님</strong>
                <br />
                반가워요!
              </p>
            </div>

            <nav
              className={`${s["my-left-m"]} ${rs["my-left-m"]} ${s["mobile-only"]} ${rs["mobile-only"]}`}
              aria-label="마이페이지 빠른메뉴"
            >
              <ul className={`${s["my-m-grid"]} ${rs["my-m-grid"]}`}>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <CgProfile />
                  </i>
                  <span className={`${s["my-m-txt"]} ${rs["my-m-txt"]}`}>
                    프로필
                  </span>
                </li>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <IoCart />
                  </i>
                  <span className={`${s["my-m-txt"]} ${rs["my-m-txt"]}`}>
                    장바구니
                  </span>
                </li>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <MdOutlineReceiptLong />
                  </i>
                  <button
                    type="button"
                    className={`${s["my-m-txt"]} ${rs["my-m-txt"]} ${s["my-linklike"]} ${rs["my-linklike"]}`}
                    onClick={scrollToPayment}
                  >
                    결제 내역
                  </button>
                </li>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <LuTicketPercent />
                  </i>
                  <span className={`${s["my-m-txt"]} ${rs["my-m-txt"]}`}>
                    쿠폰
                  </span>
                </li>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <FaRegCheckCircle />
                  </i>
                  <span className={`${s["my-m-txt"]} ${rs["my-m-txt"]}`}>
                    수강 완료 강의
                  </span>
                </li>
                <li className={`${s["my-m-item"]} ${rs["my-m-item"]}`}>
                  <i className={`${s["my-m-ico"]} ${rs["my-m-ico"]}`}>
                    <RiGraduationCapFill />
                  </i>
                  <span className={`${s["my-m-txt"]} ${rs["my-m-txt"]}`}>
                    학습 기록
                  </span>
                </li>
              </ul>
            </nav>

            {/* RIGHT */}
            <section className={`${s["my-right"]} ${rs["my-right"]}`}>
              <div className={`${s["my-boxs"]} ${rs["my-boxs"]}`}>
                <div className={`${s["my-box"]} ${rs["my-box"]}`}>
                  <p className={`${s["my-box-text"]} ${rs["my-box-text"]}`}>
                    쿠폰
                  </p>
                  <p className={`${s["my-box-number"]} ${rs["my-box-number"]}`}>{couponCount}장</p>
                </div>
                <div className={`${s["my-box"]} ${rs["my-box"]}`}>
                  <p className={`${s["my-box-text"]} ${rs["my-box-text"]}`}>
                    수료증
                  </p>
                  <p className={`${s["my-box-number"]} ${rs["my-box-number"]}`}>
                    0장
                  </p>
                </div>
                <div className={`${s["my-box"]} ${rs["my-box"]}`}>
                  <p className={`${s["my-box-text"]} ${rs["my-box-text"]}`}>
                    선물함
                  </p>
                  <p className={`${s["my-box-number"]} ${rs["my-box-number"]}`}>
                    0장
                  </p>
                </div>
              </div>

              {/* 진행중인 강의 */}
              <div className={`${s["my-progress"]} ${rs["my-progress"]}`}>
                <h2 className={`${s["my-subtitle"]} ${rs["my-subtitle"]}`}>
                  진행중인 강의
                </h2>

                {isClient && class1 ? (
                  <div className={`${s["my-progress-box"]} ${rs["my-progress-box"]}`} key={class1.lectureId}>
                    <div className={`${s["my-progress-info"]} ${rs["my-progress-info"]}`}>
                      <p>{class1.title}</p>
                      <span>총 {class1.total}강</span>
                    </div>
                    <div className={`${s["my-progress-body"]} ${rs["my-progress-body"]}`}>
                      <div className={`${s["my-progress-video"]} ${rs["my-progress-video"]}`}>
                        {class1.thumb ? (
                          <img src={class1.thumb} alt={class1.title} className={s["fit-img"]} />
                        ) : (
                          <div className={s["my-progress-video-ph"]} />
                        )}
                      </div>
                      <div className={`${s["my-progress-track"]} ${rs["my-progress-track"]}`}>
                        <div className={`${s["my-progress-num"]} ${rs["my-progress-num"]}`}>
                          <span>진행도</span>
                          <span>{class1.progress} / {class1.total}</span>
                        </div>
                        <div className={`${s["my-progress-bar"]} ${rs["my-progress-bar"]}`}>
                          <div
                            className={s["my-progress-fill"]}
                            style={{ width: `${Math.round((class1.progress / class1.total) * 100)}%` }}
                          />
                        </div>
                        <ul className={`${s["my-progress-scale"]} ${rs["my-progress-scale"]}`}>
                          <li>0</li>
                          <li>{Math.floor(class1.total / 4)}</li>
                          <li>{Math.floor(class1.total / 2)}</li>
                          <li>{Math.floor((class1.total * 3) / 4)}</li>
                          <li>{class1.total}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (

                  <div
                    className={`${s["my-payment-empty"]} ${rs["my-payment-empty"]}`}
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className={`${s["my-payment-empty-texts"]} ${rs["my-payment-empty-texts"]}`}
                    >
                      <FiAlertCircle
                        className={`${s["my-payment-empty-ico"]} ${rs["my-payment-empty-ico"]}`}
                      />
                      <span
                        className={`${s["my-payment-empty-text"]} ${rs["my-payment-empty-text"]}`}
                      >
                        진행 중인 강의가 없습니다.
                      </span>
                    </div>
                    <a
                      className={`${s["my-payment-cta"]} ${rs["my-payment-cta"]}`}
                      href="/category1"
                    >
                      강의 보러가기
                    </a>
                  </div>
                )}

              </div>

              {/* 내 강의실 */}
              <div className={`${s["my-lecture"]} ${rs["my-lecture"]}`}>
                <h2 className={`${s["my-subtitle"]} ${rs["my-subtitle"]}`}>
                  내 강의실
                </h2>
                <div
                  className={`${s["my-lecture-list"]} ${rs["my-lecture-list"]}`}
                >
                  {isClient && lecturesUnique.length > 0
                    ? lecturesUnique.map((lec) => (
                      <div
                        className={`${s["my-lecture-item"]} ${rs["my-lecture-item"]}`}
                        key={lec.lectureId}
                      >
                        <div
                          className={`${s["my-lecture-thumb"]} ${rs["my-lecture-thumb"]}`}
                        >
                          {lec.thumb ? (
                            <img
                              src={lec.thumb}
                              alt={lec.title}
                              className={s["fit-img"]}
                            />
                          ) : (
                            <div className={s["my-lecture-thumb-ph"]} />
                          )}
                        </div>
                        <div
                          className={`${s["my-lecture-info"]} ${rs["my-lecture-info"]}`}
                        >
                          <p
                            className={`${s["my-lecture-title"]} ${rs["my-lecture-title"]}`}
                          >
                            {lec.title}
                          </p>
                          <p
                            className={`${s["my-lecture-total"]} ${rs["my-lecture-total"]}`}
                          >
                            총 {lec.total}강 · 진행 {lec.progress}강
                          </p>
                        </div>
                      </div>
                    ))
                    : // 🔹 데이터가 없어도 레이아웃 유지: 스켈레톤/플레이스홀더 3개
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        className={`${s["my-lecture-item"]} ${rs["my-lecture-item"]}`}
                        key={`placeholder-${idx}`}
                        aria-hidden="true"
                      >
                        <div
                          className={`${s["my-lecture-thumb"]} ${rs["my-lecture-thumb"]} ${s["is-skeleton"]}`}
                        />
                        <div
                          className={`${s["my-lecture-info"]} ${rs["my-lecture-info"]}`}
                        >
                          <p
                            className={`${s["my-lecture-title"]} ${rs["my-lecture-title"]} ${s["is-skeleton-text"]}`}
                          >
                            &nbsp;
                          </p>
                          <p
                            className={`${s["my-lecture-total"]} ${rs["my-lecture-total"]} ${s["is-skeleton-text"]}`}
                          >
                            &nbsp;
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 결제 내역 */}
              <div
                id="payment"
                ref={paymentRef}
                className={`${s["my-payment"]} ${rs["my-payment"]}`}
              >
                <h2 className={`${s["my-subtitle"]} ${rs["my-subtitle"]}`}>
                  결제 내역
                </h2>
                {isClient && payments.length > 0 ? (
                  <div
                    className={`${s["my-payment-box"]} ${rs["my-payment-box"]}`}
                  >
                    {payments.map((pay) => (
                      <div
                        className={`${s["my-payment-item"]} ${rs["my-payment-item"]}`}
                        key={pay.order || pay.id}
                      >
                        <div
                          className={`${s["my-pay-thumb"]} ${rs["my-pay-thumb"]}`}
                        >
                          {pay.thumb ? (
                            <img src={pay.thumb} alt={pay.title} />
                          ) : (
                            <div
                              className={`${s["my-pay-thumb-placeholder"]} ${rs["my-pay-thumb-placeholder"]}`}
                            />
                          )}
                        </div>
                        <div
                          className={`${s["my-pay-info"]} ${rs["my-pay-info"]}`}
                        >
                          <p
                            className={`${s["my-pay-title"]} ${rs["my-pay-title"]}`}
                          >
                            {pay.title}
                          </p>
                          <div
                            className={`${s["my-pay-text"]} ${rs["my-pay-text"]}`}
                          >
                            <span>결제 날짜</span>
                            <span>{pay.date}</span>
                          </div>
                          <div
                            className={`${s["my-pay-text"]} ${rs["my-pay-text"]}`}
                          >
                            <span>가격</span>
                            <span>{((pay.finalTotal ?? pay.price) || 0).toLocaleString()}원</span>
                          </div>
                          <div
                            className={`${s["my-pay-text"]} ${rs["my-pay-text"]}`}
                          >
                            <span>주문 번호</span>
                            <span>{pay.order || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`${s["my-payment-empty"]} ${rs["my-payment-empty"]}`}
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className={`${s["my-payment-empty-texts"]} ${rs["my-payment-empty-texts"]}`}
                    >
                      <FiAlertCircle
                        className={`${s["my-payment-empty-ico"]} ${rs["my-payment-empty-ico"]}`}
                      />
                      <span
                        className={`${s["my-payment-empty-text"]} ${rs["my-payment-empty-text"]}`}
                      >
                        결제 내역이 없습니다.
                      </span>
                    </div>
                    <a
                      className={`${s["my-payment-cta"]} ${rs["my-payment-cta"]}`}
                      href="/category1"
                    >
                      쇼핑 계속하기
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer2 />
    </>
  );
}
