"use client";
import { createContext } from "react";

export const MenuContext = createContext({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});
