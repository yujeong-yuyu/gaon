/* 메인 버튼들 섹션 */
// 📁 src/data/Category1_info.js

export const categories = [
  {
    id: 1,
    name: "발달 단계별",
    content: `
      각 시기 맞춤 교육은 강아지의 건강한 습관 형성을 이끌어줍니다.<br/><br/>
      <span class="highlight-1">가온</span>에서 언제, 어디서나<br/>
      전문 트레이너에게 배우고 바로 실천하세요.<br/><br/>
      보호자의 배움이 강아지의 평생 행복을 만듭니다.
    `,
    img: "https://kjwon2025.github.io/gaonimg/img/category-m1.png",
    btnText: "4주 완성 퍼피 기초 교육 수강하러 가기",
  },
  {
    id: 2,
    name: "기본 훈련",
    content: `
      기본 훈련은 모든 교육의 시작입니다.<br/><br/>
      ‘앉아’, ‘기다려’, ‘하우스’와 같은 기본 명령어는<br/>
      반려견의 안전과 보호자와의 교감을 위해 꼭 필요하죠.<br/><br/>
      <span class="highlight-1">가온</span>과 함께 올바른 훈련 습관을 만들어보세요.
    `,
    mobileContent: `
      기본 훈련은 모든 교육의 시작입니다.<br/><br/>
      ‘앉아’, ‘기다려’, ‘하우스’ 같은 기본 명령어는<br/>
      반려견의 안전과 교감을 위해 꼭 필요하죠.<br/><br/>
      <span class="highlight-1">가온</span>과 함께<br/>
      올바른 훈련 습관을 만들어보세요.
    `,
    img: "https://kjwon2025.github.io/gaonimg/img/category-m2.png",
    btnText: "기본 훈련 커리큘럼 바로 보기",
  },
  {
    id: 3,
    name: "행동교정",
    content: `
      짖음, 물기, 분리불안 등은 단순한 문제행동이 아니라<br/>
      반려견의 ‘신호’입니다.<br/><br/>
      <span class="highlight-1">가온</span>에서는 원인을 이해하고<br/>
      행동을 교정하는 실질적인 방법을 배울 수 있습니다.<br/><br/>
      올바른 교정으로 서로에게 편안한 일상을 만들어주세요.
    `,
    mobileContent: `
      짖음, 물기, 분리불안 등은<br/>
      단순한 문제행동이 아니라 반려견의 ‘신호’입니다.<br/><br/>
      <span class="highlight-1">가온</span>에서는 원인을 이해하고<br/>
      행동을 교정하는 실질적인 방법을 배울 수 있습니다.<br/><br/>
      올바른 교정으로<br/>
      서로에게 편안한 일상을 만들어주세요.
    `,
    img: "https://kjwon2025.github.io/gaonimg/img/category-m3.png",
    btnText: "행동교정 전문 강의 보러가기",
  },
  {
    id: 4,
    name: "건강&케어",
    content: `
      반려견의 건강은 꾸준한 관리에서 시작됩니다.<br/><br/>
      목욕, 그루밍, 치아 관리까지
      매일 실천할 수 있는 케어 방법을 배워보세요.<br/><br/>
      <span class="highlight-1">가온</span>이 알려주는 케어 루틴으로<br/>
      반려견의 컨디션을 항상 최상으로 유지하세요.
    `,
    mobileContent: `
      반려견의 건강은 꾸준한 관리에서 시작됩니다.<br/><br/>
      목욕, 그루밍, 치아 관리까지<br/>
      매일 실천할 수 있는 케어 방법을 배워보세요.<br/><br/>
      <span class="highlight-1">가온</span>이 알려주는 케어 루틴으로<br/>
      반려견의 컨디션을<br/>
      항상 최상으로 유지하세요.
    `,
    img: "https://kjwon2025.github.io/gaonimg/img/category-m4.png",
    btnText: "건강 & 케어 클래스 바로가기",
  },
];


/* 카드 섹션(카테고리) */
export const allCourses = {
  popular: [
    { id: 1, title: "반려동물 배변훈련", img: "https://kjwon2025.github.io/gaonimg/img/category-pA.jpg", price: 85000 },
    { id: 2, title: "사회화 훈련", img: "https://kjwon2025.github.io/gaonimg/img/category-pB.jpg", price: 90000 },
    { id: 3, title: "반려견과의 첫 훈련 시작하기", img: "https://kjwon2025.github.io/gaonimg/img/category-pC.jpg", price: 95000 },
    { id: 4, title: "산책 매너 훈련", img: "https://kjwon2025.github.io/gaonimg/img/category-pD.jpg", price: 100000 },
  ],
  basic: [
    { id: 5, title: "기본 복종 훈련", img: "https://kjwon2025.github.io/gaonimg/img/category-p1.jpg", price: 75000 },
    { id: 6, title: "집안 훈련 루틴", img: "https://kjwon2025.github.io/gaonimg/img/category-p2.jpg", price: 80000 },
    { id: 7, title: "간식으로 유도하기", img: "https://kjwon2025.github.io/gaonimg/img/category-p3.jpg", price: 70000 },
    { id: 8, title: "손짓으로 명령하기", img: "https://kjwon2025.github.io/gaonimg/img/category-p4.jpg", price: 85000 },
  ],
  senior: [
    { id: 9, title: "은퇴견 생활 적응 ", img: "https://kjwon2025.github.io/gaonimg/img/category-p5.jpg", price: 95000 },
    { id: 10, title: "관절 관리 루틴", img: "https://kjwon2025.github.io/gaonimg/img/category-p6.jpg", price: 90000 },
    { id: 11, title: "식습관 교정", img: "https://kjwon2025.github.io/gaonimg/img/category-p7.jpg", price: 85000 },
    { id: 12, title: "노견 스트레칭", img: "https://kjwon2025.github.io/gaonimg/img/category-p8.jpg", price: 75000 },
  ],
  health: [
    { id: 13, title: "매일 5분 건강체크", img: "https://kjwon2025.github.io/gaonimg/img/category-p9.jpg", price: 65000 },
    { id: 14, title: "치아 관리 교육", img: "https://kjwon2025.github.io/gaonimg/img/category-p10.jpg", price: 60000 },
    { id: 15, title: "목욕&그루밍", img: "https://kjwon2025.github.io/gaonimg/img/category-p11.jpg", price: 95000 },
    { id: 16, title: "귀청소&발관리", img: "https://kjwon2025.github.io/gaonimg/img/category-p12.jpg", price: 70000 },
  ],
  adult: [
    { id: 17, title: "성견 집중력 강화", img: "https://kjwon2025.github.io/gaonimg/img/category-p13.jpg", price: 100000 },
    { id: 18, title: "분리불안 완화 프로그램", img: "https://kjwon2025.github.io/gaonimg/img/category-p14.jpg", price: 115000 },
    { id: 19, title: "낯선 환경 적응", img: "https://kjwon2025.github.io/gaonimg/img/category-p15.jpg", price: 90000 },
    { id: 20, title: "안정적 사회화 교육", img: "https://kjwon2025.github.io/gaonimg/img/category-p16.jpg", price: 85000 },
  ],
  puppy: [
    { id: 21, title: "배변 훈련 마스터", img: "https://kjwon2025.github.io/gaonimg/img/category-p17.jpg", price: 95000 },
    { id: 22, title: "기본 생활 습관", img: "https://kjwon2025.github.io/gaonimg/img/category-p18.jpg", price: 80000 },
    { id: 23, title: "칭찬 중심 훈련", img: "https://kjwon2025.github.io/gaonimg/img/category-p19.jpg", price: 75000 },
    { id: 24, title: "처음 만나는 보호자 교육", img: "https://kjwon2025.github.io/gaonimg/img/category-p20.jpg", price: 70000 },
  ],
  behavior: [
    { id: 25, title: "짖음 멈추기", img: "https://kjwon2025.github.io/gaonimg/img/category-p21.jpg", price: 120000 },
    { id: 26, title: "물기 교정", img: "https://kjwon2025.github.io/gaonimg/img/category-p22.jpg", price: 110000 },
    { id: 27, title: "가구 물어뜯기 방지", img: "https://kjwon2025.github.io/gaonimg/img/category-p23.jpg", price: 95000 },
    { id: 28, title: "산책 시 공격성 완화", img: "https://kjwon2025.github.io/gaonimg/img/category-p24.jpg", price: 85000 },
  ],
};
