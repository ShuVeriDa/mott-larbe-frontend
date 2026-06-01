"use client";

import { create } from "zustand";
import type { CefrLevel } from "@/shared/types";
import type {
	LibraryProgressStatus,
	LibrarySortOption,
	LibraryTextLanguage,
} from "@/entities/library-text";

export type LibraryView = "grid" | "list";

export interface LibraryFilterState {
	level: CefrLevel | "all";
	lang: LibraryTextLanguage | "all";
	status: LibraryProgressStatus | "all";
	sort: LibrarySortOption;
	view: LibraryView;
	search: string;
	genreId: string | null;
	maxWords: number | null;
	setLevel: (level: CefrLevel | "all") => void;
	setLang: (lang: LibraryTextLanguage | "all") => void;
	setStatus: (status: LibraryProgressStatus | "all") => void;
	setSort: (sort: LibrarySortOption) => void;
	setView: (view: LibraryView) => void;
	setSearch: (search: string) => void;
	setGenreId: (genreId: string | null) => void;
	setMaxWords: (maxWords: number | null) => void;
	resetFilters: () => void;
}

const DEFAULT_FILTERS = {
	level: "all" as const,
	lang: "all" as const,
	status: "all" as const,
	sort: "newest" as LibrarySortOption,
	view: "grid" as LibraryView,
	search: "",
	genreId: null,
	maxWords: null,
};

export const useLibraryFilterStore = create<LibraryFilterState>((set) => ({
	...DEFAULT_FILTERS,
	setLevel: (level) => set({ level }),
	setLang: (lang) => set({ lang }),
	setStatus: (status) => set({ status }),
	setSort: (sort) => set({ sort }),
	setView: (view) => set({ view }),
	setSearch: (search) => set({ search }),
	setGenreId: (genreId) => set({ genreId }),
	setMaxWords: (maxWords) => set({ maxWords }),
	resetFilters: () => set(DEFAULT_FILTERS),
}));
