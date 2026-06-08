"use client";

import { create } from "zustand";

export interface PhrasebookFiltersState {
	search: string;
	openPhraseId: string | null;
	selectionMode: boolean;
	selectedPhraseIds: Set<string>;
	setSearch: (search: string) => void;
	setOpenPhraseId: (id: string | null) => void;
	toggleOpenPhraseId: (id: string) => void;
	enterSelectionMode: () => void;
	toggleSelectPhrase: (id: string) => void;
	selectAllPhrases: (ids: string[]) => void;
	clearSelection: () => void;
}

export const usePhrasebookFilters = create<PhrasebookFiltersState>((set, get) => ({
	search: "",
	openPhraseId: null,
	selectionMode: false,
	selectedPhraseIds: new Set<string>(),
	setSearch: (search) => set({ search }),
	setOpenPhraseId: (openPhraseId) => set({ openPhraseId }),
	toggleOpenPhraseId: (id) =>
		set({ openPhraseId: get().openPhraseId === id ? null : id }),
	enterSelectionMode: () => set({ selectionMode: true, openPhraseId: null }),
	toggleSelectPhrase: (id) => {
		const next = new Set(get().selectedPhraseIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		set({ selectedPhraseIds: next });
	},
	selectAllPhrases: (ids) => set({ selectedPhraseIds: new Set(ids) }),
	clearSelection: () => set({ selectionMode: false, selectedPhraseIds: new Set() }),
}));
