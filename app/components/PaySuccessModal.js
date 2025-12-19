"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/c-css/PaySuccessModal.module.css";


export default function PaySuccessModal({
  open,
  onClose,
  onPrimary,
  primaryText = "마이 페이지로 이동",
  receipt = {
    buyer: "전유정",
    phone: "010 •••• ••34",
    course: "강의명",
    orderNo: "04172997324",
    date: "2025.00.00",
    discount: "00,000원",
    total: "00,000원",
  },
  width = 420, // 영수증/슬롯 너비(px)
  minPaper = 120, // 시작 높이
  duration = 1000, // 드르륵 펼침 시간(ms)
}) {
  const wrapRef = useRef(null);
  const feedRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef = useRef(null);

  const [paperH, setPaperH] = useState(minPaper);
  const [contentH, setContentH] = useState(minPaper);

  // 배경 스크롤 잠금 + 내용 높이 측정
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      if (contentRef.current) {
        const h = contentRef.current.scrollHeight + 14; // 톱니 포함
        setContentH(h);
        setPaperH(minPaper);
        startAutoUnroll(minPaper, h);
      }
      if (feedRef.current) feedRef.current.scrollTop = 0;
    });

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnim();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const stopAutoIfAny = () => cancelAnim();

  const cancelAnim = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startAutoUnroll = (from, to) => {
    cancelAnim();
    const start = performance.now();
    const dist = Math.max(0, to - from);

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setPaperH(from + dist * t ** 0.95);

      if (t < 1 && rafRef.current !== null) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  if (!open) return null;

  return (
    <div className={styles["roll-modal"]} role="dialog" aria-modal="true">
      <div className={styles["roll-backdrop"]} onClick={onClose} />

      <div
        className={styles["roll-wrap"]}
        ref={wrapRef}
        style={{ "--w": `${width}px` }}
        onWheel={stopAutoIfAny}
        onTouchStart={stopAutoIfAny}
        onPointerDown={stopAutoIfAny}
      >
        {/* 프린터 입구 */}
        <div className={styles["roll-slot"]} aria-hidden>
          <span className={styles["roll-slot-mouth"]} />
        </div>

        <div className={styles["roll-feed"]} ref={feedRef}>
          <div
            className={styles["roll-paper"]}
            style={{ height: `${paperH}px` }}
          >
            <div className={styles["roll-top-highlight"]} aria-hidden />
            <div className={styles["roll-content"]} ref={contentRef}>
              <div className={styles["roll-logo"]} />
              <div className={styles["roll-msg"]}>
                <span className={styles["roll-badge"]}>THANK YOU</span>
                <strong>결제가 완료되었습니다.</strong>
              </div>

              <dl className={styles["roll-table"]}>
                <div>
                  <dt>주문자명</dt>
                  <dd>{receipt.buyer}</dd>
                </div>
                <div>
                  <dt>연락처</dt>
                  <dd>{receipt.phone}</dd>
                </div>
                <div>
                  <dt>강의명</dt>
                  <dd>{receipt.course}</dd>
                </div>
                <div>
                  <dt>주문 번호</dt>
                  <dd>{receipt.orderNo}</dd>
                </div>
                <div>
                  <dt>주문 날짜</dt>
                  <dd>{receipt.date}</dd>
                </div>
                <div>
                  <dt>할인 금액</dt>
                  <dd>{receipt.discount}</dd>
                </div>
                <div className={styles["sum"]}>
                  <dt>합계</dt>
                  <dd>{receipt.total}</dd>
                </div>
              </dl>

              <ul className={styles["roll-notes"]}>
                <li>주문 내역은 마이페이지에서 확인 가능합니다.</li>
                <li>결제 후 14일 내에 환불 가능합니다.</li>
              </ul>

              <button
                type="button"
                className={styles["roll-btn"]}
                onClick={onPrimary ?? onClose}
              >
                {primaryText}
              </button>
            </div>
          </div>
          {/* 하단 톱니 */}
          <div className={styles["roll-edge"]} aria-hidden />
        </div>
      </div>
    </div>
  );
}
