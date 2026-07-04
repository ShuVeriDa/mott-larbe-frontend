"use client";

import type { CefrLevel } from "@/shared/types";
import type {
	LibraryProgressStatus,
	LibrarySortOption,
	LibraryTextLanguage,
} from "@/entities/library-text";
import { useCurrentUser } from "@/entities/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { LibraryView } from "./library-filter-store";

const DEFAULT_SORT: LibrarySortOption = "newest";
const DEFAULT_VIEW: LibraryView = "grid";
// Applied once per tab: distinguishes "first visit, no filter chosen yet" from
// "user explicitly reset the filter to all languages" — both look identical
// as an absent `lang` URL param, so a session flag is the only way to tell them apart.
const LANG_DEFAULT_APPLIED_KEY = "library-filters:lang-default-applied";

export const useLibraryFilters = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { data: user } = useCurrentUser();

	const set = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value === null || value === "" || value === "all") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[searchParams, router, pathname],
	);

	const level: CefrLevel | "all" = (searchParams.get("level") as CefrLevel | null) ?? "all";
	const langParam = searchParams.get("lang") as LibraryTextLanguage | null;
	const lang: LibraryTextLanguage | "all" = langParam ?? "all";
	const status: LibraryProgressStatus | "all" = (searchParams.get("status") as LibraryProgressStatus | null) ?? "all";
	const sort: LibrarySortOption = (searchParams.get("sort") as LibrarySortOption | null) ?? DEFAULT_SORT;
	const view: LibraryView = (searchParams.get("view") as LibraryView | null) ?? DEFAULT_VIEW;
	const search = (searchParams.get("q") ?? "").trim().slice(0, 256);
	const genreId = searchParams.get("genre");
	const maxWords = (() => {
		const raw = Number(searchParams.get("maxWords"));
		return Number.isFinite(raw) && raw > 0 ? raw : null;
	})();

	// First visit this tab, no explicit filter yet → default to the user's
	// study language instead of "all". Runs once per tab (sessionStorage flag),
	// so an explicit reset back to "all" later is respected, not overridden again.
	useEffect(() => {
		if (langParam !== null) return;
		if (!user?.language) return;
		if (sessionStorage.getItem(LANG_DEFAULT_APPLIED_KEY)) return;

		sessionStorage.setItem(LANG_DEFAULT_APPLIED_KEY, "1");
		if (user.language === "CHE") return; // "CHE" already renders identically to "all" today
		set({ lang: user.language });
	}, [langParam, user?.language, set]);

	const setLevel = (v: CefrLevel | "all") => set({ level: v });
	const setLang = (v: LibraryTextLanguage | "all") => set({ lang: v });
	const setStatus = (v: LibraryProgressStatus | "all") => set({ status: v });
	const setSort = (v: LibrarySortOption) => set({ sort: v === DEFAULT_SORT ? null : v });
	const setView = (v: LibraryView) => set({ view: v === DEFAULT_VIEW ? null : v });
	const setSearch = (v: string) => set({ q: v });
	const setGenreId = (v: string | null) => set({ genre: v });
	const setMaxWords = (v: number | null) => set({ maxWords: v !== null ? String(v) : null });
	const resetFilters = () => {
		router.replace(pathname, { scroll: false });
	};

	return {
		level,
		lang,
		status,
		sort,
		view,
		search,
		genreId,
		maxWords,
		setLevel,
		setLang,
		setStatus,
		setSort,
		setView,
		setSearch,
		setGenreId,
		setMaxWords,
		resetFilters,
	};
};
