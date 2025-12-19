"use client";
import { useState } from "react";
import { MenuContext } from "./context/MenuContext"; // ✅ 새 파일 import
import Allmenu from "./components/Allmenu";
import "./global.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="ko">
      <body>
        <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
          {children}
          {isMenuOpen && <Allmenu closeMenu={() => setIsMenuOpen(false)} />}
        </MenuContext.Provider>
      </body>
    </html>
  );
}
