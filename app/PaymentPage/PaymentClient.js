"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import PaySuccessModal from "@/components/PaySuccessModal";

import s from "@/styles/p-css/PaymentPage.module.css";
import rs from "@/styles/P-response/response-PaymentPage.module.css";


const KRW = (n) =>
  (n || 0).toLocaleString("ko-KR", { minimumFractionDigits: 0 }) + "원";

const CART_KEY = "gaon_cart";
const CHECKOUT_KEY = "gaon_checkout";
const PAY_KEY = "gaon_payments";
const PROG_KEY = "gaon_progress";


export default function PaymentClient({ openMenu }) {
  const router = useRouter();

  const pageRef = useRef(null); // .pay-page
  const headerBoxRef = useRef(null); // Header2 감싸는 박스

  const [doneOpen, setDoneOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // ✅ 로그인 상태
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);



  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) {
          // 미로그인 → 로그인 페이지로
          router.replace("/login?redirect=/PaymentPage");
          return;
        }
        const data = await res.json();
        if (!aborted && data?.ok) setUser(data.user);
      } finally {
        if (!aborted) setAuthReady(true);
      }
    })();
    return () => { aborted = true; };
  }, [router]);

  // ✅ 장바구니/체크아웃 아이템 로드
  useEffect(() => {
    if (!authReady || !user) return;
    try {
      const checkoutRaw = localStorage.getItem(CHECKOUT_KEY);
      const cartRaw = localStorage.getItem(CART_KEY);
      let list = [];

      if (checkoutRaw) {
        list = JSON.parse(checkoutRaw) || [];
      } else if (cartRaw) {
        const fromCart = JSON.parse(cartRaw) || [];
        list = (Array.isArray(fromCart) ? fromCart : []).map((it) => ({
          id: it.id,
          title: it.title,
          price: Number(it.price || 0),
          qty: Number(it.qty || 1),
          thumb: it.thumb || null,
          coupon: 0,
        }));
      }
      setItems(list);
    } finally {
      setReady(true);
    }
  }, [authReady, user]);

  const [useAllPoint, setUseAllPoint] = useState(false);
  const [inputPoint, setInputPoint] = useState(0);
  const myPoint = 30000;

  const coupons = [
    { label: "1000원 할인 쿠폰", value: 1000 },
    { label: "5000원 할인 쿠폰", value: 5000 },
    { label: "10000원 할인 쿠폰", value: 10000 },
  ];

  const [payer, setPayer] = useState({
    name: "",
    password: "",
    phone1: "010",
    phone2: "",
    phone3: "",
  });

  const [payMethod, setPayMethod] = useState("무통장 입금");
  const [depositor, setDepositor] = useState("");

  // ---- 금액 계산 ----
  const { subTotals, couponTotal, pointUse, finalTotal } = useMemo(() => {
    const subTotals = items.reduce((s0, it) => s0 + (it.price || 0), 0);
    const couponTotal = items.reduce((s0, it) => s0 + (it.coupon || 0), 0);
    const pointUse = Math.min(
      useAllPoint ? myPoint : Number(inputPoint || 0),
      Math.max(subTotals - couponTotal, 0)
    );
    const finalTotal = Math.max(subTotals - couponTotal - pointUse, 0);
    return { subTotals, couponTotal, pointUse, finalTotal };
  }, [items, useAllPoint, inputPoint]);

  // ---- 쿠폰 세팅 ----
  const setCoupon = (id, value) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, coupon: Math.max(0, Math.min(value, it.price)) }
          : it
      )
    );
  };

  // ---- 헤더 높이 -> 페이지 CSS 변수 주입 ----
  useLayoutEffect(() => {
    if (!headerBoxRef.current || !pageRef.current) return;

    const apply = () => {
      const h = Math.round(
        headerBoxRef.current.getBoundingClientRect().height || 0
      );
      pageRef.current.style.setProperty("--header-h", `${h}px`);
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(headerBoxRef.current);

    window.addEventListener("resize", apply, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  const todayStr = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}.${mm}.${dd}`;
  };
  const genOrderNo = () => {
    return (
      String(Date.now()).slice(-8) + Math.floor(1000 + Math.random() * 9000)
    );
  };

  // 결제 완료(데모)
  const handleSubmit = () => {
    if (!user) {
      alert("로그인 후 이용할 수 있습니다.");
      router.replace("/login?redirect=/PaymentPage");
      return;
    }

    const orderNo = genOrderNo();
    const date = todayStr();

    // 1) 아이템별 정가(수량 반영), 쿠폰 적용가 계산
    const base = items.map((it) => {
      const qty = Number(it.qty || 1);
      const price = Number(it.price || 0) * qty;         // 수량 반영
      const coupon = Number(it.coupon || 0);             // 아이템별 쿠폰
      const netBeforePoints = Math.max(0, price - coupon);
      return { id: it.id, title: it.title, thumb: it.thumb || null, qty, price, coupon, netBeforePoints };
    });

    // 2) 적립금 배분 (비율 배분 + 반올림 보정)
    const totalNetBeforePoints = base.reduce((s, b) => s + b.netBeforePoints, 0);
    const totalPoints = pointUse;                        // 이미 useMemo에서 계산됨
    let alloc = base.map(() => 0);
    if (totalNetBeforePoints > 0 && totalPoints > 0) {
      // 2-1) 비율로 1차 배분(반올림)
      alloc = base.map((b) =>
        Math.round((b.netBeforePoints / totalNetBeforePoints) * totalPoints)
      );
      // 2-2) 합계 보정(반올림 오차)
      const diff = totalPoints - alloc.reduce((s, a) => s + a, 0);
      if (diff !== 0) {
        // 앞에서부터 1원씩 더하거나 빼서 총합 맞추기
        for (let i = 0, left = Math.abs(diff); i < base.length && left > 0; i++, left--) {
          alloc[i] += diff > 0 ? 1 : -1;
        }
      }
      // 2-3) 음수 방지(이론상 안 나오지만 안전)
      alloc = alloc.map((a, i) => Math.max(0, Math.min(a, base[i].netBeforePoints)));
    }

    // 3) 최종 실결제금(아이템별) 계산
    const newPayments = base.map((b, i) => {
      const pointsApplied = alloc[i] || 0;
      const paid = Math.max(0, b.netBeforePoints - pointsApplied);
      return {
        id: b.id,
        title: b.title,
        thumb: b.thumb,
        qty: b.qty,
        date,
        order: orderNo,
        // 참고용 원본 값들
        price: b.price,                 // 정가(수량 반영)
        couponApplied: b.coupon,        // 쿠폰 사용액(아이템별)
        pointsApplied,                  // 적립금 배분액(아이템별)
        paid,                           // ✅ 실제 납부한 금액(아이템별)
        // 주문 단위 요약(옵션)
        finalTotal,                     // 주문 총 실결제금
        orderCouponTotal: couponTotal,  // 주문 총 쿠폰
        orderPointUse: pointUse,        // 주문 총 적립금
      };
    });

    // 2) 기존 결제내역과 머지
    try {
      const prev = JSON.parse(localStorage.getItem(PAY_KEY) || "[]");
      localStorage.setItem(
        PAY_KEY,
        JSON.stringify([...(Array.isArray(prev) ? prev : []), ...newPayments])
      );
    } catch {
      localStorage.setItem(PAY_KEY, JSON.stringify(newPayments));
    }

    // 3) 수강진행(처음엔 0강 진행) 등록 (옵션)
    try {
      const prev = JSON.parse(localStorage.getItem(PROG_KEY) || "[]");
      const toAdd = items.map((it) => ({
        lectureId: it.id,
        title: it.title,
        total: 10, // 🔧 강의 총 회차를 알고 있으면 그 값으로
        progress: 0, // 처음 0강
      }));
      // 중복 방지(같은 lectureId 있으면 덮어쓰지 않음)
      const exists = new Set(
        (Array.isArray(prev) ? prev : []).map((x) => x.lectureId)
      );
      const merged = [
        ...(Array.isArray(prev) ? prev : []),
        ...toAdd.filter((x) => !exists.has(x.lectureId)),
      ];
      localStorage.setItem(PROG_KEY, JSON.stringify(merged));
    } catch { }

    // 4) 체크아웃 키 정리
    try {
      localStorage.removeItem(CHECKOUT_KEY);
    } catch { }

    // 5) 장바구니에서 구매한 항목 제거
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const buyIds = new Set(items.map((i) => i.id));
      const left = cart.filter((c) => !buyIds.has(c.id));
      localStorage.setItem(CART_KEY, JSON.stringify(left));
    } catch { }

    // 6) 완료 모달 열기
    setDoneOpen(true);
  };

  // ✅ 결제 성공 시 MyPage용 강의 진행 정보 저장
  const LS_PROGRESS_KEY = "gaon_progress";
  const LS_PAYMENTS_KEY = "gaon_payments";

  try {
    // 1. 기존 결제 내역 가져오기
    const payments = JSON.parse(localStorage.getItem(LS_PAYMENTS_KEY) || "[]");

    // 2. 각 결제 강의 정보를 기반으로 진행중 강의 리스트 만들기
    const newProgress = payments.map((p) => ({
      lectureId: p.id,
      title: p.title,
      total: 10,       // 총 강의 수 (예시로 10개)
      progress: 0,     // 처음은 0강 시청
      thumb: p.thumb,  // ✅ 썸네일 포함
    }));

    // 3. 기존 진행중 강의 + 새로 결제된 강의 병합
    const existing = JSON.parse(localStorage.getItem(LS_PROGRESS_KEY) || "[]");
    const merged = [...existing, ...newProgress];
    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error("진행중 강의 저장 실패:", err);
  }




  useEffect(() => {
    if (!user) return;
    setPayer((p) => ({
      ...p,
      name: user.name || p.name,
    }));
  }, [user]);

  if (!authReady || !user || !ready) return null;

  return (
    <div ref={pageRef} className={`${s["pay-page"]} ${rs["pay-page"] || ""}`}>
      {/* 헤더 래퍼에 ref 연결 */}
      <div ref={headerBoxRef}>
        <Header2 openMenu={openMenu} />
      </div>

      <div className={`${s["pay-wrap"]} ${rs["pay-wrap"] || ""}`}>
        <div className={`${s["pay-container"]} ${rs["pay-container"] || ""}`}>
          <div className={`${s["pay-head"]} ${rs["pay-head"] || ""}`}>
            <div className={`${s["pay-title"]} ${rs["pay-title"] || ""}`}>
              <span>결제하기</span>
              <div className={s["pay-line"]}></div>
            </div>
          </div>

          <section className={`${s["pay-grid"]} ${rs["pay-grid"] || ""}`}>
            {/* ===== 좌측: 주문 영역 ===== */}
            <div className={`${s["pay-left"]} ${rs["pay-left"] || ""}`}>
              {/* 주문상품 */}
              <div className={s["pay-card"]}>
                <h2 className={s["pay-card-title"]}>주문 상품</h2>

                {items.map((it) => (
                  <div key={it.id} className={s["pay-item"]}>
                    <div className={s["pay-thumb"]} aria-hidden>
                      {it.thumb && <img src={it.thumb} alt={it.title} />}
                    </div>

                    <div className={s["pay-item-info"]}>
                      <div className={s["pay-item-name"]}>{it.title}</div>
                      <div className={s["pay-item-price"]}>{KRW(it.price)}</div>
                    </div>

                    <div className={s["pay-coupon"]}>
                      <span className={s["pay-coupon-label"]}>쿠폰</span>
                      <select
                        className={`${s["pay-input"]} ${s["pay-input-sm"]}`}
                        defaultValue=""
                        onChange={(e) =>
                          setCoupon(it.id, Number(e.target.value) || 0)
                        }
                      >
                        <option value="" disabled>
                          쿠폰을 선택해주세요
                        </option>
                        {coupons.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className={s["pay-coupon-amount"]}>
                        -{KRW(it.coupon)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 적립금 */}
              <div className={s["pay-card"]}>
                <h2 className={s["pay-card-title"]}>적립금</h2>
                <div
                  className={`${s["pay-point-use"]} ${useAllPoint ? s["is-active"] : ""
                    }`}
                >
                  <label className={s["pay-checkbox"]}>
                    <input
                      type="checkbox"
                      checked={useAllPoint}
                      onChange={(e) => setUseAllPoint(e.target.checked)}
                    />
                    <span className={s["pay-tag"]}>적립금 전액 사용</span>
                  </label>

                  <span>{KRW(pointUse)}</span>
                </div>
              </div>

              {/* 주문자 정보 */}
              <div className={s["pay-card"]}>
                <div className={s["pay-card-title-row"]}>
                  <h2 className={s["pay-card-title"]}>주문자 정보</h2>
                  <span className={s["pay-req-tip"]}>
                    <span className={s["pay-req"]}>*</span>필수 입력 사항
                  </span>
                </div>

                <div className={s["pay-form"]}>
                  <label className={s["pay-field"]}>
                    <span>
                      이름<span className={s["pay-req"]}>*</span>
                    </span>
                    <input
                      className={s["pay-input"]}
                      value={payer.name}
                      onChange={(e) =>
                        setPayer({ ...payer, name: e.target.value })
                      }
                    />
                  </label>

                  <label className={s["pay-field"]}>
                    <span>
                      비밀번호<span className={s["pay-req"]}>*</span>
                    </span>
                    <input
                      className={s["pay-input"]}
                      type="password"
                      value={payer.password}
                      onChange={(e) =>
                        setPayer({ ...payer, password: e.target.value })
                      }
                      placeholder="영어, 숫자, 특수 문자 포함 8 - 20자"
                    />
                  </label>

                  <div className={s["pay-field"]}>
                    <span>
                      휴대전화<span className={s["pay-req"]}>*</span>
                    </span>
                    <div className={s["pay-phone"]}>
                      <select
                        className={s["pay-input"]}
                        value={payer.phone1}
                        onChange={(e) =>
                          setPayer({ ...payer, phone1: e.target.value })
                        }
                      >
                        <option>010</option>
                        <option>011</option>
                        <option>016</option>
                        <option>017</option>
                        <option>018</option>
                        <option>019</option>
                      </select>
                      <input
                        className={s["pay-input-phone"]}
                        value={payer.phone2}
                        onChange={(e) =>
                          setPayer({
                            ...payer,
                            phone2: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        maxLength={4}
                      />
                      <input
                        className={s["pay-input-phone"]}
                        value={payer.phone3}
                        onChange={(e) =>
                          setPayer({
                            ...payer,
                            phone3: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 결제 수단 */}
              <div className={s["pay-card"]}>
                <h2 className={s["pay-card-title"]}>결제 수단</h2>

                <div className={s["pay-methods"]}>
                  {["무통장 입금", "신용카드", "계좌이체", "Npay", "Kpay"].map(
                    (m) => (
                      <button
                        key={m}
                        className={`${s["pay-method"]} ${payMethod === m ? s["is-active"] : ""
                          }`}
                        type="button"
                        onClick={() => setPayMethod(m)}
                        aria-pressed={payMethod === m}
                      >
                        {m}
                      </button>
                    )
                  )}
                </div>

                {payMethod === "무통장 입금" && (
                  <>
                    <div className={s["pay-bankbox"]}>
                      <div className={s["pay-bankline"]}>
                        신한 <b>110-450-600575</b> 김지원
                      </div>
                    </div>

                    <label className={s["pay-field"]}>
                      <span>입금자명</span>
                      <input
                        className={s["pay-input"]}
                        value={depositor}
                        onChange={(e) => setDepositor(e.target.value)}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* ===== 우측: 결제 요약 ===== */}
            <aside className={`${s["pay-right"]} ${rs["pay-right"] || ""}`}>
              <div className={s["pay-summary"]}>
                <h2 className={s["pay-summary-title"]}>결제 금액</h2>

                <dl className={s["pay-summary-list"]}>
                  {items.map((it, i) => (
                    <div className={s["pay-summary-row"]} key={it.id}>
                      <dt>{it.title}</dt>
                      <dd>{KRW(it.price)}</dd>
                    </div>
                  ))}

                  <div className={s["pay-summary-row"]}>
                    <dt>쿠폰 할인</dt>
                    <dd>{KRW(couponTotal)}</dd>
                  </div>
                  <div className={s["pay-summary-row"]}>
                    <dt>적립금 사용</dt>
                    <dd>{KRW(pointUse)}</dd>
                  </div>
                </dl>

                <div className={s["pay-final"]}>
                  <div className={s["pay-final-label"]}>최종 결제 금액</div>
                  <div className={s["pay-final-price"]}>{KRW(finalTotal)}</div>
                </div>

                <button
                  className={`${s["pay-btn"]} ${s["pay-btn-primary"]} ${s["pay-submit"]}`}
                  onClick={handleSubmit}
                >
                  결제하기
                </button>

                <PaySuccessModal
                  open={doneOpen}
                  onClose={() => setDoneOpen(false)}
                  onPrimary={() => {
                    window.location.href = "/mypage";
                  }}
                  receipt={{
                    buyer: payer.name || "전유정",
                    phone: `${payer.phone1} ${payer.phone2.padStart(
                      4,
                      "•"
                    )} ${payer.phone3.padStart(4, "•")}`,
                    course: items.map((i) => i.title).join(", "),
                    orderNo: "04172997324",
                    date: "2025.00.00",
                    discount: `${(couponTotal || 0).toLocaleString("ko-KR")}원`,
                    total: `${(finalTotal || 0).toLocaleString("ko-KR")}원`,
                  }}
                />
              </div>
            </aside>
          </section>
        </div>
      </div>
      <Footer2 />
    </div>
  );
}
