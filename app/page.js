"use client";

import { useState, useEffect, useRef } from "react";
import { MenuContext } from "/app/context/MenuContext";

import "./global.css";

import Splash from "./components/Splash";
import Mainbgvideo from "./components/Mainbgvideo";
import Header from "./components/Header";
import Header2 from "./components/Header2";
import Footer from "./components/Footer";
import Allmenu from "./components/Allmenu";
import Sec1 from "./components/Sec1";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section6 from "./components/section6";
import Section7 from "./components/section7";
import ChatbotModal from "./components/chatbot";
import Calendar from "./components/Calendar";
import Floating from "./components/Floating";

import SectionDots from "./components/SectionDots";

export default function Home() {
  const [showHeader2, setShowHeader2] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [showSectionTitle, setShowSectionTitle] = useState(null);

  const sections = useRef([]);
  const footerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  const sectionRefs = sections; // 기존 sections.current와 동일

  const scrollToSection = (index) => {
    const offset = 80;
    let top;
    if (index < sections.current.length) {
      top = sections.current[index].offsetTop - offset;
    } else {
      top = footerRef.current.offsetTop - offset;
    }
    window.scrollTo({ top, behavior: "smooth" });
    setCurrentSection(index);
  };

  const handleSplashEnd = () => {
    setShowSplash(false);
    localStorage.setItem("visited", "true");
  };

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) setShowSplash(true);
  }, []);

  useEffect(() => {
    const updateHeader = () => {
      if (window.innerWidth < 1300) setShowHeader2(true);
      else setShowHeader2(window.scrollY > 0);
    };
    window.addEventListener("scroll", updateHeader);
    window.addEventListener("resize", updateHeader);
    updateHeader();
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  useEffect(() => {
    let isScrolling = false; // 스크롤 중복 방지
    const scrollCooldown = 800; // 스크롤 간격(ms). 값 높일수록 감도 ↓
    const offset = 80;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return; // 연속 스크롤 방지
      isScrolling = true;

      const maxScroll = document.body.scrollHeight - window.innerHeight;

      if (e.deltaY > 0) { // 아래로
        if (currentSection < sections.current.length) {
          const nextIndex = currentSection + 1;
          setCurrentSection(nextIndex);

          let top;
          if (nextIndex < sections.current.length) {
            top = sections.current[nextIndex].offsetTop - offset;
          } else {
            top = footerRef.current.offsetTop - offset;
          }

          window.scrollTo({ top: Math.min(top, maxScroll), behavior: "smooth" });
        }
      } else if (e.deltaY < 0) { // 위로
        if (currentSection > 0) {
          const prevIndex = currentSection - 1;
          setCurrentSection(prevIndex);

          let top;
          if (prevIndex < sections.current.length) {
            top = sections.current[prevIndex].offsetTop - offset;
          } else {
            top = footerRef.current.offsetTop - offset;
          }

          window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
        }
      }

      // 일정 시간 후 다시 스크롤 가능
      setTimeout(() => {
        isScrolling = false;
      }, scrollCooldown);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection]);



  const [tempShowIndex, setTempShowIndex] = useState(null);
  /* 스크롤로 동그라미 변경 */
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // 섹션의 60%가 화면에 보이면 활성화
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.current.indexOf(entry.target);
          if (index !== -1) {
            setCurrentSection(index);

            // 섹션 이름 잠깐 표시
            setTempShowIndex(index);
            setTimeout(() => setTempShowIndex(null), 3000);
          }
        }
      });
    };


    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);



  return (
    <>
      {showSplash ? (
        <Splash onNext={handleSplashEnd} />
      ) : (
        <div>
          <div
            className={`header-wrapper ${showHeader2 || isMenuOpen ? "hidden" : "visible"
              }`}
          >
            <Header openMenu={() => setIsMenuOpen(true)} />
          </div>

          {/* Header2 */}
          {showHeader2 && !isMenuOpen && (
            <div id="global-header2" className="header2-wrapper visible">
              <Header2 openMenu={() => setIsMenuOpen(true)} />
            </div>
          )}

          {isMenuOpen && <Allmenu closeMenu={() => setIsMenuOpen(false)} />}

          <div ref={(el) => (sections.current[0] = el)}><Mainbgvideo /></div>
          <div ref={(el) => (sections.current[1] = el)}><Sec1 /></div>
          <div ref={(el) => (sections.current[2] = el)}><Section3 /></div>
          <div ref={(el) => (sections.current[3] = el)}><Section4 /></div>
          <div ref={(el) => (sections.current[4] = el)}><Section6 /></div>
          <div ref={(el) => (sections.current[5] = el)}><Section7 /></div>

          <div ref={footerRef}><Footer /></div>

          <Floating onOpenCal={() => setCalOpen(true)} onOpenChat={() => setChatOpen(true)} />
          <SectionDots
            sections={sections.current}
            currentSection={currentSection}
            onClick={(idx) => {
              scrollToSection(idx);
              setTempShowIndex(idx);
              setTimeout(() => setTempShowIndex(null), 3000);
            }}
            tempShowIndex={tempShowIndex} // ← 추가
          />
          <Calendar open={calOpen} onClose={() => setCalOpen(false)} isLoggedIn={true} />
          <ChatbotModal open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </>
  );
}
