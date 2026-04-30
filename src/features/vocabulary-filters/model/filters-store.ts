"use client";

import { create } from "zustand";
import type { CefrLevel, LearningLevel } from "@/shared/types";
import type { DictionarySort } from "@/entities/dictionary";

export interface VocabularyFiltersState {
	status: LearningLevel | null;
	cefrLevel: CefrLevel | null;
	sort: DictionarySort;
	search: string;
	folderId: string | null;
	setStatus: (status: LearningLevel | null) => void;
	setCefrLevel: (level: CefrLevel | null) => void;
	setSort: (sort: DictionarySort) => void;
	setSearch: (search: string) => void;
	setFolderId: (id: string | null) => void;
	reset: () => void;
}

export const useVocabularyFilters = create<VocabularyFiltersState>((set) => ({
	status: null,
	cefrLevel: null,
	sort: "added",
	search: "",
	folderId: null,
	setStatus: (status) => set({ status }),
	setCefrLevel: (cefrLevel) => set({ cefrLevel }),
	setSort: (sort) => set({ sort }),
	setSearch: (search) => set({ search }),
	setFolderId: (folderId) => set({ folderId }),
	reset: () =>
		set({
			status: null,
			cefrLevel: null,
			sort: "added",
			search: "",
			folderId: null,
		}),
}));
