"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLibraryFilterStore } from "@/features/library-filters";
import {
	libraryTextKeys,
	useLibraryTexts,
	type LibraryTextCounts,
} from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { LibraryTopbar } from "@/widgets/library-topbar";
import { LibraryFilterBar } from "@/widgets/library-filter-bar";
import { LibraryStatsRow } from "@/widgets/library-stats-row";
import { LibraryTextCards } from "@/widgets/library-text-cards";

const EMPTY_COUNTS: LibraryTextCounts = {
	total: 0,
	new: 0,
	inProgress: 0,
	completed: 0,
};

export const LibraryPage = () => {
	const { t } = useI18n();
	const qc = useQueryClient();
	const { level, lang, status, sort, view, search } = useLibraryFilterStore();

	const query = useLibraryTexts({
		language: lang !== "all" ? [lang] : undefined,
		level: level !== "all" ? [level] : undefined,
		status: status !== "all" ? status : undefined,
		orderBy: sort,
		search: search || undefined,
		limit: 50,
	});

	const handleRefresh = useCallback(() => {
		qc.invalidateQueries({ queryKey: libraryTextKeys.root });
	}, [qc]);

	const counts = query.data?.counts ?? EMPTY_COUNTS;
	const items = query.data?.items ?? [];

	return (
		<div className="flex flex-1 flex-col overflow-hidden max-md:overflow-visible">
			<LibraryTopbar
				totalCount={counts.total}
				onRefresh={handleRefresh}
			/>
			<LibraryFilterBar />
			<LibraryStatsRow counts={counts} />

			<div
				className="flex-1 overflow-y-auto px-5 pb-10 pt-5 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] max-sm:px-3 max-sm:pt-3 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2"
			>
				{query.isPending && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3 max-sm:grid-cols-2 max-[380px]:grid-cols-1">
						{Array.from({ length: 6 }).map((_, i) => (
							<CardSkeleton key={i} />
						))}
					</div>
				)}

				{query.isError && (
					<div className="flex flex-col items-center justify-center gap-2 py-16 text-t-3">
						<p className="text-sm text-t-2">{t("library.error")}</p>
						<button
							type="button"
							onClick={handleRefresh}
							className="text-xs text-acc-t hover:underline"
						>
							{t("library.retry")}
						</button>
					</div>
				)}

				{query.isSuccess && (
					<LibraryTextCards items={items} view={view} sort={sort} />
				)}
			</div>
		</div>
	);
};

const CardSkeleton = () => (
	<div className="animate-pulse rounded-card border border-bd-1 bg-surf p-4">
		<div className="mb-3 flex gap-2">
			<div className="h-5 w-8 rounded bg-surf-3" />
			<div className="h-5 w-14 rounded bg-surf-3" />
		</div>
		<div className="mb-1.5 h-4 w-3/4 rounded bg-surf-3" />
		<div className="mb-3 h-3 w-1/2 rounded bg-surf-3" />
		<div className="h-7 w-20 rounded-base bg-surf-3" />
	</div>
);
