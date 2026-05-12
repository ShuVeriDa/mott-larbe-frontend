import type { LibrarySortOption } from "@/entities/library-text";

export const LIBRARY_FILTER_SORT_OPTIONS: ReadonlyArray<{
	value: LibrarySortOption;
	labelKey:
		| "library.sort.level"
		| "library.sort.newest"
		| "library.sort.oldest"
		| "library.sort.alpha"
		| "library.sort.progress"
		| "library.sort.length";
}> = [
	{ value: "level", labelKey: "library.sort.level" },
	{ value: "newest", labelKey: "library.sort.newest" },
	{ value: "oldest", labelKey: "library.sort.oldest" },
	{ value: "alpha", labelKey: "library.sort.alpha" },
	{ value: "progress", labelKey: "library.sort.progress" },
	{ value: "length", labelKey: "library.sort.length" },
];
