// ===== app/cart/page.jsx =====
"use client";
import { useEffect, useMemo, useState, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import s from "./CartLike.module.css";

const CART_KEY = "gaon_cart";
const CHECKOUT_KEY = "gaon_checkout";
const KRW = (n) => (n || 0).toLocaleString("ko-KR") + "원";

export default function Cart2Page({ openMenu }) {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const headerBoxRef = useRef(null);
  const pageRef = useRef(null);

  // ── 헤더 높이 → CSS 변수 주입 ────────────────────────────────────────
  useLayoutEffect(() => {
    if (!headerBoxRef.current || !pageRef.current) return;
    const apply = () => {
      const h = Math.round(headerBoxRef.current.getBoundingClientRect().height || 0);
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

  // ── 장바구니 로드 ─────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const list = JSON.parse(raw);
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  // ── 체크박스 초기화(기본 전체 선택) ───────────────────────────────────
  useEffect(() => {
    const init = {};
    items.forEach((it) => (init[it.id] = true));
    setChecked(init);
  }, [items]);

  const allChecked = useMemo(
    () => items.length > 0 && items.every((it) => checked[it.id]),
    [items, checked]
  );

  // ── 선택 토글 ────────────────────────────────────────────────────────
  const toggleAll = () => {
    const next = {};
    items.forEach((it) => (next[it.id] = !allChecked));
    setChecked(next);
  };

  const toggleOne = (id) => {
    setChecked((p) => ({ ...p, [id]: !p[id] }));
  };

  const selectedItems = useMemo(
    () => items.filter((it) => checked[it.id]),
    [items, checked]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [selectedItems]
  );

  const hasSelection = selectedItems.length > 0;

  // ✅ 선택 삭제
  const removeSelected = () => {
    if (!items.length) return;
    const next = items.filter((it) => !checked[it.id]);
    setItems(next);

    // 선택 상태 재빌드(남은 것들은 기본 선택)
    const nextChecked = {};
    next.forEach((i) => (nextChecked[i.id] = true));
    setChecked(nextChecked);

    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  // ✅ 모두 비우기
  const clearAll = () => {
    setItems([]);
    setChecked({});
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  };

  // ── 로그인 확인: 서버 세션/쿠키 기준 ──────────────────────────────────
  const fetchMe = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.ok ? data.user : null;
    } catch {
      return null;
    }
  };

  // (선택) 현재 로그인 사용자 표시/힌트가 필요할 때만 사용
  const [me, setMe] = useState(null);
  useEffect(() => {
    (async () => {
      const u = await fetchMe();
      setMe(u);
    })();
  }, []);

  // ── 결제: 로그인 + 선택 검증 ──────────────────────────────────────────
  const goCheckout = async () => {
    // 1) 서버 세션으로 최신 로그인 상태 확인
    const currentUser = await fetchMe();
    if (!currentUser) {
      alert("로그인 후 결제할 수 있습니다.");
      router.push("/login?redirect=/cart"); // 로그인 경로에 맞게 조정
      return;
    }

    // 2) 선택 항목 확인
    if (!selectedItems.length) {
      alert("결제할 상품을 선택해 주세요.");
      return;
    }

    // 3) 결제 데이터 저장 및 이동
    const payload = selectedItems.map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      qty: it.qty,
      thumb: it.thumb,
    }));
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
    router.push("/PaymentPage");
  };

  return (
    <div>
      <div ref={headerBoxRef}>
        <Header2 openMenu={openMenu} />
      </div>

      <div id="cart2-page" className={s.cart2Page} ref={pageRef}>
        <div className={s.cart2Title}>
          <span>장바구니</span>
          <div className={s.cart2TitleLine} />
        </div>

        <div className={s.cart2Grid}>
          {/* 왼쪽 */}
          <section className={s.cart2Left}>
            <label className={s.cart2SelectAll}>
              <input type="checkbox" checked={allChecked} onChange={toggleAll} /> 전체 선택
            </label>

            <div className={s.cart2Panel}>
              {ready && items.length > 0 ? (
                items.map((it, idx) => (
                  <div
                    key={it.id}
                    className={`${s.cart2Row} ${idx > 0 ? s.cart2RowDivided : ""}`}
                  >
                    <div className={s.cart2RowHead}>
                      <input
                        type="checkbox"
                        checked={!!checked[it.id]}
                        onChange={() => toggleOne(it.id)}
                      />
                      {it.title}
                    </div>

                    <div className={s.cart2RowBody}>
                      <div className={s.cart2Thumb}>
                        {it.thumb && <img src={it.thumb} alt={it.title} />}
                      </div>
                      <div className={s.cart2Info}>
                        <div className={s.cart2Name}>
                          {it.title} · {it.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className={s.cart2RowBottom}>
                      <div>
                        <p>가격</p>
                        <p>
                          <strong>{KRW(it.price)}</strong>
                        </p>
                      </div>
                      <div>
                        <p>적립 포인트</p>
                        <p>
                          <strong>1000P</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : ready ? (
                <div className={s.cart2Empty}>장바구니에 담긴 상품이 없습니다.</div>
              ) : null}
            </div>

            <div className={s.cart2LeftButtons}>
              <button type="button" onClick={removeSelected} className={s.cart2LeftBtn}>
                선택 삭제
              </button>
              <button type="button" onClick={clearAll} className={s.cart2LeftBtn}>
                비우기
              </button>
            </div>
          </section>

          {/* 오른쪽 */}
          <aside className={s.cart2Right}>
            <div className={s.cart2SummaryBox}>
              <h2 className={s.cart2SummaryTitle}>결제 금액</h2>
              <div className={s.cart2SummaryList}>
                {selectedItems.map((it) => (
                  <div key={`sum-${it.id}`} className={s.cart2SummaryRow}>
                    <span>{it.title}</span>
                    <span>{KRW((it.price || 0) * (it.qty || 1))}</span>
                  </div>
                ))}
                <div className={s.cart2SummaryRow}>
                  <span>쿠폰 할인</span>
                  <span>0원</span>
                </div>
                <div className={s.cart2SummaryRow}>
                  <span>적립금 사용</span>
                  <span>0원</span>
                </div>
              </div>
              <div className={s.cart2SummaryFinal}>
                <div className={s.cart2SummaryFinalLabel}>최종 결제 금액</div>
                <div className={s.cart2SummaryFinalPrice}>{KRW(totalPrice)}</div>
              </div>
              <button
                type="button"
                className={s.cart2SummaryBtn}
                onClick={goCheckout}
                disabled={!hasSelection}
              >
                결제하기
              </button>
              {!me && <p className={s.cart2Hint}></p>}
            </div>
          </aside>
        </div>
      </div>

      <Footer2 />
    </div>
  );
}
