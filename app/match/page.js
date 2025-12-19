"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import styles from "./Match.module.css";
import responsive from "./response-Match.module.css";

const questions = [
  {
    question: "Q1. 나는 처음 친구를 사귈 때?",
    options: [
      "특별한 계기가 없으면 시간이 걸리는 편이다.",
      "마음이 가면 적극적으로 친해지려고 한다.",
    ],
  },
  {
    question: "Q2. 새로운 환경에 들어가면 나는?",
    options: [
      "조심스럽게 주변을 살피며 적응하는 편이다.",
      "금방 분위기에 녹아들고 사람들과 쉽게 어울린다.",
    ],
  },
  {
    question: "Q3. 주말에는 주로?",
    options: [
      "집에서 푹 쉬며 에너지 충전!",
      "밖에 나가서 사람들과 어울리고 활동한다!",
    ],
  },
  {
    question: "Q4. 친구와의 약속은?",
    options: [
      "미리 계획을 세워두는 걸 좋아한다.",
      "그때그때 즉흥적으로 정하는 게 좋다.",
    ],
  },
  {
    question: "Q5. 스트레스를 받을 때 나는?",
    options: [
      "혼자 조용히 쉬면서 풀려고 한다.",
      "친구나 가족에게 털어놓으며 푼다.",
    ],
  },
  {
    question: "Q6. 여행을 갈 때 나는?",
    options: [
      "계획표를 꼼꼼히 세우는 편이다.",
      "즉흥적으로 새로운 곳을 탐험하는 걸 즐긴다.",
    ],
  },
  {
    question: "Q7. 새로운 음식을 볼 때 나는?",
    options: [
      "신중하게 후기를 보고 시도한다.",
      "호기심이 생기면 바로 도전한다!",
    ],
  },
  {
    question: "Q8. 평소 운동 습관은?",
    options: ["가끔 생각날 때만 한다.", "꾸준히 몸을 움직이는 걸 좋아한다."],
  },
  {
    question: "Q9. 강아지와 놀 때 나는?",
    options: [
      "조용히 쓰다듬고 함께 쉬는 걸 좋아한다.",
      "공놀이, 산책 등 활발하게 노는 걸 좋아한다.",
    ],
  },
  {
    question: "Q10. 내게 어울리는 강아지는?",
    options: ["차분하고 온순한 성격의 아이", "활발하고 에너지 넘치는 아이"],
  },
];

const dogs = [
  {
    name: "말티즈",
    image: "https://kjwon2025.github.io/gaonimg/img/matchmaltese.jpg",
    percent: 74.2,
    shortInfo: [
      "하얗고 포근한 털을 가진 귀여운 말티즈!",
      "조용하고 온순하며, 사람을 정말 좋아해요.",
      "작지만 용감하고, 가족에게 헌신적이에요.",
    ],
    graphImg: "https://kjwon2025.github.io/gaonimg/img/maltesegraph.png",
    pros: [
      "털이 많이 빠지지 않고, 애교가 많아요.",
      "집에서도 충분히 함께할 수 있는 반려견이에요.",
      "처음 키우는 사람에게도 잘 어울려요.",
    ],
    cons: [
      "짖음이 조금 있을 수 있어 꾸준한 훈련이 필요해요.",
      "분리불안을 겪는 경우가 있으니 함께 있는 시간을 늘려주세요.",
    ],
    adoptionInfo: [
      { title1: "이름: 뽀미", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese1.jpg" },
      { title1: "이름: 모모", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese2.jpg" },
      { title1: "이름: 루루", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese3.jpg" },
      { title1: "이름: 코코", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese4.jpg" },
      { title1: "이름: 토리", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese5.jpg" },
      { title1: "이름: 미미", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese6.jpg" },
      { title1: "이름: 샤샤", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese7.jpg" },
      { title1: "이름: 체리", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rmaltese8.jpg" },
    ]
  },
  {
    name: "웰시코기",
    image: "https://kjwon2025.github.io/gaonimg/img/matchcorgi.png",
    percent: 86.4,
    shortInfo: [
      "웰시코기는 짧은 다리로 엉덩이를 씰룩 거리며 걷는 모습이 매력적입니다.",
      "영리하고 활발해 많은 운동량이 필요해요.",
      "고집은 센 편이지만 사람에게는 다정하고 훈련도 잘 따릅니다.",
    ],
    graphImg: "https://kjwon2025.github.io/gaonimg/img/corgigraph.png",
    pros: [
      "스킨십을 좋아하고 애교도 많은 데다",
      "어린이에 대한 사교성이 특히 좋아요.",
      "무엇보다도 주인에 대한 충성심이 정말 높답니다!",
    ],
    cons: [
      "잦은 털빠짐, 그리고 목양견 특유의",
      "활발함으로 인한 충분한 산책 및",
      "활동량이 필요해요!",
    ],
    adoptionInfo: [
      { title1: "이름: 보리", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi1.jpg" },
      { title1: "이름: 두두", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi2.jpg" },
      { title1: "이름: 별이", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi3.jpg" },
      { title1: "이름: 해피", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi4.jpg" },
      { title1: "이름: 짱구", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi5.jpg" },
      { title1: "이름: 복실", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi6.jpg" },
      { title1: "이름: 무지", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi7.jpg" },
      { title1: "이름: 먼지", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rcorgi8.jpg" },
    ]
  },
  {
    name: "사모예드",
    image: "https://kjwon2025.github.io/gaonimg/img/matchsamoyed.jpg",
    percent: 91.8,
    shortInfo: [
      "눈처럼 하얀 털과 미소 짓는 얼굴, '스마일 독' 사모예드!",
      "사람을 좋아하고, 다정하며, 친화력이 뛰어나요.",
      "활발하지만 온화한 성격으로 가족과 잘 어울려요.",
    ],
    graphImg: "https://kjwon2025.github.io/gaonimg/img/samoyedgraph.png",
    pros: [
      "긍정적이고 명랑한 성격으로 분위기를 좋게 해요.",
      "대형견 중에서도 온순한 편이에요.",
      "함께 있을 때 가장 행복해해요.",
    ],
    cons: [
      "풍성한 털 관리가 어렵고, 털빠짐이 많아요.",
      "꾸준한 운동과 놀이가 꼭 필요해요.",
    ],
    adoptionInfo: [
      { title1: "이름: 루키", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed1.jpg" },
      { title1: "이름: 다솜", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed2.jpg" },
      { title1: "이름: 호두", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed3.jpg" },
      { title1: "이름: 쿠키", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed4.jpg" },
      { title1: "이름: 레오", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed5.jpg" },
      { title1: "이름: 루카", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed6.jpg" },
      { title1: "이름: 벨라", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed7.jpg" },
      { title1: "이름: 시엘", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rsamoyed8.jpg" },
    ]
  },
  {
    name: "리트리버",
    image: "https://kjwon2025.github.io/gaonimg/img/matchretriever.jpg",
    percent: 88.5,
    shortInfo: [
      "착하고 배려심 깊은 리트리버!",
      "사람을 좋아하고, 순종적이며, 배움이 빠른 천사견이에요.",
      "온화하고 가족 중심적인 성격으로 유명하죠.",
    ],
    graphImg: "https://kjwon2025.github.io/gaonimg/img/retrievergraph.png",
    pros: [
      "훈련이 쉽고, 아이들과도 잘 지내요.",
      "성격이 차분하고 인내심이 많아요.",
      "사회성이 뛰어나 여러 사람과 잘 어울려요.",
    ],
    cons: [
      "운동량이 많아 충분한 산책이 필요해요.",
      "외로움을 많이 타서 혼자 오래 두면 힘들어해요.",
    ],
    adoptionInfo: [
      { title1: "이름: 티모", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever1.jpg" },
      { title1: "이름: 제트", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever2.jpg" },
      { title1: "이름: 블루", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever3.jpg" },
      { title1: "이름: 미로", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever4.jpg" },
      { title1: "이름: 나비", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever5.jpg" },
      { title1: "이름: 아론", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever6.jpg" },
      { title1: "이름: 솜이", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever7.jpg" },
      { title1: "이름: 몽실", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rretriever8.jpg" },
    ]
  },
  {
    name: "브로콜리",
    image: "https://kjwon2025.github.io/gaonimg/img/matchbordercollie.jpg",
    percent: 95.3,
    shortInfo: [
      "세계에서 가장 똑똑한 견종, 브로콜리!",
      "에너지가 넘치고, 주인에게 충성심이 강해요.",
      "활동적인 사람과 찰떡궁합이에요.",
    ],
    graphImg: "https://kjwon2025.github.io/gaonimg/img/bordercolliegraph.png",
    pros: [
      "지능이 높고 학습 능력이 뛰어나요.",
      "스포츠나 액티비티를 함께 즐기기 좋아요.",
      "매우 충성스럽고 몰입도가 높아요.",
    ],
    cons: [
      "끊임없는 자극과 운동이 필요해요.",
      "지루하면 스트레스를 받을 수 있어요.",
    ],
    adoptionInfo: [
      { title1: "이름: 냠냠", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder1.jpg" },
      { title1: "이름: 파니", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder2.jpg" },
      { title1: "이름: 핑키", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder3.jpg" },
      { title1: "이름: 쪼꼬", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder4.jpg" },
      { title1: "이름: 무무", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder5.jpg" },
      { title1: "이름: 하니", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder6.jpg" },
      { title1: "이름: 보송", title2: "성별: 여", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder7.jpg" },
      { title1: "이름: 퐁이", title2: "성별: 남", title3: "연락처: 000-0000-0000", img: "https://kjwon2025.github.io/gaonimg/img/rborder8.jpg" },
    ]
  },
];

// ✅ [추가] 카드 정보 파싱 + 이동 함수들
function parseName(title1 = "") {
  // "이름: 뽀미" -> "뽀미"
  const m = title1.match(/이름\s*:\s*(.+)/);
  return m ? m[1].trim() : "";
}
function parseGender(title2 = "") {
  // "성별: 남" -> "남"
  const m = title2.match(/성별\s*:\s*(.+)/);
  return m ? m[1].trim() : "";
}
function parsePhone(title3 = "") {
  // "연락처: 000-0000-0000" -> "000-0000-0000"
  const m = title3.match(/연락처\s*:\s*([\d-]+)/);
  return m ? m[1].trim() : "";
}

export default function Match() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [firstSelectCount, setFirstSelectCount] = useState(0);
  const [selectedDog, setSelectedDog] = useState(null);
  const resultRef = useRef(null);
  const [adoptionPage, setAdoptionPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const router = useRouter();

  const goApply = (card) => {
    const payload = {
      org: `${selectedDog?.name || "가온 협력"} 보호소`,
      phone: parsePhone(card.title3) || "000-0000-0000",
      name: parseName(card.title1) || "이름미상",
      gender: parseGender(card.title2) || "정보없음",
      image: card.img || "/img/placeholder-dog.jpg",
      // 선택사항: 품종/매칭결과 같이 넘기고 싶으면 여기에 추가
      breed: selectedDog?.name || "",
    };
    try {
      localStorage.setItem("gaon_adopt_pet", JSON.stringify(payload));
    } catch (e) {
      console.warn("로컬스토리지 저장 실패:", e);
    }
    router.push("/AdoptApply");
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1099 && width <= 1499) setCardsPerPage(3); // 중간 화면
      else if (width >= 375 && width <= 869) setCardsPerPage(2); // 작은 화면
      else setCardsPerPage(4); // 큰 화면 기본
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = () => setShowIntro(false);

  const handleOptionClick = (optionIdx) => {
    let newFirstSelectCount = firstSelectCount;
    if (optionIdx === 0) newFirstSelectCount += 1;

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      if (optionIdx === 0) setFirstSelectCount(newFirstSelectCount);
    } else {
      let dogResult;
      if (newFirstSelectCount >= 9) dogResult = dogs[0];
      else if (newFirstSelectCount >= 7) dogResult = dogs[1];
      else if (newFirstSelectCount >= 5) dogResult = dogs[2];
      else if (newFirstSelectCount >= 2) dogResult = dogs[3];
      else dogResult = dogs[4];

      setSelectedDog(dogResult);
      setShowFinal(true);
    }
  };

  const handleArrowClick = () => {
    setShowResult(true);
    setTimeout(() => {
      if (resultRef.current) {
        const resultElement = resultRef.current;
        const elementTop =
          resultElement.getBoundingClientRect().top + window.scrollY;
        const paddingTop = parseInt(getComputedStyle(resultElement).paddingTop);
        window.scrollTo({ top: elementTop + paddingTop, behavior: "smooth" });
      }
    }, 300);
  };

  const handleNextPage = () => {
    if (!selectedDog) return;
    const maxPage = Math.ceil(selectedDog.adoptionInfo.length / cardsPerPage) - 1;
    setAdoptionPage((prev) => Math.min(prev + 1, maxPage));
  };

  const handlePrevPage = () => {
    setAdoptionPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={`${styles.wrapMT} ${responsive.wrapMT}`}>
      <Header2 />

      {showIntro && (
        <div className={`${styles.introMT} ${responsive.introMT}`}>
          <img src="https://kjwon2025.github.io/gaonimg/img/matchimg.png" alt="matchimg" />
          <span>나에게 맞는 강아지 찾기</span>
          <div
            className={`${styles.startMT} ${responsive.startMT}`}
            onClick={handleStart}
          >
            시작하기
          </div>
        </div>
      )}

      {!showIntro && !showFinal && (
        <div className={`${styles.qstMT} ${responsive.qstMT}`}>
          <div className={`${styles.qstcontainerMT} ${responsive.qstcontainerMT}`}>
            <span>
              질문 {currentQ + 1} / {questions.length}
            </span>
            <div className={`${styles.grayboxMT} ${responsive.grayboxMT}`}>
              <div
                className={`${styles.orangeboxMT} ${responsive.orangeboxMT}`}
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p>{questions[currentQ].question}</p>
            <div className={`${styles.selectboxMT} ${responsive.selectboxMT}`}>
              {questions[currentQ].options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`${styles[`option${idx + 1}MT`]} ${responsive[`option${idx + 1}MT`]
                    }`}
                  onClick={() => handleOptionClick(idx)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFinal && selectedDog && (
        <div className={`${styles.finalMT} ${responsive.finalMT}`}>
          <p className={`${styles.finalText} ${responsive.finalText}`}>
            강아지가 꼬리치며 반기고있어요 !
          </p>
          <img
            className={`${styles.downarrowMT} ${responsive.downarrowMT}`}
            src="https://kjwon2025.github.io/gaonimg/img/matchdownarrow.png"
            alt="down"
            onClick={handleArrowClick}
          />
          <div className={`${styles.spaceboxMT} ${responsive.spaceboxMT}`}></div>

          <div
            ref={resultRef}
            className={`${styles.resultMT} ${responsive.resultMT}`}
            style={{
              height: showResult ? "1764px" : "0px",
              transition: "height 0.6s ease",
            }}
          >
            <p className={`${styles.resulttitleMT} ${responsive.resulttitleMT}`}>
              나와 맞는 강아지는
              <br />
              <span>{selectedDog.name}</span>
            </p>
            <img src={selectedDog.image} alt={selectedDog.name} />
            <p className={`${styles.percentMT} ${responsive.percentMT}`}>
              <span className={`${styles.boldMT} ${responsive.boldMT}`}>
                {selectedDog.name}
              </span>{" "}
              의 추천지수{" "}
              <span className={`${styles.boldMT} ${responsive.boldMT}`}>
                {selectedDog.percent}%
              </span>{" "}
              입니다 !
            </p>
            <p className={`${styles.shortinfoMT} ${responsive.shortinfoMT}`}>
              {selectedDog.shortInfo.map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <div className={`${styles.maininfoMT} ${responsive.maininfoMT}`}>
              <div className={`${styles.graphMT} ${responsive.graphMT}`}>
                <span className={`${styles.g1MT} ${responsive.g1MT}`}>사회성</span>
                <div className={`${styles.gboxMT} ${responsive.gboxMT}`}>
                  <span className={`${styles.g2MT} ${responsive.g2MT}`}>예민성</span>
                  <img
                    src={selectedDog.graphImg}
                    alt={`${selectedDog.name} graph`}
                  />
                  <span className={`${styles.g3MT} ${responsive.g3MT}`}>활동성</span>
                </div>
                <span className={`${styles.g4MT} ${responsive.g4MT}`}>독립성</span>
              </div>
              <div className={`${styles.pnboxMT} ${responsive.pnboxMT}`}>
                <div className={`${styles.pMT} ${responsive.pMT}`}>
                  <p>장점</p>
                  <span>
                    {selectedDog.pros.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </span>
                </div>
                <div className={`${styles.nMT} ${responsive.nMT}`}>
                  <p>단점</p>
                  <span>
                    {selectedDog.cons.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showResult && (
            <div className={`${styles.doginfoMT} ${responsive.doginfoMT}`}>
              <div className={`${styles.dititleMT} ${responsive.dititleMT}`}>
                <div className={`${styles.tsboxMT} ${responsive.tsboxMT}`}>
                  <span>{selectedDog.name}</span>
                  <span>입양정보</span>
                </div>
                <div className={`${styles.titlelineMT} ${responsive.titlelineMT}`}></div>
                <div className={`${styles.titledotMT} ${responsive.titledotMT}`}></div>
              </div>

              <div className={`${styles.infocardboxMT} ${responsive.infocardboxMT}`}>
                {selectedDog.adoptionInfo
                  .slice(adoptionPage * cardsPerPage, (adoptionPage + 1) * cardsPerPage)
                  .map((card, i) => (
                    <div key={i} onClick={() => goApply(card)}
                      className={`${styles.cardimgMT} ${responsive.cardimgMT}`}>
                      <img
                        src={card.img}
                        alt={card.title1}
                        style={{ width: "100%", height: "77%", borderRadius: "20px" }}
                      />
                      <div className={`${styles.cardinfoMT} ${responsive.cardinfoMT}`}>
                        <p>
                          {card.title1 && <>{card.title1}<br /></>}
                          {card.title2 && <>{card.title2}<br /></>}
                          {card.title3 && <>{card.title3}</>}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className={`${styles.pagenationMT} ${responsive.pagenationMT}`}>
                {/* 이전 페이지 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  cursor={adoptionPage === 0 ? "default" : "pointer"}
                  onClick={handlePrevPage}
                  style={{ fill: adoptionPage === 0 ? "#ccc" : "#000" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                  />
                </svg>

                {/* 현재 페이지 / 총 페이지 */}
                <span>
                  {adoptionPage + 1} / {Math.ceil(selectedDog.adoptionInfo.length / cardsPerPage)}
                </span>

                {/* 다음 페이지 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  cursor={adoptionPage === Math.ceil(selectedDog.adoptionInfo.length / cardsPerPage) - 1 ? "default" : "pointer"}
                  onClick={handleNextPage}
                  style={{ fill: adoptionPage === Math.ceil(selectedDog.adoptionInfo.length / cardsPerPage) - 1 ? "#ccc" : "#000" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      <Footer2 />
    </div>
  );

}