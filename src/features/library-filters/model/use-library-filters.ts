"use client";
import type { CefrLevel } from "@/shared/types";
import type {
	LibraryProgressStatus,
	LibrarySortOption,
	LibraryTextLanguage,
} from "@/entities/library-text";
import { useLibraryFilterStore } from "./library-filter-store";

export const useLibraryFilters = () => useLibraryFilterStore();
