// app/category2/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";
import Image from "next/image";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import { allCourses2, categories2 } from "@/data/Category2_data";
import styles from "@/styles/p-css/Category2.module.css";

// ✅ 개별 강의 카드 컴포넌트
const CourseCard = ({ course, tags = [], onClick, onAddToCart }) => (
  <div className={styles["course2-card"]}
    onClick={() => onClick?.(course)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" ? onClick?.(course) : null)}>
    <Image
      src={course.img}
      alt={course.title}
      width={400}
      height={230}
      className={styles["course2-img"]}
    />
    <button
      type="button"
      aria-label="장바구니 담기"
      className={styles["course-cart-fab"]}
      onClick={(e) => {
        e.stopPropagation();
        onAddToCart?.(course);
      }}
    >
      <AiOutlineShopping />
    </button>
    <div className={styles["course2-content"]}>
      <div className={styles["course2-tags"]}>
        {tags.map((tag, i) => (
          <span key={i} className={`${styles["course2-tag"]} font-thin`}>
            {tag}
          </span>
        ))}
      </div>
      <p className={styles["course2-title"]}>{course.title}</p>
    </div>
    <button className={styles["course2-btn"]}>수강신청</button>
  </div >
);

// ✅ 태그 랜덤 생성
function getRandomTags(tagPool, count = 2) {
  const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ 메인 페이지
export default function Category2Page() {
  const [activeCategory, setActiveCategory] = useState(categories2[0]);
  const [query, setQuery] = useState("");
  const [courseTags, setCourseTags] = useState({});
  const [forceNoResult, setForceNoResult] = useState(false);

  const tagPools2 = {
    popular: ["자격과정", "인기", "추천"],
    basic: ["훈련사", "기초과정", "반려동물교육"],
    senior: ["펫미용", "실무", "전문과정"],
    health: ["건강관리", "영양", "케어"],
    adult: ["심리상담", "소통", "이론과실습"],
    puppy: ["액티비티", "지도사", "현장실습"],
    behavior: ["자격검정", "시험대비", "집중반"],
    search: ["검색결과", "추천", "베스트"],
  };

  // 🛒 장바구니에 담기 함수
  const handleAddToCart = (course) => {
    const CART_KEY = "gaon_cart";
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];

      // 이미 존재하는 항목인지 확인
      const idx = cart.findIndex((item) => item.id === course.id);
      if (idx >= 0) {
        alert("이미 장바구니에 담긴 강의입니다.");
        return;
      }

      // 새 강의 추가
      const newItem = {
        id: course.id,
        title: course.title,
        img: course.img,
        price: course.price ?? 100000, // 가격 없으면 기본값
        thumb: course.img || course.thumb || "/img/noimage.png", // 이미지 연결
        qty: 1,
      };

      const updatedCart = [...cart, newItem];
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

      alert(`🛒 '${course.title}'이(가) 장바구니에 담겼습니다.`);
    } catch (err) {
      console.error("장바구니 저장 실패:", err);
      alert("장바구니 담기에 실패했습니다.");
    }
  };


  useEffect(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("courseTags2");
    if (saved) {
      setCourseTags(JSON.parse(saved));
    } else {
      const tagMap = {};
      Object.entries(allCourses2).forEach(([key, courses]) => {
        tagMap[key] = courses.map(() => getRandomTags(tagPools2[key], 2));
      });
      localStorage.setItem("courseTags2", JSON.stringify(tagMap));
      setCourseTags(tagMap);
    }
  }, []);

  const allCourseArray = Object.values(allCourses2).flat();
  const filteredCourses = allCourseArray.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );
  const showSearchResults = query.trim().length > 0;

  const sectionTitles = {
    popular: "인기 교육 과정",
    basic: "기본 훈련",
    senior: "발달 단계별 교육 > 노견 케어",
    health: "건강&케어",
    adult: "발달 단계별 교육 > 성견 교육",
    puppy: "발달 단계별 교육 > 퍼피 교육",
    behavior: "문제행동 교정",
  };

  return (
    <div className={styles["category2-allbox"]}>
      <Header2 />

      <div className={styles["category2-wrapper"]}>
        <div className={styles["category2-inner1300"]}>
          {/* ✅ 태블릿/모바일용 제목 + 버튼 묶음 */}
          <div className={styles["category2-header-T"]}>
            <h2 className={styles["category2-title"]}>자격증 교육</h2>
            <div className={styles["category2-buttons-T"]}>
              {categories2.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles["category2-btn"]} ${activeCategory.id === cat.id ? styles["active"] : ""
                    }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ PC용 타이틀 */}
          <h2 className={styles["category2-title"]}>자격증 교육</h2>

          {/* ✅ 상단 (이미지 + 설명 + 버튼) */}
          <div className={styles["category2-top"]}>
            {/* 왼쪽 이미지 */}
            <div className={styles["category2-left"]}>
              <Image
                src={activeCategory.img}
                alt={activeCategory.name}
                width={600}
                height={400}
                className={styles["category2-main-img"]}
              />
            </div>

            {/* 오른쪽 내용 */}
            <div className={styles["category2-right"]}>
              {/* ✅ PC용 버튼 */}
              <div className={styles["category2-buttons"]}>
                {categories2.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${styles["category2-btn"]} ${activeCategory.id === cat.id ? styles["active"] : ""
                      }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* 설명 */}
              <div className={styles["category2-desc"]}>
                <Image
                  src="https://kjwon2025.github.io/gaonimg/img/category2-left.png"
                  alt="왼쪽 따옴표"
                  width={45}
                  height={45}
                  className={`${styles["quote2-mark-img"]} ${styles["left"]}`}
                />
                <p
                  className="leading2-relaxed"
                  dangerouslySetInnerHTML={{ __html: activeCategory.content }}
                />
                <Image
                  src="https://kjwon2025.github.io/gaonimg/img/category2-right.png"
                  alt="오른쪽 따옴표"
                  width={45}
                  height={45}
                  className={`${styles["quote2-mark-img"]} ${styles["right"]}`}
                />
              </div>

              {/* 학습 버튼 */}
              <button className={styles["category2-learn-btn"]}>
                {activeCategory.btnText}
                <Image src="/img/category2-arrow.png" alt="arrow" width={20} height={20} />
              </button>
            </div>
          </div>

          {/* ✅ 검색창 */}
          <div className={styles["category2-search"]}>
            <input
              type="text"
              placeholder="가온 회원만을 위한 자격증 교육 과정을 검색해보세요."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setForceNoResult(false);
              }}
            />
            <FiSearch
              className={styles["search2-icon"]}
              onClick={() => {
                if (query.trim() === "") setForceNoResult(true);
                else setForceNoResult(false);
              }}
            />
          </div>

          {/* ✅ 검색 결과 */}
          {(showSearchResults || forceNoResult) && (
            <div className={styles["search2-results"]}>
              <div className={styles["section2-header"]}>
                <h3>검색 결과</h3>
              </div>

              {filteredCourses.length > 0 && !forceNoResult ? (
                <div className={styles["category2-cards"]}>
                  {filteredCourses.slice(0, 4).map((course) => {
                    const categoryKey = Object.keys(allCourses2).find((key) =>
                      allCourses2[key].some((c) => c.id === course.id)
                    );
                    const courseIndex = allCourses2[categoryKey].findIndex(
                      (c) => c.id === course.id
                    );
                    const tags = courseTags[categoryKey]?.[courseIndex] || [];
                    return <CourseCard key={course.id} course={course} tags={tags} />;
                  })}
                </div>
              ) : (
                <p className={styles["no2-results"]}>해당하는 강의가 없습니다.</p>
              )}

            </div>
          )}

          {/* ✅ 카테고리 섹션별 */}
          {Object.entries(allCourses2).map(([key, courseList], i) => {
            if (key === "search") return null;

            return (
              <React.Fragment key={key}>
                <div className={styles["category2-section"]}>
                  <div className={styles["section2-header"]}>
                    <h3>{sectionTitles[key]}</h3>
                  </div>
                  <div className={styles["category2-cards"]}>
                    {courseList.map((course, idx) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        tags={courseTags[key]?.[idx] || []}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>

                {/* ✅ 섹션 중간에 배너 삽입 */}
                {i === 1 && (
                  <div className={styles["category2-banner1"]}>
                    <Image
                      src="/img/category2-banner1.png"
                      alt="자격증 교육 배너 1"
                      width={1300}
                      height={400}
                      className={styles["category2-banner-img"]}
                    />
                  </div>
                )}
                {i === 3 && (
                  <div className={styles["category2-banner1"]}>
                    <Image
                      src="/img/category2-banner2.png"
                      alt="자격증 교육 배너 2"
                      width={1300}
                      height={400}
                      className={styles["category2-banner-img"]}
                    />
                  </div>
                )}
                {i === 5 && (
                  <div className={styles["category2-banner1"]}>
                    <Image
                      src="/img/category2-banner3.png"
                      alt="보호자 교육 배너 3"
                      width={1300}
                      height={400}
                      className={styles["category2-banner-img"]}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Footer2 />
    </div>
  );
}
