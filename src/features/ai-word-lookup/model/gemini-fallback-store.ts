"use client";

import { create } from "zustand";

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const THRESHOLD = 2;

interface GeminiFallbackStore {
  rateLimitHits: number[];
  showPersistentBanner: boolean;
  recordRateLimitHit: () => void;
  clearBanner: () => void;
}

export const useGeminiFallbackStore = create<GeminiFallbackStore>()((set, get) => ({
  rateLimitHits: [],
  showPersistentBanner: false,

  recordRateLimitHit: () => {
    const now = Date.now();
    const recent = get().rateLimitHits.filter((t) => now - t < WINDOW_MS);
    const updated = [...recent, now];
    set({
      rateLimitHits: updated,
      showPersistentBanner: updated.length >= THRESHOLD,
    });
  },

  clearBanner: () => set({ rateLimitHits: [], showPersistentBanner: false }),
}));
