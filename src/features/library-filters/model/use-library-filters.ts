"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { CefrLevel } from "@/shared/types";
import type {
	LibraryProgressStatus,
	LibrarySortOption,
	LibraryTextLanguage,
} from "@/entities/library-text";
import type { LibraryView } from "./library-filter-store";

const DEFAULT_SORT: LibrarySortOption = "level";
const DEFAULT_VIEW: LibraryView = "grid";

export const useLibraryFilters = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const level: CefrLevel | "all" =
		(searchParams.get("level") as CefrLevel | null) ?? "all";
	const lang: LibraryTextLanguage | "all" =
		(searchParams.get("lang") as LibraryTextLanguage | null) ?? "all";
	const status: LibraryProgressStatus | "all" =
		(searchParams.get("status") as LibraryProgressStatus | null) ?? "all";
	const sort: LibrarySortOption =
		(searchParams.get("sort") as LibrarySortOption | null) ?? DEFAULT_SORT;
	const view: LibraryView =
		(searchParams.get("view") as LibraryView | null) ?? DEFAULT_VIEW;
	const search: string = searchParams.get("q") ?? "";

	const update = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (!value) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
		const qs = params.toString();
		router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
	};

	return {
		level,
		lang,
		status,
		sort,
		view,
		search,
		setLevel: (v: CefrLevel | "all") =>
			update("level", v === "all" ? null : v),
		setLang: (v: LibraryTextLanguage | "all") =>
			update("lang", v === "all" ? null : v),
		setStatus: (v: LibraryProgressStatus | "all") =>
			update("status", v === "all" ? null : v),
		setSort: (v: LibrarySortOption) =>
			update("sort", v === DEFAULT_SORT ? null : v),
		setView: (v: LibraryView) =>
			update("view", v === DEFAULT_VIEW ? null : v),
		setSearch: (v: string) => update("q", v || null),
	};
};
