"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { LibraryTextCards } from "@/widgets/library-text-cards";
import { LibraryTopbar } from "@/widgets/library-topbar";
import { useLibraryPage, type LibraryPageState } from "../model/use-library-page";

interface LibraryPageProps {
	hideTopbar?: boolean;
	state?: LibraryPageState;
}

export const LibraryPage = ({ hideTopbar, state }: LibraryPageProps) => {
	const { t } = useI18n();
	const ownState = useLibraryPage();
	const { query, counts, items, view, sort, sentinelRef, handleRefresh } =
		state ?? ownState;

	return (
		<div className="flex flex-1 flex-col overflow-hidden max-md:overflow-visible">
			{!hideTopbar && (
				<LibraryTopbar counts={counts} onRefresh={handleRefresh} />
			)}

			<div className="flex-1 overflow-y-auto px-5 pb-10 pt-0 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] max-sm:px-3 max-sm:pt-3 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2">
				{hideTopbar && (
					<div className="mb-4 mt-4 flex items-center gap-3">
						<Typography tag="h2" className="text-[13px] font-semibold text-t-2">
							{t("library.title")}
						</Typography>
						<div className="h-px flex-1 bg-bd-1" />
						{counts.total > 0 && (
							<Typography tag="span" className="text-[11px] text-t-3">
								{counts.total}
							</Typography>
						)}
					</div>
				)}
				{query.isPending && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3 max-sm:grid-cols-1 max-[380px]:grid-cols-1">
						{Array.from({ length: 6 }).map((_, i) => (
							<CardSkeleton key={i} />
						))}
					</div>
				)}

				{query.isError && (
					<div className="flex flex-col items-center justify-center gap-2 py-16 text-t-3">
						<Typography tag="p" className="text-sm text-t-2">
							{t("library.error")}
						</Typography>
						<Button
							onClick={handleRefresh}
							className="text-xs text-acc-t hover:underline"
						>
							{t("library.retry")}
						</Button>
					</div>
				)}

				{query.isSuccess && (
					<>
						<LibraryTextCards items={items} view={view} sort={sort} />
						<div ref={sentinelRef} className="h-1" />
						{query.isFetchingNextPage && (
							<div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3 pt-3 max-sm:grid-cols-1 max-[380px]:grid-cols-1">
								{Array.from({ length: 3 }).map((_, i) => (
									<CardSkeleton key={i} />
								))}
							</div>
						)}
					</>
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
