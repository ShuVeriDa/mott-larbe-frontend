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
	setLevel: (level: CefrLevel | "all") => void;
	setLang: (lang: LibraryTextLanguage | "all") => void;
	setStatus: (status: LibraryProgressStatus | "all") => void;
	setSort: (sort: LibrarySortOption) => void;
	setView: (view: LibraryView) => void;
	setSearch: (search: string) => void;
}

export const useLibraryFilterStore = create<LibraryFilterState>((set) => ({
	level: "all",
	lang: "all",
	status: "all",
	sort: "level",
	view: "grid",
	search: "",
	setLevel: (level) => set({ level }),
	setLang: (lang) => set({ lang }),
	setStatus: (status) => set({ status }),
	setSort: (sort) => set({ sort }),
	setView: (view) => set({ view }),
	setSearch: (search) => set({ search }),
}));
