"use client";

import {
	libraryTextKeys,
	useInfiniteLibraryTexts,
	type LibraryTextCounts,
} from "@/entities/library-text";
import { useLibraryFilters } from "@/features/library-filters";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export type LibraryPageState = ReturnType<typeof useLibraryPage>;

const EMPTY_COUNTS: LibraryTextCounts = {
	total: 0,
	new: 0,
	inProgress: 0,
	completed: 0,
};

export const useLibraryPage = () => {
	const qc = useQueryClient();
	const { level, lang, status, sort, view, search, genreId, maxWords } = useLibraryFilters();
	const sentinelRef = useRef<HTMLDivElement>(null);

	const query = useInfiniteLibraryTexts({
		language: lang !== "all" ? [lang] : undefined,
		level: level !== "all" ? [level] : undefined,
		status: status !== "all" ? status : undefined,
		orderBy: sort,
		search: search || undefined,
		genreId: genreId ?? undefined,
		maxWords: maxWords ?? undefined,
	});
	const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ rootMargin: "200px" },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const handleRefresh = () => {
		qc.invalidateQueries({ queryKey: libraryTextKeys.root });
	};

	const counts = query.data?.pages[0]?.counts ?? EMPTY_COUNTS;
	const rawItems = query.data?.pages.flatMap((p) => p.items) ?? [];
	const items = sort === "newest"
		? [...rawItems].sort((a, b) =>
			a.progressStatus === "IN_PROGRESS" ? -1 : b.progressStatus === "IN_PROGRESS" ? 1 : 0
		)
		: rawItems;

	return {
		query,
		counts,
		items,
		view,
		sort,
		sentinelRef,
		handleRefresh,
	};
};
