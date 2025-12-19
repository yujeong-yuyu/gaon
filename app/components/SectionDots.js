"use client";
import React, { useState, useEffect } from "react";

export default function SectionDots({ sections, currentSection, onClick, tempShowIndex }) {
    const sectionNames = ["Main", "Category", "Before&After", "Weather&Place", "What's GAON", "Puppy Match Test"];
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    // Track the fade-out effect completion
    useEffect(() => {
        if (currentSection === 0) {
            setFadeOut(true);
            setTimeout(() => setIsVisible(false), 500); // Wait for 500ms before removing component
        } else {
            setFadeOut(false);
            setIsVisible(true);
        }
    }, [currentSection]);

    if (!isVisible) return null; // Component will be removed after fade-out

    return (
        <div className={`section-dots ${fadeOut ? "fade-out" : "fade-in"}`}>
            {sections.map((_, idx) => (
                <div
                    key={idx}
                    className="dot-wrapper"
                    onClick={() => onClick(idx)}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <div className={`dot ${currentSection === idx ? "active" : ""}`} />

                    {/* Hover or Scroll triggers label */}
                    {(hoverIndex === idx || tempShowIndex === idx) && (
                        <span className="label">{sectionNames[idx]}</span>
                    )}
                </div>
            ))}

            <style jsx>{`
                .section-dots {
                    position: fixed;
                    left: 50px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 13px;
                    z-index: 1000;
                    opacity: 1;
                    transition: opacity 0.5s ease-in-out;
                }

                .fade-out {
                    opacity: 0;
                    pointer-events: none;  /* Prevent interaction while fading */
                }

                .dot-wrapper {
                    position: relative;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: transparent;
                    border: 1px solid #ccc;
                    transition: background 0.3s;
                    cursor: pointer;
                }

                .dot.active {
                    border: 1px solid transparent;
                    background: #F39535;
                }

                .label {
                    position: absolute;
                    left: 24px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    font-size: 12px;
                    padding: 5px 8px;
                    border-radius: 5px 5px 5px 0;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    animation: fadeIn 0.2s forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .section-dots {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
