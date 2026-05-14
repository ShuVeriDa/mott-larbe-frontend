"use client";

import { create } from "zustand";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";

export interface PhrasePopupAnchor {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PhraseLookupState {
  activePhrase: PagePhraseOccurrence | null;
  anchor: PhrasePopupAnchor | null;
  open: (phrase: PagePhraseOccurrence, anchor: PhrasePopupAnchor) => void;
  close: () => void;
}

export const usePhraseLookupStore = create<PhraseLookupState>((set) => ({
  activePhrase: null,
  anchor: null,
  open: (phrase, anchor) => set({ activePhrase: phrase, anchor }),
  close: () => set({ activePhrase: null, anchor: null }),
}));
