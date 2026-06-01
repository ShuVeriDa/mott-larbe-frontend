import type { LibrarySortOption } from "@/entities/library-text";

export const LIBRARY_FILTER_SORT_OPTIONS: ReadonlyArray<{
	value: LibrarySortOption;
	labelKey: string;
}> = [
	{ value: "newest", labelKey: "library.sort.newest" },
	{ value: "popular", labelKey: "library.sort.popular" },
	{ value: "oldest", labelKey: "library.sort.oldest" },
	{ value: "alpha", labelKey: "library.sort.alpha" },
	{ value: "level", labelKey: "library.sort.level" },
	{ value: "length", labelKey: "library.sort.length" },
	{ value: "progress", labelKey: "library.sort.progress" },
];
