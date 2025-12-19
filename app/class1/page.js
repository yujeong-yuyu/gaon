"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import css from "./Class1.module.css";               // CSS 모듈
import 반응형 from "./response-Class1.module.css";    // 반응형 CSS 모듈

const Class1 = ({ openMenu }) => {
  // -----------------------------
  // 공통 상태
  // -----------------------------
  const [activeIndex, setActiveIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);     // 동영상 모달
  const [newModalOpen, setNewModalOpen] = useState(false); // 진행도 질문 모달

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  const [progress, setProgress] = useState(0);
  const [currentLectureTitle, setCurrentLectureTitle] =
    useState("1강. 배변훈련의 첫걸음");
  const [lastViewedLecture, setLastViewedLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);

  const reviewSectionRef = useRef(null);
  const contentRefs = useRef({});
  const router = useRouter();

  // -----------------------------
  // 상수/스토리지 키
  // -----------------------------
  const CART_KEY = "gaon_cart";
  const CHECKOUT_KEY = "gaon_checkout";
  const LS_PROGRESS_KEY = "gaon_progress"; // <== 추가

  // 데모용 로그인 체크
  const requireLogin = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.ok ? data.user : null;
    } catch {
      return null;
    }
  };

  // 상품(이 강의)
  const PRODUCT = {
    id: "class1",
    title: "반려동물 배변훈련",
    price: 100000,
    thumb: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1mv.jpg",
    qty: 1,
  };

  // 장바구니 담기
  const addToCart = (item) => {
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];

      const idx = cart.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        cart[idx] = { ...cart[idx], ...item, qty: 1 };
      } else {
        cart.push({ ...item, qty: 1 });
      }

      // 최종 중복 정리
      const byId = {};
      for (const it of cart) {
        if (!it?.id) continue;
        byId[it.id] = { ...it, qty: 1 };
      }
      localStorage.setItem(CART_KEY, JSON.stringify(Object.values(byId)));
      return true;
    } catch {
      return false;
    }
  };

  const handleContinueClick = async () => {
    const me = await requireLogin();
    if (!me) {
      alert("로그인 후 강의를 시청할 수 있습니다.");
      const back = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(back)}`);
      return;
    }
    if (!lastViewedLecture) {
      alert("아직 이어볼 강의가 없어요. 첫 강의부터 시작해볼까요?");
      return;
    }
    setSelectedLecture(lastViewedLecture);
    setModalOpen(true);
  };


  const upsertMyProgress = (completedIds, lastId = null) => {
    try {
      const key = LS_PROGRESS_KEY; // "gaon_progress"


      const record = {
        lectureId: "class1",
        title: PRODUCT.title,
        total: lectures.length,          // 총 강의 수(=10)
        progress: completedIds.length,   // 완료한 개수
        thumb: PRODUCT.thumb,
        watchedIds: completedIds,        // 중복 방지/복원용
        lastViewedId: lastId ?? null,
      };

      // ✅ 무조건 class1 하나만 저장
      localStorage.setItem(key, JSON.stringify([record]));
    } catch (e) {
      console.error("진행도 저장 실패:", e);
    }
  };

  const markCurrentLectureCompleted = () => {
    if (!selectedLecture) return;

    const nextCompleted = Array.from(new Set([
      ...completedLectures,
      selectedLecture.id
    ])).sort((a, b) => a - b);

    setCompletedLectures(nextCompleted);
    const pct = Math.round((nextCompleted.length / lectures.length) * 100);
    setProgress(pct);

    const titleWithoutNumber = selectedLecture.title.replace(/^\d+강\. /, "");
    setCurrentLectureTitle(`${selectedLecture.id}강. ${titleWithoutNumber}`);

    // 로컬스토리지에 '개수(progress)'로 저장 => 마이페이지가 그대로 읽음
    upsertMyProgress(nextCompleted, selectedLecture.id);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PROGRESS_KEY) || "[]";
      const arr = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const me = arr.find(x => x.lectureId === "class1");
      if (me) {
        const done = Array.isArray(me.watchedIds) ? me.watchedIds : [];
        setCompletedLectures(done);
        setProgress(Math.round(((me.progress ?? done.length) / lectures.length) * 100));
        if (me.lastViewedId) {
          const lv = lectures.find(l => l.id === me.lastViewedId);
          if (lv) setLastViewedLecture(lv);
        }
      }
    } catch { /* noop */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // -----------------------------
  // 강의 리스트/페이징
  // -----------------------------
  const lectures = [
    {
      id: 1, title: "1강. 배변훈련의 첫걸음", shortsub: "배변훈련 준비물과 환경 설정을 알아보고\n\n강아지 초기 적응 방법을 학습합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video1.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1mv.jpg",
      desc: "강아지 배변훈련을 시작하기 전에 필요한 준비물과\n환경 설정에 대해 자세히 알아봅니다.\n\n강아지의 나이와 발달 상태를 고려한\n훈련 계획을 수립하고 초기 적응 방법을 학습합니다.\n\n또한 주인의 태도와 올바른 보상 방법을 통해\n훈련 성공률을 높이는 팁을 제공합니다."
    },
    {
      id: 2, title: "2강. 사회화 시작", shortsub: "강아지의 사회화 방법과 단계별 접근법을 학습하고\n\n안전하게 적응하도록 돕습니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video2.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "강아지가 다양한 사람, 동물, 환경에 적응하도록 사회화하는 방법을 안내합니다.\n\n사회화 단계별 접근법과 놀이, 긍정적 강화 훈련을 활용한 안전한 사회화 방법을 배웁니다.\n\n초기 단계에서 겪을 수 있는 불안과 문제 행동에 대응하는 팁도 함께 제공합니다."
    },
    {
      id: 3, title: "3강. 배변 실수 대처법", shortsub: "배변 실수를 예방하고 발생 시 올바르게 대처하는\n\n방법을 학습합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video3.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "실내에서 발생하는 배변 실수를 예방하고, 실수 시 올바르게 대처하는 방법을 자세히 설명합니다.\n\n실수의 원인을 분석하고, 환경 조정, 일관된 훈련, 긍정적 강화 등을 활용하여 문제를 해결합니다.\n\n또한 배변 패드 사용법과 청결 유지 방법도 함께 학습합니다."
    },
    {
      id: 4, title: "4강. 실전 연습", shortsub: "실제 환경에서 배변훈련을 연습하고\n\n강아지가 스스로 신호를 인식하도록 합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video4.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "실제 환경에서 배변훈련을 적용하며 반복 연습을 통해 강아지가 습관을 익히도록 합니다.\n\n훈련 중 나타날 수 있는 다양한 상황과 문제 행동을 시뮬레이션하며, 올바른 대응 방법을 배웁니다.\n\n강아지가 스스로 배변 신호를 인식하도록 돕는 연습도 포함되어 있습니다."
    },
    {
      id: 5, title: "5강. 완벽한 습관 만들기", shortsub: "일관된 훈련과 실습으로 배변 습관을 완성하고\n\n훈련 오류를 예방합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video5.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "강아지가 배변 습관을 완전히 익히도록 일관된 훈련 계획과 구체적인 실습 방법을 제공합니다.\n\n보상 타이밍, 칭찬 방식, 반복 훈련 주기 등 세부 전략을 배워 습관 형성을 최적화합니다.\n\n훈련 중 흔히 발생하는 오류를 예방하는 방법도 함께 안내합니다."
    },
    {
      id: 6, title: "6강. 외출 중 훈련", shortsub: "외출 중에도 배변훈련을 유지하고\n\n공공장소에서 안전하게 훈련합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video6.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "외출 시 배변훈련을 유지하는 방법과 공공장소에서의 안전 및 매너 교육을 안내합니다.\n\n배변 장소 선택, 이동 중 신호 관찰, 즉각적인 보상 등 실전 노하우를 배웁니다.\n\n외출 중 훈련 실패 상황에 대한 대처법도 포함되어 있습니다."
    },
    {
      id: 7, title: "7강. 배변 신호 이해", shortsub: "강아지의 배변 신호를 관찰하고 이해하여\n\n실수를 최소화합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video7.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "강아지가 배변을 하고 싶을 때 나타내는 신호를 관찰하고 이해하는 방법을 안내합니다.\n\n앉기, 빙빙 돌기, 짖기 등 다양한 행동 신호를 해석하고, 적절히 대응하는 전략을 배웁니다.\n\n이를 통해 배변 실수를 최소화하고, 훈련 효율성을 높일 수 있습니다."
    },
    {
      id: 8, title: "8강. 밤중 훈련 팁", shortsub: "밤 시간 배변 문제를 예방하고 관리하는\n\n실용적인 팁을 제공합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video8.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "밤 시간 동안 강아지의 배변 문제를 예방하고 관리하는 방법을 안내합니다.\n\n밤중 산책 루틴, 배변 신호 확인, 수면 환경 조정 등 실용적인 팁을 제공합니다.\n\n강아지가 안정적으로 밤을 보내며 배변 습관을 유지하도록 돕는 전략을 배웁니다."
    },
    {
      id: 9, title: "9강. 문제 행동 교정", shortsub: "배변 외 문제 행동을 예방하고\n\n교정하는전략을 배웁니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video9.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "배변 외 문제 행동을 예방하고\n교정하는 방법을 안내합니다.\n\n긍정적 강화, 일관성 있는 지시, 환경 관리 등을 통해 문제 행동을 수정하는 전략을 배웁니다.\n\n훈련 과정에서 흔히 나타나는 공격성, 짖음, 씹기 등의 문제와 해결 방법도 포함되어 있습니다."
    },
    {
      id: 10, title: "10강. 훈련 마무리", shortsub: "훈련 최종 점검과 유지 관리 방법을 안내하고\n\n습관을 안정적으로 유지합니다.", video: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/video/cl1video10.mp4", img: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1v1.jpg",
      desc: "배변훈련 최종 점검과 유지 관리 방법을 안내합니다.\n\n훈련 완료 후에도 습관이 유지되도록 일상에서 적용할 수 있는 관리 방법과 추가 팁을 제공합니다.\n\n강아지와 주인이 안정적으로 훈련을 마무리할 수 있도록 종합 정리합니다."
    },
  ];


  const lecturesPerPage = 5;
  const totalPages = Math.ceil(lectures.length / lecturesPerPage);
  const startIndex = (currentPage - 1) * lecturesPerPage;
  const endIndex = startIndex + lecturesPerPage;
  const currentLectures = lectures.slice(startIndex, endIndex);

  // -----------------------------
  // 아코디언 초기/변경 처리
  // -----------------------------
  useEffect(() => {
    Object.values(contentRefs.current).forEach((ref) => {
      if (ref) ref.style.maxHeight = "0px";
    });
    const firstLectureId = currentPage === 1 ? 1 : 6;
    setActiveIndex(firstLectureId);
    const first = contentRefs.current[firstLectureId];
    if (first) first.style.maxHeight = first.scrollHeight + "px";
  }, [currentPage]);

  useEffect(() => {
    Object.entries(contentRefs.current).forEach(([id, ref]) => {
      if (!ref) return;
      if (Number(id) === activeIndex) {
        ref.style.maxHeight = ref.scrollHeight + "px";
        ref.style.opacity = 1;
      } else {
        ref.style.maxHeight = "0px";
        ref.style.opacity = 0;
      }
    });
  }, [activeIndex]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // -----------------------------
  // 모달 오버플로우 제어
  // -----------------------------
  useEffect(() => {
    document.body.style.overflow = (modalOpen || newModalOpen) ? "hidden" : "auto";
  }, [modalOpen, newModalOpen]);

  // -----------------------------
  // 페이지 이동
  // -----------------------------
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setActiveIndex(null);
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setActiveIndex(null);
      setCurrentPage(currentPage + 1);
    }
  };

  // -----------------------------
  // 장바구니/결제 이동
  // -----------------------------
  const goCart = async () => {
    const me = await requireLogin();
    if (!me) {
      alert("로그인 후 장바구니를 이용할 수 있습니다.");
      const back = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(back)}`);
      return;
    }
    const ok = addToCart(PRODUCT);
    if (ok) {
      alert("장바구니에 담겼습니다.");
      router.push("/cart2");
    } else {
      alert("장바구니 담기에 실패했습니다.");
    }
  };

  const goPayment = async () => {
    const me = await requireLogin();
    if (!me) {
      alert("로그인 후 결제할 수 있습니다.");
      const back = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(back)}`);
      return;
    }
    const payload = [
      { id: PRODUCT.id, title: PRODUCT.title, price: PRODUCT.price, qty: 1, thumb: PRODUCT.thumb, coupon: 0 },
    ];
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
    router.push("/PaymentPage");
  };

  // -----------------------------
  // 모달 제어
  // -----------------------------
  const openModal = async (lecture) => {
    const me = await requireLogin();
    if (!me) {
      alert("로그인 후 강의를 시청할 수 있습니다.");
      const back = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(back)}`);
      return; // ❗ 로그인 전이면 모달 열지 않음
    }
    setSelectedLecture(lecture);
    setLastViewedLecture(lecture);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedLecture(null);
  };

  // -----------------------------
  // 진행도 제어
  // -----------------------------
  const handleProgressIncrease = () => {
    if (!selectedLecture) return;
    if (!completedLectures.includes(selectedLecture.id)) {
      const newProgress = Math.min(progress + 10, 100);
      setProgress(newProgress);
      setCompletedLectures([...completedLectures, selectedLecture.id]);

      const lectureIndex = lectures.findIndex((lec) => lec.id === selectedLecture.id);
      const lectureTitleWithoutNumber = lectures[lectureIndex].title.replace(/^\d+강\. /, "");
      setCurrentLectureTitle(`${selectedLecture.id}강. ${lectureTitleWithoutNumber}`);
    }
    setNewModalOpen(false);
  };
  const handleStepChange = (step) => setSelectedStep(step);

  // -----------------------------
  // 리뷰(로컬스토리지)
  // -----------------------------
  const [reviews, setReviews] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("reviews");
      return stored ? JSON.parse(stored) : [
        { id: 1, text: "배변 훈련 강의가 정말 유익했어요! 자세한 설명 덕분에 초보자도 쉽게 따라할 수 있었습니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg1.jpg" },
        { id: 2, text: "사회화 강의 덕분에 강아지가 사람들에게 더 친근해졌어요. 추천합니다!", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg2.jpg" },
        { id: 3, text: "배변 실수 대처법 강의가 너무 도움이 되었어요. 실제 상황에 적용하기 좋습니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg3.jpg" },
        { id: 4, text: "실전 연습 강의를 통해 강아지와 함께 반복 연습하니 점점 습관이 잡히네요.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg4.jpg" },
        { id: 5, text: "완벽한 습관 만들기 강의에서 구체적인 훈련 방법을 알게 되어 유익했습니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg5.jpg" },
        { id: 6, text: "외출 중 훈련 팁 덕분에 외출 시에도 배변 훈련이 잘 유지됩니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg6.jpg" },
        { id: 7, text: "배변 신호 이해 강의에서 신호를 잘 관찰할 수 있게 되었어요. 강아지가 편안해하는 게 느껴집니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg7.jpg" },
        { id: 8, text: "밤중 훈련 팁으로 밤 시간에도 배변 문제가 줄었어요. 실용적입니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg8.jpg" },
        { id: 9, text: "문제 행동 교정 강의를 듣고 강아지의 문제 행동이 많이 개선되었습니다.", userImg: "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/rlistimg9.jpg" },

      ];
    }
    return [];
  });

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 3;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
  const reviewStartIndex = (reviewPage - 1) * reviewsPerPage;
  const reviewEndIndex = reviewStartIndex + reviewsPerPage;
  const currentReviews = reviews.slice(reviewStartIndex, reviewEndIndex);
  const [reviewImg, setReviewImg] = useState(null);
  const currentUser =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;
  const [editingReviewId, setEditingReviewId] = useState(null);

  const handleAddReview = () => {
    if (!currentUser) return alert("로그인 후 리뷰를 작성할 수 있습니다.");
    if (!reviewText.trim()) return alert("내용을 입력해주세요!");
    if (rating === 0) return alert("별점을 선택해주세요!");

    if (editingReviewId) {
      const updatedReviews = reviews.map((r) =>
        r.id === editingReviewId
          ? { ...r, text: reviewText, rating, userImg: reviewImg || r.userImg, userId: currentUser.id }
          : r
      );
      setReviews(updatedReviews);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
      setEditingReviewId(null);
    } else {
      const newReview = {
        id: reviews.length ? reviews[reviews.length - 1].id + 1 : 1,
        text: reviewText,
        rating,
        userImg: reviewImg || "https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/logoback1.png",
        userId: currentUser.id,
      };
      const updated = [...reviews, newReview];
      setReviews(updated);
      localStorage.setItem("reviews", JSON.stringify(updated));
    }

    setReviewText("");
    setRating(0);
    setReviewImg(null);
  };

  const handleDeleteReview = (review) => {
    if (!currentUser) return alert("로그인 후 삭제할 수 있습니다.");
    if (currentUser.id !== review.userId) return alert("본인이 작성한 리뷰만 삭제할 수 있습니다.");
    const updated = reviews.filter((r) => r.id !== review.id);
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
  };

  const handleEditReview = (review) => {
    if (!currentUser) return alert("로그인 후 수정할 수 있습니다.");
    if (currentUser.id !== review.userId) return alert("본인이 작성한 리뷰만 수정할 수 있습니다.");
    setEditingReviewId(review.id);
    setReviewText(review.text);
    setRating(review.rating);
    setReviewImg(review.userImg);
    reviewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // -----------------------------
  // 렌더
  // -----------------------------
  return (
    <div className={`${css.cl1_wrap} ${반응형.cl1_wrap}`}>
      <Header2 openMenu={openMenu} />

      <div className={`${css.cl1_container} ${반응형.cl1_container}`}>
        {/* 상단 메인 영역 */}
        <div className={`${css.cl1_maininfo} ${반응형.cl1_maininfo}`}>
          <div
            className={`${css.cl1_mainvideo} ${반응형.cl1_mainvideo}`}
            onClick={handleContinueClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleContinueClick();
            }}
          >
            <div className={`${css.cl1_mvbtn} ${반응형.cl1_mvbtn}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path fill="currentColor" fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m3.901 7L6 4.066v7.868z" clipRule="evenodd" />
              </svg>
              <span>이어보기</span>
            </div>
            <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/class1mv.jpg" alt="c1mv" />
          </div>

          <div className={`${css.cl1_maintextbox} ${반응형.cl1_maintextbox}`}>
            <p>반려동물 배변훈련</p>
            <div className={`${css.cl1_subbox} ${반응형.cl1_subbox}`}>
              <div className={`${css.cl1_subtext} ${반응형.cl1_subtext}`}><span>학습 대상</span><span>생후 8 - 12주차</span></div>
              <div className={`${css.cl1_subtext} ${반응형.cl1_subtext}`}><span>강의 구성</span><span>총 10강</span></div>
              <div className={`${css.cl1_subtext} ${반응형.cl1_subtext}`}><span>가격</span><span>100,000원</span></div>
            </div>

            <div className={`${css.cl1_perbox} ${반응형.cl1_perbox}`}>
              <p>강의 진행도</p>
              <div className={`${css.cl1_colorbox} ${반응형.cl1_colorbox}`}>
                <span>진행도 {Math.round(progress)}%</span>
                <div className={`${css.cl1_current} ${반응형.cl1_current}`}>{currentLectureTitle}</div>
              </div>
              <div className={`${css.cl1_100} ${반응형.cl1_100}`}>
                <div className={`${css.cl1_now} ${반응형.cl1_now}`} style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }} />
              </div>
            </div>

            <div className={`${css.cl1_btns} ${반응형.cl1_btns}`}>
              <div
                className={`${css.cl1_cart} ${반응형.cl1_cart}`}
                onClick={goCart}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goCart()}
              >
                장바구니
              </div>
              <div
                className={`${css.cl1_buy} ${반응형.cl1_buy}`}
                onClick={goPayment}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goPayment()}
              >
                구매하기
              </div>
            </div>
          </div>
        </div>

        {/* 커리큘럼 요약 */}
        <div className={`${css.cl1_curriculum} ${반응형.cl1_curriculum}`}>
          <div className={`${css.cl1_title} ${반응형.cl1_title}`}>
            <span>Curriculum</span>
            <div className={`${css.cl1_titleline} ${반응형.cl1_titleline}`} />
          </div>

          <div className={`${css.cl1_curbox} ${반응형.cl1_curbox}`}>
            <div className={`${css.cl1_steps} ${반응형.cl1_steps}`}>
              <div className={`${css.cl1_step} ${반응형.cl1_step}`}>STEP 01</div>
              <p>배변훈련 기초</p>
              <span>강아지 배변훈련의 기본 준비물과<br />환경 설정 방법을 배우며,<br />초기 적응과 사회화의 기초를 단계별로 학습합니다.</span>
              <div className={`${css.cl1_part} ${반응형.cl1_part}`}><span className={`${css.cl1_part1} ${반응형.cl1_part1}`}>PART</span><span>1 - 3</span></div>
            </div>

            <div className={`${css.cl1_steps} ${반응형.cl1_steps}`}>
              <div className={`${css.cl1_step} ${반응형.cl1_step}`}>STEP 02</div>
              <p>실전 훈련 및 사회화</p>
              <span>배변 실수 예방과 대응법을 익히고,<br />실전 연습을 통해 강아지가<br />스스로 배변 신호를 이해하도록 돕는 단계입니다.</span>
              <div className={`${css.cl1_part} ${반응형.cl1_part}`}><span className={`${css.cl1_part2} ${반응형.cl1_part2}`}>PART</span><span>4 - 7</span></div>
            </div>

            <div className={`${css.cl1_steps} ${반응형.cl1_steps}`}>
              <div className={`${css.cl1_step} ${반응형.cl1_step}`}>STEP 03</div>
              <p>습관 완성과 문제 행동 교정</p>
              <span>밤중 훈련, 외출 시 배변 관리, 문제 행동 교정 등<br />다양한 상황에서 강아지가 안정적으로 습관을 유지하도록 돕는 단계입니다.</span>
              <div className={`${css.cl1_part} ${반응형.cl1_part}`}><span className={`${css.cl1_part3} ${반응형.cl1_part3}`}>PART</span><span>8 - 10</span></div>
            </div>
          </div>
        </div>

        {/* Class 리스트(아코디언) */}
        <div className={`${css.cl1_class} ${반응형.cl1_class}`}>
          <div className={`${css.cl1_title} ${반응형.cl1_title}`}>
            <span>Class</span>
            <div className={`${css.cl1_titleline} ${반응형.cl1_titleline}`} />
          </div>

          <div className={css.cl1_listbox}>
            {currentLectures.map((lec) => {
              const isActive = activeIndex === lec.id;
              return (
                <div key={lec.id} className={`${css.cl1_accordionWrapper} ${isActive ? css.activeWrapper : ""}`}>
                  {/* 헤더 */}
                  <div className={`${css.cl1_list1} ${isActive ? css.active : ""}`} onClick={() => toggleAccordion(lec.id)}>
                    <span>{lec.title.replace(/^\d+강\. /, `${lec.id}강.`)}</span>
                    <svg className={css.arrowIcon} viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m6 9l6 6l6-6" />
                    </svg>
                  </div>

                  {/* 내용 */}
                  <div
                    ref={(el) => (contentRefs.current[lec.id] = el)}
                    className={`${css.cl1_thumbnailbox} ${반응형.cl1_thumbnailbox} ${isActive ? css.active : ""}`}
                    onClick={() => openModal(lec)}
                  >
                    <div className={`${css.cl1_video} ${반응형.cl1_video}`}>
                      <img src={lec.img} alt={lec.title} />
                    </div>
                    <span className={`${css.cl1_lectureShortsub} ${반응형.cl1_cl1_lectureShortsub}`}>
                      {lec.shortsub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          <div className={`${css.cl1_pagenationbox} ${반응형.cl1_pagenationbox}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" cursor="pointer" onClick={goToPrevPage}
              style={{ opacity: currentPage === 1 ? 0.3 : 1, color: currentPage === 2 ? "#2b2b2b" : "inherit" }}>
              <path fill="currentColor" fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
            <span>{currentPage} / {totalPages}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" cursor="pointer" onClick={goToNextPage}
              style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}>
              <path fill="currentColor" fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
            </svg>
          </div>
        </div>

        {/* 리뷰 작성 */}
        <div ref={reviewSectionRef} className={`${css.cl1_review} ${반응형.cl1_review}`}>
          <div className={`${css.cl1_title} ${반응형.cl1_title}`}>
            <span>Review</span>
            <div className={`${css.cl1_titleline} ${반응형.cl1_titleline}`} />
          </div>

          <div className={`${css.cl1_uploadbox} ${반응형.cl1_uploadbox}`}>
            <div className={`${css.cl1_user} ${반응형.cl1_user}`} />
            <form className={`${css.cl1_writebox} ${반응형.cl1_writebox}`} onSubmit={(e) => e.preventDefault()}>
              <p>Review</p>
              <textarea
                className={`${css.cl1_text} ${반응형.cl1_text}`}
                placeholder="내용을 입력해주세요."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                style={{ resize: "none" }}
              />
              <div className={`${css.cl1_star} ${반응형.cl1_star}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                    style={{ color: (hover || rating) >= star ? "#F39535" : "#ccc" }}>
                    ★
                  </span>
                ))}
              </div>
              <div className={`${css.cl1_file} ${반응형.cl1_file}`}>
                <div className={`${css.cl1_filebg} ${반응형.cl1_filebg}`}>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setReviewImg(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <button type="button" onClick={handleAddReview} style={{ marginTop: 20 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="30">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="m112 244l144-144l144 144M256 120v292" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* 리뷰 리스트 */}
          <div className={`${css.cl1_review} ${반응형.cl1_review}`}>
            <div className={`${css.cl1_review_list} ${반응형.cl1_review_list}`}>
              {currentReviews.map((review, idx) =>
                idx % 2 === 0 ? (
                  <div key={review.id} className={`${css.cl1_otherrv1} ${반응형.cl1_otherrv1}`}>
                    <div className={`${css.cl1_ortextbox} ${반응형.cl1_ortextbox}`}>
                      <div className={`${css.cl1_orrt} ${반응형.cl1_orrt}`}>
                        <div className={`${css.cl1_liststar} ${반응형.cl1_liststar}`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: review.rating >= star ? "#F39535" : "#ccc", fontSize: 30 }}>★</span>
                          ))}
                        </div>
                        <p>{review.text}</p>
                        <div>
                          <img className={`${css.cl1_listimg} ${반응형.cl1_listimg}`} src={review.userImg} alt="ri" />
                        </div>

                        {currentUser?.id === review.userId && (
                          <div className={`${css.cl1_editbtns} ${반응형.cl1_editbtns}`}>
                            <button type="button" onClick={() => handleEditReview(review)}>수정</button>
                            <button type="button" onClick={() => handleDeleteReview(review)}>삭제</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`${css.cl1_user} ${반응형.cl1_user}`} />
                  </div>
                ) : (
                  <div key={review.id} className={`${css.cl1_otherrv2} ${반응형.cl1_otherrv2}`}>
                    <div className={`${css.cl1_user} ${반응형.cl1_user}`} />
                    <div className={`${css.cl1_ortextbox} ${반응형.cl1_ortextbox}`}>
                      <div className={`${css.cl1_orrt} ${반응형.cl1_orrt}`}>
                        <div><img className={`${css.cl1_listimg2} ${반응형.cl1_listimg2}`} src={review.userImg} alt="ri" /></div>
                        <p>{review.text}</p>
                        <div className={`${css.cl1_liststar2} ${반응형.cl1_liststar2}`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: review.rating >= star ? "#F39535" : "#ccc", fontSize: 30 }}>★</span>
                          ))}
                        </div>

                        {currentUser?.id === review.userId && (
                          <div className={`${css.cl1_editbtns2} ${반응형.cl1_editbtns2}`}>
                            <button type="button" onClick={() => handleEditReview(review)}>수정</button>
                            <button type="button" onClick={() => handleDeleteReview(review)}>삭제</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className={`${css.cl1_pagenationbox} ${반응형.cl1_pagenationbox}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                cursor={reviewPage === 1 ? "default" : "pointer"}
                onClick={() => reviewPage > 1 && setReviewPage(reviewPage - 1)}
                style={{ opacity: reviewPage === 1 ? 0.3 : 1, color: "#2b2b2b" }}>
                <path fill="currentColor" fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
              </svg>
              <span>{reviewPage} / {totalReviewPages}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                cursor="pointer"
                onClick={() => setReviewPage((prev) => Math.min(prev + 1, totalReviewPages))}
                style={{ opacity: reviewPage === totalReviewPages ? 0.3 : 1 }}>
                <path fill="currentColor" fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
              </svg>
            </div>
          </div>
        </div>

        {/* 동영상 모달 */}
        {modalOpen && selectedLecture && (
          <div className={`${css.cl1_modal_overlay} ${반응형.cl1_modal_overlay}`} onClick={closeModal}>
            <div className={`${css.cl1_modal} ${반응형.cl1_modal}`} onClick={(e) => e.stopPropagation()}>
              <video
                src={selectedLecture.video}
                title={selectedLecture.title}
                controls
                autoPlay
                onEnded={() => { if (selectedLecture.id === 1) setNewModalOpen(true); }}
              />
              <div className={`${css.cl1_videoinfo} ${반응형.cl1_videoinfo}`}>
                <div className={`${css.cl1_infotext} ${반응형.cl1_infotext}`}>
                  <p>{selectedLecture.title}</p>
                  <span className={`${css.cl1_lecture_desc} ${반응형.cl1_lecture_desc}`}>{selectedLecture.desc}</span>
                </div>
                <div
                  className={`${css.cl1_videodownload} ${반응형.cl1_videodownload}`}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedLecture.video;
                    link.download = `${selectedLecture.title}.mp4`;
                    link.click();
                  }}
                >
                  현재 강의 다운로드
                </div>
                <div className={`${css.cl1_modalbtns} ${반응형.cl1_modalbtns}`}>
                  <button
                    className={`${css.cl1_nextbtn} ${반응형.cl1_nextbtn}`}
                    onClick={() => {
                      // 1) 현재 강의를 완료 처리(+10%)
                      markCurrentLectureCompleted();

                      // 3) 다음 강의 이동
                      const currentIndex = lectures.findIndex(
                        (lec) => lec.id === selectedLecture.id
                      );
                      const nextLecture = lectures[currentIndex + 1];

                      if (nextLecture) {
                        setSelectedLecture(nextLecture);
                      } else {
                        alert("모든 강의를 완료했어요! 🎉");
                      }
                    }}
                  >
                    다음 강의로 이동
                  </button>
                  <button className={`${css.cl1_modal_close} ${반응형.cl1_modal_close}`} onClick={closeModal}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 진행도 질문 모달 */}
        {newModalOpen && (
          <div className={`${css.cl1_new_modal_overlay} ${반응형.cl1_new_modal_overlay}`} onClick={() => setNewModalOpen(false)}>
            <div className={`${css.cl1_new_modal} ${반응형.cl1_new_modal}`} onClick={(e) => e.stopPropagation()}>
              <p>배변 훈련의 몇 단계까지 하셨나요?</p>
              <form>
                <div className={`${css.cl1_lastcheckbox} ${반응형.cl1_lastcheckbox}`}>
                  {[1, 2, 3].map((num) => (
                    <div key={num}>
                      <input type="checkbox" id={`cl1-lastcheck${num}`} checked={selectedStep === num} onChange={() => handleStepChange(num)} />
                      <label htmlFor={`cl1-lastcheck${num}`}>{num}단계</label>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleProgressIncrease}>현재 강의 완료 시 진행도 10% 증가!</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer2 />
    </div>
  );
};

export default Class1;
