"use client";

import { create } from "zustand";
import type { PhraseLang } from "@/entities/phrasebook";

export interface PhrasebookFiltersState {
	activeCategoryId: string | null;
	lang: PhraseLang | null;
	savedOnly: boolean;
	search: string;
	openPhraseId: string | null;
	setActiveCategoryId: (id: string | null) => void;
	setLang: (lang: PhraseLang | null) => void;
	setSavedOnly: (saved: boolean) => void;
	setSearch: (search: string) => void;
	setOpenPhraseId: (id: string | null) => void;
	toggleOpenPhraseId: (id: string) => void;
}

export const usePhrasebookFilters = create<PhrasebookFiltersState>((set, get) => ({
	activeCategoryId: null,
	lang: null,
	savedOnly: false,
	search: "",
	openPhraseId: null,
	setActiveCategoryId: (activeCategoryId) =>
		set({ activeCategoryId, openPhraseId: null }),
	setLang: (lang) => set({ lang }),
	setSavedOnly: (savedOnly) => set({ savedOnly }),
	setSearch: (search) => set({ search }),
	setOpenPhraseId: (openPhraseId) => set({ openPhraseId }),
	toggleOpenPhraseId: (id) =>
		set({ openPhraseId: get().openPhraseId === id ? null : id }),
}));
