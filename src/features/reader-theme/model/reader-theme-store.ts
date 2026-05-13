"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderTheme = "default" | "paper" | "sepia" | "warm" | "night" | "green" | "slate" | "custom";

interface ReaderThemeState {
  theme: ReaderTheme;
  bgColor: string;
  setTheme: (theme: ReaderTheme) => void;
  setBgColor: (color: string) => void;
}

export const useReaderTheme = create<ReaderThemeState>()(
  persist(
    (set) => ({
      theme: "default",
      bgColor: "#ffffff",
      setTheme: (theme) => set({ theme }),
      setBgColor: (bgColor) => set({ bgColor }),
    }),
    { name: "reader-theme" },
  ),
);
