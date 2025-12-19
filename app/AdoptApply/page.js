"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import s from "@/styles/p-css/AdoptApply.module.css";
import rs from "@/styles/P-response/response-AdoptApply.module.css";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";

export default function AdoptApplyClient({
  openMenu = () => { },
  pet = {
    org: "아이즈아멍센터",
    phone: "0000-0000",
    name: "코와이네",
    age: "2살",
    gender: "여",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
  },
}) {
  const [photoFront, setPhotoFront] = useState(false);
  const [form, setForm] = useState({
    name: "", phone1: "010", phone2: "", phone3: "",
    email: "", reason: "", plan: "",
    houseType: "아파트", contactTime: "오전(9~12시)",
    agree1: true, agree2: true, agree3: false,
    agree4: false, agree5: false, agree6: false,
  });
  const [petState, setPetState] = useState(pet);
  const petAsideRef = useRef(null);
  const petCardRef = useRef(null);
  const router = useRouter();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s0) => ({ ...s0, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("이름을 입력해주세요.");
    if (!(form.phone2.length >= 3 && form.phone3.length >= 3))
      return alert("전화번호를 올바르게 입력해주세요.");
    if (!form.agree1 || !form.agree2)
      return alert("필수 동의 항목에 체크해주세요.");

    const payload = {
      name: form.name.trim(),
      phone: [form.phone1, form.phone2, form.phone3].join("-"),
      email: form.email.trim(),
      reason: form.reason.trim(),
      plan: form.plan.trim(),
      houseType: form.houseType,
      contactTime: form.contactTime,
      agreements: {
        legal: form.agree1, care: form.agree2, sharePhoto: form.agree3,
        personalInfo: form.agree4, platformNotice: form.agree5,
        neglectResponsibility: form.agree6,
      },
      pet: { ...pet },
      submittedAt: new Date().toISOString(),
    };
    console.log("폼 제출 데이터:", payload);
    alert("제출되었습니다.");
    router.replace("/");
  };
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gaon_adopt_pet");
      if (!raw) return;
      const saved = JSON.parse(raw);
      // 기본값 유지 + 저장된 값 덮어쓰기
      setPetState((prev) => ({
        age: prev.age || "정보없음",
        ...prev,
        ...saved,
      }));
      // 1회성이라면 아래 주석 해제
      // localStorage.removeItem("gaon_adopt_pet");
    } catch (e) {
      console.warn("adopt pet 로딩 실패:", e);
    }
  }, []);

  useEffect(() => {
    const aside = petAsideRef.current, card = petCardRef.current;
    if (!aside || !card) return;
    const grid = aside.closest(`.${s["aa-grid"]}`) || aside.closest(".aa-grid");
    const mq = window.matchMedia("(min-width: 769px)");
    const TOP_GAP = 80;
    let startY = 0, stopY = 0;
    const setLeftAndWidth = () => {
      const r = aside.getBoundingClientRect();
      card.style.setProperty("--pc-left", r.left + window.scrollX + "px");
      card.style.setProperty("--pc-width", r.width + "px");
    };
    const computeStops = () => {
      const a = aside.getBoundingClientRect();
      const g = grid.getBoundingClientRect();
      const pageY = window.scrollY || window.pageYOffset;
      const cardH = card.offsetHeight;
      startY = Math.round(a.top + pageY - TOP_GAP);
      const gridBottomY = Math.round(g.bottom + pageY);
      stopY = gridBottomY - cardH - TOP_GAP;
      if (stopY < startY) stopY = startY + 1;
    };
    const clsFixed = s["is-fixed"] || "is-fixed";
    const clsBottom = s["is-bottom"] || "is-bottom";
    const applyState = () => {
      if (!mq.matches) {
        card.classList.remove(clsFixed, clsBottom);
        card.style.removeProperty("--pc-left");
        card.style.removeProperty("--pc-width");
        return;
      }
      const y = window.scrollY || window.pageYOffset;
      if (y < startY) card.classList.remove(clsFixed, clsBottom);
      else if (y < stopY) { card.classList.add(clsFixed); card.classList.remove(clsBottom); }
      else { card.classList.remove(clsFixed); card.classList.add(clsBottom); }
    };
    const relayout = () => { if (!mq.matches) return applyState(); setLeftAndWidth(); computeStops(); applyState(); };
    relayout();
    window.addEventListener("resize", relayout, { passive: true });
    window.addEventListener("scroll", applyState, { passive: true });
    const ro = new ResizeObserver(relayout);
    ro.observe(card);
    const img = card.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", relayout, { once: true });
    return () => {
      window.removeEventListener("resize", relayout);
      window.removeEventListener("scroll", applyState);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <Header2 openMenu={openMenu} />
      <main className={`${s["aa-wrap"]} ${rs["aa-wrap"] || ""}`}>
        {/* 상단 여백/배경 섹션은 CSS에서 처리 */}
        <section className={`${s["aa-section"]} ${rs["aa-section"] || ""}`}>
          <div className={`${s["aa-titles"]} ${rs["aa-titles"] || ""}`}>
            <h1 className={s["aa-title"]}>입양상담신청</h1>
            <div className={s["aa-title-line"]}></div>
          </div>

          <div className={`${s["aa-grid"]} ${rs["aa-grid"] || ""}`}>
            {/* ====== 왼쪽: 신청 폼 ====== */}
            <form className={s["aa-form"]} onSubmit={onSubmit}>
              {/* 이름 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-name">
                  이름<span className={s["aa-req"]}>*</span>
                </label>
                <input
                  id="aa-name"
                  name="name"
                  className={s["aa-input"]}
                  placeholder="이름 입력"
                  value={form.name}
                  onChange={onChange}
                />
              </div>

              {/* 전화 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]}>
                  전화<span className={s["aa-req"]}>*</span>
                </label>
                <div className={s["aa-phone"]}>
                  <input
                    name="phone1"
                    className={`${s["aa-input"]} ${s["aa-phone-part"]}`}
                    value={form.phone1}
                    onChange={onChange}
                    maxLength={3}
                  />
                  <input
                    name="phone2"
                    className={`${s["aa-input"]} ${s["aa-phone-part"]}`}
                    value={form.phone2}
                    onChange={onChange}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1234"
                  />
                  <input
                    name="phone3"
                    className={`${s["aa-input"]} ${s["aa-phone-part"]}`}
                    value={form.phone3}
                    onChange={onChange}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1234"
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-email">
                  이메일<span className={s["aa-req"]}></span>
                </label>
                <input
                  id="aa-email"
                  name="email"
                  className={s["aa-input"]}
                  placeholder="이메일"
                  value={form.email}
                  onChange={onChange}
                  type="email"
                />
              </div>

              {/* 입양 희망 사유 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-reason">
                  입양 희망 사유
                </label>
                <textarea
                  id="aa-reason"
                  name="reason"
                  className={s["aa-textarea"]}
                  rows={4}
                  placeholder="ex) 반려 경험은 없지만 책임 있게 돌보며 가족처럼 함께하고 싶어요."
                  value={form.reason}
                  onChange={onChange}
                />
              </div>

              {/* 입양 후 계획 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-plan">
                  입양 후 계획
                </label>
                <textarea
                  id="aa-plan"
                  name="plan"
                  className={s["aa-textarea"]}
                  rows={3}
                  placeholder="ex) 매일 산책하고, 정기적으로 건강검진을 받을 예정이에요."
                  value={form.plan}
                  onChange={onChange}
                />
              </div>

              {/* 거주 형태 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-houseType">
                  거주 형태 <span className={s["aa-helper"]}>선택</span>
                </label>
                <div className={s["aa-select-wrap"]}>
                  <select
                    id="aa-houseType"
                    name="houseType"
                    className={s["aa-select"]}
                    value={form.houseType}
                    onChange={onChange}
                  >
                    <option>아파트</option>
                    <option>빌라</option>
                    <option>단독/다가구</option>
                    <option>원룸/오피스텔</option>
                    <option>기타</option>
                  </select>
                  <span className={s["aa-caret"]} aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>

              {/* 연락 가능 시간대 */}
              <div className={s["aa-field"]}>
                <label className={s["aa-label"]} htmlFor="aa-contactTime">
                  연락 가능 시간대
                </label>
                <div className={s["aa-select-wrap"]}>
                  <select
                    id="aa-contactTime"
                    name="contactTime"
                    className={s["aa-select"]}
                    value={form.contactTime}
                    onChange={onChange}
                  >
                    <option>오전(9~12시)</option>
                    <option>오후(12~18시)</option>
                    <option>저녁(18~21시)</option>
                  </select>
                  <span className={s["aa-caret"]} aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>

              {/* 동의사항 */}
              <fieldset className={s["aa-agrees"]}>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree1"
                    checked={form.agree1}
                    onChange={onChange}
                  />
                  <span>동물 유기 시 법적 책임을 인지합니다.</span>
                </label>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree2"
                    checked={form.agree2}
                    onChange={onChange}
                  />
                  <span>
                    중성화·예방접종 등 기본 관리를 성실히 이행하겠습니다.
                  </span>
                </label>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree3"
                    checked={form.agree3}
                    onChange={onChange}
                  />
                  <span>
                    입양 후 일정 기간(예: 3개월) 사진·근황 공유에 동의합니다.
                  </span>
                </label>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree4"
                    checked={form.agree4}
                    onChange={onChange}
                  />
                  <span>
                    개인정보 수집·이용 및 제3자 제공(해당 입양처)에 동의합니다.
                  </span>
                </label>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree5"
                    checked={form.agree5}
                    onChange={onChange}
                  />
                  <span>
                    본 사이트는 “중개 플랫폼”이며 최종 심사·계약·사후책임은
                    입양처에 있음을 동의합니다.
                  </span>
                </label>
                <label className={s["aa-agree"]}>
                  <input
                    type="checkbox"
                    name="agree6"
                    checked={form.agree6}
                    onChange={onChange}
                  />
                  <span>동물 유기 시 법적 책임을 인지합니다.</span>
                </label>
              </fieldset>

              <button type="submit" className={s["aa-submit"]}>
                제출하기
              </button>
            </form>

            {/* ====== 오른쪽: 반려동물 카드 ====== */}
            <aside className={s["aa-pet"]} ref={petAsideRef}>
              <div
                className={`${s["aa-pet-card"]} ${photoFront ? s["photo-front"] : ""
                  }`}
                ref={petCardRef}
                onClick={() => setPhotoFront((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setPhotoFront((v) => !v);
                }}
              >
                <div className={s["aa-pet-photo"]}>
                  <img src={petState.image} alt={`${petState.name} 사진`} />
                </div>

                <div className={s["aa-pet-box"]}>
                  <p className={s["aa-pet-org"]}>{petState.org}</p>
                  <p className={s["aa-pet-org-call"]}>연락처 : {petState.phone}</p>

                  <ul className={s["aa-pet-meta"]}>
                    <li>
                      <span className={s["aa-meta-key"]}>이름 :</span>
                      <span className={s["aa-meta-val"]}>{petState.name}</span>
                    </li>
                    <li>
                      <span className={s["aa-meta-key"]}>나이 :</span>
                      <span className={s["aa-meta-val"]}>{petState.age}</span>
                    </li>
                    <li>
                      <span className={s["aa-meta-key"]}>성별 :</span>
                      <span className={s["aa-meta-val"]}>{petState.gender}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer2 />
    </>
  );
}
