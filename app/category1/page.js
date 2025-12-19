"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";
import Image from "next/image";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import { allCourses, categories } from "@/data/Category1_data";
import styles from "@/styles/p-css/Category1.module.css";

import { useRouter } from "next/navigation";

// ✅ 개별 강의 카드 컴포넌트
const CourseCard = ({ course, tags = [], onClick, onAddToCart }) => (
  <div
    className={styles["course-card"]}
    onClick={() => onClick?.(course)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" ? onClick?.(course) : null)}
  >
    <Image
      src={course.img}
      alt={course.title}
      width={400}
      height={230}
      className={styles["course-img"]}
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
    <div className={styles["course-content"]}>
      <div className={styles["course-tags"]}>
        {tags.map((tag, i) => (
          <span key={i} className={`${styles["course-tag"]} font-thin`}>
            {tag}
          </span>
        ))}
      </div>
      <p className={styles["course-title"]}>{course.title}</p>
    </div>
    <button
      className={styles["course-btn"]}
      onClick={(e) => {
        e.stopPropagation(); // 부모 div 클릭과 중복 방지
        onClick?.(course);
      }}
    >
      수강신청
    </button>
  </div>
);

// ✅ 태그 랜덤 생성
function getRandomTags(tagPool, count = 2) {
  const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Category1Page() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [courseTags, setCourseTags] = useState({});
  const [forceNoResult, setForceNoResult] = useState(false);
  const router = useRouter();

  // 태그 풀 (랜덤 태그를 위한 데이터)
  const tagPools = {
    popular: ["퍼피 교육", "인기", "추천"],
    basic: ["기본 훈련", "보호자 필수", "기초"],
    senior: ["노견 케어", "건강", "힐링"],
    health: ["건강", "영양", "면역력"],
    adult: ["성견 교육", "집중 훈련", "교감"],
    puppy: ["퍼피 교육", "기초", "훈련시작"],
    behavior: ["문제행동", "행동 교정", "집중"],
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

  const handleCourseClick = (course) => {
    if (course.id === 1 || course.title === "반려동물 배변훈련") {
      router.push("/class1"); // ✅ 이 강의만 /class1
    } else {
      // 다른 강의는 그대로 두거나, 원하는 경로가 있으면 여기에 작성
      // router.push(`/class/${course.id}`);
    }
  };

  useEffect(() => {
    const savedTags = localStorage.getItem("courseTags");
    if (savedTags) {
      setCourseTags(JSON.parse(savedTags));
    } else {
      const tagMap = {};
      Object.entries(allCourses).forEach(([key, courses]) => {
        tagMap[key] = courses.map(() => getRandomTags(tagPools[key], 2));
      });
      localStorage.setItem("courseTags", JSON.stringify(tagMap));
      setCourseTags(tagMap);
    }

    // sessionStorage에서 'searchQuery' 값을 가져와서 검색어 상태 설정
    const storedQuery = sessionStorage.getItem("searchQuery");
    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  const allCourseArray = Object.values(allCourses).flat();

  // ✅ 검색어에 따라 필터링 규칙 적용
  const filteredCourses = (() => {
    const query = searchQuery.trim().toLowerCase();

    // ✅ "1~2개월" 검색 시 → id 1, 3, 5, 6 표시
    if (
      query.includes("1~2개월") ||
      query.includes("1-2개월") ||
      query.includes("1~2달")
    ) {
      const targetIds = [1, 3, 5, 6];
      return allCourseArray.filter((c) => targetIds.includes(c.id));
    }

    // ✅ "노견" 검색 시 → id 9, 10, 12, 13 표시
    if (query.includes("노견")) {
      const targetIds = [9, 10, 12, 13];
      return allCourseArray.filter((c) => targetIds.includes(c.id));
    }

    if (query.includes("미용")) {
      const targetIds = [14, 15, 16];
      return allCourseArray.filter((c) => targetIds.includes(c.id));
    }

    // ✅ 일반 검색 (기존 로직)
    return allCourseArray.filter((c) => c.title.toLowerCase().includes(query));
  })();

  const showSearchResults = searchQuery.trim().length > 0;

  const sectionTitles = {
    popular: "인기 교육 과정",
    basic: "기본 훈련",
    senior: "발달 단계별 교육 > 노견 케어",
    health: "건강&케어",
    adult: "발달 단계별 교육 > 성견 교육",
    puppy: "발달 단계별 교육 > 퍼피 교육",
    behavior: "문제행동 교정",
  };

  // 검색어 변경 처리
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setForceNoResult(false);
  };

  // 검색 아이콘 클릭 시 처리
  const handleSearchSubmit = () => {
    if (searchQuery.trim() === "") setForceNoResult(true);
    else setForceNoResult(false);
  };

  return (
    <div className={`${styles["category-allbox"]} ${styles["category1-page"]}`}>
      <Header2 />

      <div className={styles["category-wrapper"]}>
        <div className={styles["category-inner1300"]}>
          {/* ✅ 태블릿/모바일용 제목 + 버튼 묶음 */}
          <div className={styles["category-header-T"]}>
            <h2 className={styles["category-title"]}>보호자 교육</h2>
            <div className={styles["category-buttons-T"]}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles["category-btn"]} ${activeCategory.id === cat.id ? styles["active"] : ""
                    }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ PC용 타이틀 */}
          <h2 className={styles["category-title"]}>보호자 교육</h2>

          {/* ✅ 상단 (이미지 + 설명 + 버튼) */}
          <div className={styles["category-top"]}>
            <div className={styles["category-left"]}>
              <Image
                src={activeCategory.img}
                alt={activeCategory.name}
                width={600}
                height={400}
                className={styles["category-main-img"]}
              />
            </div>

            <div className={styles["category-right"]}>
              {/* 버튼 */}
              <div className={styles["category-buttons"]}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${styles["category-btn"]} ${activeCategory.id === cat.id ? styles["active"] : ""
                      }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* 설명 */}
              <div className={styles["category-desc"]}>
                <Image
                  src="https://kjwon2025.github.io/gaonimg/img/category-left.png"
                  alt="왼쪽 따옴표"
                  width={45}
                  height={45}
                  className={`${styles["quote-mark-img"]} ${styles["left"]}`}
                />
                <p
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: activeCategory.content }}
                />
                <Image
                  src="https://kjwon2025.github.io/gaonimg/img/category-right.png"
                  alt="오른쪽 따옴표"
                  width={45}
                  height={45}
                  className={`${styles["quote-mark-img"]} ${styles["right"]}`}
                />
              </div>

              {/* 학습 버튼 */}
              <button className={styles["category-learn-btn"]}>
                {activeCategory.btnText}
                <Image
                  src="https://kjwon2025.github.io/gaonimg/img/category-arrow.png"
                  alt="arrow"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* ✅ 검색창 */}
          <div className={styles["category-search"]}>
            <input
              type="text"
              placeholder="가온 회원만을 위한 보호자 교육 과정을 검색해보세요."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FiSearch
              className={styles["search-icon"]}
              onClick={handleSearchSubmit}
            />
          </div>

          {/* ✅ 검색 결과 */}
          {(showSearchResults || forceNoResult) && (
            <div className={styles["search-results"]}>
              <div className={styles["section-header"]}>
                <h3>검색 결과</h3>
              </div>

              {filteredCourses.length > 0 && !forceNoResult ? (
                <div className={styles["search-cards"]}>
                  {filteredCourses.slice(0, 4).map((course) => {
                    const categoryKey = Object.keys(allCourses).find((key) =>
                      allCourses[key].some((c) => c.id === course.id)
                    );
                    const courseIndex = allCourses[categoryKey].findIndex(
                      (c) => c.id === course.id
                    );
                    const tags = courseTags[categoryKey]?.[courseIndex] || [];
                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        tags={tags}
                        onClick={handleCourseClick}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className={styles["no-results"]}>
                  해당하는 강의가 없습니다.
                </p>
              )}
            </div>
          )}

          {/* ✅ 카테고리 섹션별 */}
          {Object.entries(allCourses).map(([key, courseList], i) => {
            if (key === "search") return null;

            return (
              <React.Fragment key={key}>
                <div className={styles["category-section"]}>
                  <div className={styles["section-header"]}>
                    <h3>{sectionTitles[key]}</h3>
                  </div>
                  <div className={styles["category-cards"]}>
                    {courseList.map((course, idx) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        tags={courseTags[key]?.[idx] || []}
                        onClick={handleCourseClick}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>

                {/* ✅ 섹션 중간 배너 */}
                {i === 1 && (
                  <div className={styles["category-banner1"]}>
                    <Image
                      src="https://kjwon2025.github.io/gaonimg/img/category-banner1.png"
                      alt="보호자 교육 배너 1"
                      width={1300}
                      height={400}
                      className={styles["category-banner-img"]}
                    />
                  </div>
                )}
                {i === 3 && (
                  <div className={styles["category-banner1"]}>
                    <Image
                      src="https://kjwon2025.github.io/gaonimg/img/category-banner2.png"
                      alt="보호자 교육 배너 2"
                      width={1300}
                      height={400}
                      className={styles["category-banner-img"]}
                    />
                  </div>
                )}
                {i === 5 && (
                  <div className={styles["category-banner1"]}>
                    <Image
                      src="/img/category-banner3.png"
                      alt="보호자 교육 배너 3"
                      width={1300}
                      height={400}
                      className={styles["category-banner-img"]}
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
