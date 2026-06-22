"use client";

import {
	libraryTextKeys,
	useInfiniteLibraryTexts,
	type LibraryTextCounts,
} from "@/entities/library-text";
import { useLibraryFilters } from "@/features/library-filters";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

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

	const { ref: sentinelRef, inView } = useInView({
		rootMargin: "400px",
		threshold: 0,
	});

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
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleRefresh = () => {
		qc.invalidateQueries({ queryKey: libraryTextKeys.root });
	};

	const counts = query.data?.pages[0]?.counts ?? EMPTY_COUNTS;
	const items = query.data?.pages.flatMap((p) => p.items) ?? [];

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
