"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { findResponse } from "/public/utils/chatMatcher";
import styles from "../styles/c-css/Chatbot.module.css";

export default function ChatbotModal({ open, onClose }) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  const [messages, setMessages] = useState([
    { who: "bot", text: "안녕하세요. 가온입니다.\n무엇을 도와드릴까요?" },
  ]);
  const [text, setText] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/chatbotData.json");
        if (!res.ok) throw new Error("데이터를 가져오지 못했습니다.");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Fetch 에러:", e);
      }
    };
    fetchData();
  }, []);

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    endRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  useEffect(() => {
    if (open) scrollToBottom(false);
  }, [open]);
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const add = (who, t) => setMessages((p) => [...p, { who, text: t }]);
  const send = () => {
    const v = text.trim();
    if (!v || !data) return;
    add("user", v);
    setText("");
    const reply =
      findResponse(v, data) ||
      data?.defaultResponse ||
      "죄송합니다. 이해하지 못했어요.";
    setTimeout(() => add("bot", reply), 250);
  };

  const chipClick = (label) => {
    add("user", label);
    const reply =
      findResponse(label, data) ||
      data?.defaultResponse ||
      "죄송합니다. 이해하지 못했어요.";
    setTimeout(() => add("bot", reply), 200);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        scrollToBottom(false);
        inputRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className={styles["cbt-overlay"]} onClick={onClose} />
      <div className={styles["cbt-container"]} role="dialog" aria-modal="true">
        <header className={styles["cbt-header"]}>
          <div className={styles["cbt-window-dots"]} aria-hidden="true">
            <button className={styles["cbt-close"]} onClick={onClose}>
              <FaChevronLeft />
            </button>
          </div>
          <p>Message</p>
        </header>

        <main className={styles["cbt-body"]} ref={scrollRef}>
          {messages.map((m, i) => (
            <section
              key={i}
              className={`${styles["cbt-bubble"]} ${styles[m.who]}`}
            >
              <p className={styles["cbt-my"]}>{m.text}</p>
            </section>
          ))}

          <div className={styles["cbt-bottom-wrap"]}>
            <section className={styles["cbt-cards-section"]}>
              <div className={styles["cbt-chips"]}>
                {["결제", "환불", "수강신청", "문의시간"].map((chip) => (
                  <button key={chip} onClick={() => chipClick(chip)}>
                    {chip}
                  </button>
                ))}
              </div>

              <div className={styles["cbt-cards"]}>
                {[1, 2, 3].map((i) => (
                  <article key={i} className={styles["cbt-card"]} tabIndex={0}>
                    <div className={styles["cbt-icon"]}>
                      <img
                        className={styles["img-default"]}
                        src={`https://kjwon2025.github.io/gaonimg/img/chat-card${i}-or.png`}
                        alt={i === 1 ? "추천강의" : i === 2 ? "수강 완료 강의" : "진행중인 강의"}
                        style={i === 3 ? { width: "70px" } : {}}
                      />
                      <img
                        className={styles["img-hover"]}
                        src={`https://kjwon2025.github.io/gaonimg/img/chat-card${i}-wh.png`}
                        alt=""
                        aria-hidden="true"
                        style={i === 3 ? { width: "70px" } : {}}
                      />

                    </div>
                    <p>
                      {i === 1
                        ? "추천강의"
                        : i === 2
                          ? "수강 완료 강의"
                          : "진행중인 강의"}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div ref={endRef} />
        </main>

        <footer className={styles["cbt-inputbar"]}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="메시지를 입력하세요"
          />
          <button className={styles["cbt-send-btn"]} onClick={send}>
            ➤
          </button>
        </footer>
      </div>
    </>
  );
}
