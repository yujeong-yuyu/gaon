import styles from "../styles/c-css/FloatingChatDock.module.css";
import { TbCalendarCheck } from "react-icons/tb";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function FloatingChatDock({ onOpenChat, onOpenCal }) {
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowUp(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={styles.ftDock}>
      <div className={styles.ftDockPill}>
        <button
          className={styles.ftCal}
          onClick={onOpenCal}
          aria-label="일정 열기"
        >
          <TbCalendarCheck />
        </button>
        <button
          className={styles.ftChat}
          onClick={onOpenChat}
          aria-label="챗봇 열기"
        >
          <IoChatbubblesOutline />
        </button>
      </div>
      <button
        className={`${styles.ftDockUp} ${showUp ? styles.show : ""}`}
        onClick={scrollTop}
        aria-label="맨 위로"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M6 14l6-6 6 6"
            fill="none"
            stroke="#F39535"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
