"use client";

import { useMemo, useState, useEffect, useRef } from "react";

/* 아이콘 */
import { FaChevronLeft } from "react-icons/fa";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { TbCalendarCheck } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

/* CSS Module */
import styles from "@/styles/c-css/Calendar.module.css";

const ORANGE = "#F39535";
const ORANGE_SOFT = "rgba(243, 149, 53, 0.2)";

const fmt = (d) => d.toISOString().slice(0, 10);
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addDays = (d, n) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function getMonthMatrix(viewDate) {
  const first = startOfMonth(viewDate);
  const last = endOfMonth(viewDate);
  const start = new Date(first);
  const firstDow = (first.getDay() + 6) % 7; // Mon=0
  start.setDate(first.getDate() - firstDow);
  const end = new Date(last);
  const lastDow = (last.getDay() + 6) % 7;
  end.setDate(last.getDate() + (6 - lastDow));
  const cells = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) cells.push(new Date(d));
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const STORAGE_KEY = "gaon_calendar_events";

/** 초기 데이터: 기존 자격증 일정 + 10~11월 애견미용 예약 추가 **/
const initialEvents = {
  // ── 기존 예시 일정 ──────────────────────────────────────────────
  "2025-04-12": [{ id: "e1", title: "반려동물관리사 1차 필기시험", time: "10:00" }],
  "2025-05-18": [{ id: "e2", title: "반려동물행동교정사 실기시험", time: "09:30" }],
  "2025-06-22": [{ id: "e3", title: "애견미용사 자격시험(2급)", time: "13:00" }],
  "2025-09-07": [{ id: "e4", title: "펫아로마테라피스트 자격시험", time: "11:00" }],
  "2025-11-15": [{ id: "e5", title: "반려동물행동상담사 자격시험", time: "10:30" }],

  // ── 미용실 예약(10월 주변) ─────────────────────────────────────
  "2025-10-22": [
    { id: "g1", title: "애견미용 예약 - 목욕/부분미용 (가온펫살롱)", time: "14:00" },
  ],
  "2025-10-24": [
    { id: "g2", title: "애견미용 예약 - 전체미용 (가온펫살롱)", time: "10:30" },
  ],
  "2025-10-28": [
    { id: "g3", title: "애견미용 예약 - 발바닥/발톱 (가온펫살롱)", time: "18:00" },
  ],
  "2025-11-02": [
    { id: "g4", title: "애견미용 예약 - 위생미용 (가온펫살롱)", time: "11:00" },
  ],
};

export default function CalendarModal({ open, onClose }) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());

  // ── 일정 상태 (localStorage 연동) ───────────────────────────────
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setEvents(parsed);
      }
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch { }
  }, [events]);

  // ── 모드 & 편집 상태 ────────────────────────────────────────────
  const [mode, setMode] = useState("calendar"); // 'calendar' | 'planner'
  const [planText, setPlanText] = useState("");
  const [planTime, setPlanTime] = useState("09:00");
  const [editing, setEditing] = useState(null); // { dateKey, id } | null

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 ? "30" : "00";
    return `${h}:${m}`;
  });

  const handleDelete = (dateKey, id) => {
    setEvents((prev) => {
      const next = { ...prev };
      next[dateKey] = (next[dateKey] || []).filter((ev) => ev.id !== id);
      if (!next[dateKey]?.length) delete next[dateKey];
      return next;
    });
    // 삭제 중 편집 중이던 항목이면 편집 리셋
    if (editing && editing.dateKey === dateKey && editing.id === id) {
      setEditing(null);
      setPlanText("");
      setPlanTime("09:00");
      setMode("calendar");
    }
  };

  const panelRef = useRef(null);
  const chipWrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (mode === "planner") setMode("calendar");
        else onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, onClose]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (mode !== "planner") return;
    const el = chipWrapRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [mode, selected]);

  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
  const weeks = getMonthMatrix(viewDate);
  const selKey = fmt(selected);
  const dayEvents = events[selKey] || [];

  if (!open) return null;

  // ── 편집 시작: 리스트의 ✎ 버튼 클릭 시 호출 ─────────────────────
  const beginEdit = (dateKey, ev) => {
    setSelected(new Date(dateKey));
    setPlanText(ev.title);
    setPlanTime(ev.time);
    setEditing({ dateKey, id: ev.id });
    setMode("planner");
  };

  // ── 하단 "수정" 버튼: 선택일 첫 일정 빠르게 수정 ────────────────
  const quickEditSelectedDay = () => {
    if (dayEvents.length === 0) return;
    const ev = dayEvents.slice().sort((a, b) => a.time.localeCompare(b.time))[0];
    beginEdit(selKey, ev);
  };

  // ── 저장 처리 (신규/수정 공용) ───────────────────────────────────
  const handleSave = () => {
    const key = fmt(selected);
    const title = planText.trim();
    if (!title) return;

    setEvents((prev) => {
      const next = { ...prev };
      const list = next[key] ? [...next[key]] : [];

      if (editing) {
        // 기존 일정 수정
        // 1) 원래 날짜에서 해당 id 제거
        const fromKey = editing.dateKey;
        const fromList = (next[fromKey] || []).filter((e) => e.id !== editing.id);
        if (fromList.length) next[fromKey] = fromList;
        else delete next[fromKey];

        // 2) 새 날짜(key)에 수정된 일정 삽입 (같은 id 유지)
        const updated = { id: editing.id, title, time: planTime };
        const toList = next[key] ? [...next[key]] : [];
        toList.push(updated);
        next[key] = toList;

      } else {
        // 신규 일정 추가
        list.push({
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          title,
          time: planTime,
        });
        next[key] = list;
      }
      return next;
    });

    // 폼 리셋
    setPlanText("");
    setPlanTime("09:00");
    setEditing(null);
    setMode("calendar");
  };

  return (
    <>
      <div
        onClick={() => (mode === "planner" ? setMode("calendar") : onClose?.())}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.35)",
          zIndex: 9998,
        }}
      />

      <div
        className={`${styles["cal-modal"]} ${mode === "planner" ? styles["is-planner"] : ""}`}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className={styles["cal-header"]}>
          <div className={styles["cal-title"]}>
            <button
              className={styles["cal-backbtn"]}
              onClick={() => (mode === "planner" ? setMode("calendar") : onClose?.())}
              aria-label="뒤로"
            >
              <FaChevronLeft />
            </button>
            <h2>{mode === "planner" ? (editing ? "Edit Plan" : "Planner") : "Calendar"}</h2>
            <div className={styles["cal-line"]} />
          </div>

          <div className={styles["cal-month-nav"]}>
            <button
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
              }
            >
              ‹
            </button>
            <span>{monthLabel}</span>
            <button
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
              }
            >
              ›
            </button>
          </div>

          {mode === "planner" && (
            <div className={styles["cal-planner-chiprow"]}>
              <div className={styles["cal-chip-scroller"]} ref={chipWrapRef}>
                {Array.from({ length: 15 }, (_, i) => addDays(selected, i - 7)).map((d) => {
                  const active = sameDay(d, selected);
                  return (
                    <button
                      key={fmt(d)}
                      type="button"
                      className={`${styles["cal-chip"]} ${active ? styles.active : ""}`}
                      data-active={active ? "true" : "false"}
                      onClick={() => setSelected(d)}
                      aria-pressed={active}
                      title={d.toLocaleDateString("ko-KR")}
                    >
                      <span className={styles["cal-chip-day"]}>{d.getDate()}</span>
                      <span className={styles["cal-chip-week"]}>
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {mode === "calendar" ? (
          <>
            <div className={styles["cal-content"]}>
              <div className={styles["cal-weekdays"]}>
                {"MON TUE WED THU FRI SAT SUN".split(" ").map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className={styles["cal-grid"]}>
                {weeks.flat().map((d, i) => {
                  const inMonth = d.getMonth() === viewDate.getMonth();
                  const isSelected = sameDay(d, selected);
                  const isToday = sameDay(d, today);
                  const hasEvents = (events[fmt(d)]?.length ?? 0) > 0;

                  let bg = "transparent";
                  let border = "transparent";
                  let text = inMonth ? "#374151" : "#D1D5DB";

                  if (hasEvents) {
                    bg = ORANGE_SOFT;
                    text = "#f39535";
                  }
                  if (isToday) {
                    bg = ORANGE;
                    text = "#fff";
                  }
                  if (isSelected) {
                    bg = "#fff";
                    border = ORANGE;
                    text = "#f39535";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(d)}
                      className={styles["cal-day"]}
                      style={{
                        background: bg,
                        color: text,
                        borderColor: border,
                        borderWidth: isSelected ? "2px" : "0",
                      }}
                      title={fmt(d)}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${styles["cal-agenda"]} ${styles["cal-agenda--orange"]}`}>
              <div className={styles["cal-selected-date"]}>
                <TbCalendarCheck />
                {selected.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>

              <div className={styles["cal-date-line"]}></div>

              {dayEvents.length === 0 ? (
                <p className={`${styles["cal-noevent"]} ${styles["cal-noevent--on-orange"]}`}>
                  일정이 없습니다.
                </p>
              ) : (
                <ul className={styles["cal-eventlist"]}>
                  {dayEvents
                    .slice()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((ev) => (
                      <li key={ev.id} className={styles["cal-event-item"]}>
                        <span className={styles["cal-time"]}>{ev.time}</span>
                        <span className={styles["cal-title-text"]}>{ev.title}</span>

                        <button
                          type="button"
                          className={styles["cal-delete"]}
                          onClick={() => handleDelete(selKey, ev.id)}
                          aria-label={`이 일정 삭제: ${ev.title}`}
                          title="삭제"
                        >
                          <MdDeleteOutline />
                        </button>
                      </li>
                    ))}
                </ul>
              )}

              <div className={styles["cal-footer-actions"]}>
                <button
                  type="button"
                  className={`${styles["cal-btn"]} ${styles["cal-btn--ghost"]}`}
                  onClick={quickEditSelectedDay}
                  disabled={dayEvents.length === 0}
                  title={dayEvents.length ? "첫 일정 빠르게 수정" : "수정할 일정이 없습니다"}
                >
                  <FiEdit2 /> 수정
                </button>
                <button
                  type="button"
                  className={`${styles["cal-btn"]} ${styles["cal-btn--primary"]}`}
                  onClick={() => {
                    setEditing(null);
                    setPlanText("");
                    setPlanTime("09:00");
                    setMode("planner");
                  }}
                >
                  <FiPlus /> 추가
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles["cal-planner-body"]}>
            <label className={styles["cal-pl-label"]}>
              {editing ? "일정 (수정)" : "일정"}
            </label>
            <textarea
              className={styles["cal-pl-textarea"]}
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              placeholder="일정을 입력하세요"
            />

            <div className={styles["cal-pl-time"]}>
              <label className={styles["cal-pl-label"]}>시간</label>
              <select
                className={styles["cal-pl-select"]}
                value={planTime}
                onChange={(e) => setPlanTime(e.target.value)}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={styles["cal-pl-save"]}
                disabled={!planText.trim()}
                onClick={handleSave}
              >
                저장
              </button>
              <button
                className={styles["cal-pl-save"]}
                onClick={() => {
                  setEditing(null);
                  setPlanText("");
                  setPlanTime("09:00");
                  setMode("calendar");
                }}
                style={{ background: "#e5e7eb", color: "#111827" }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
