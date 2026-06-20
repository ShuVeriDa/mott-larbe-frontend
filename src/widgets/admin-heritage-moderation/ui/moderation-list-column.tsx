"use client";

import type { useI18n } from "@/shared/lib/i18n";
import { Skeleton } from "@/shared/ui/skeleton";
import { Typography } from "@/shared/ui/typography";
import type { PendingHeritageItem } from "@/entities/heritage";
import { ModerationListItem } from "./moderation-list-item";

interface ModerationListColumnProps {
	items: PendingHeritageItem[];
	isLoading: boolean;
	selectedId: string | null;
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onSelect: (item: PendingHeritageItem) => void;
	onPageChange: (page: number) => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const ModerationListColumn = ({
	items,
	isLoading,
	selectedId,
	page,
	totalPages,
	total,
	limit,
	onSelect,
	onPageChange,
	t,
}: ModerationListColumnProps) => {
	const handlePrev = () => onPageChange(page - 1);
	const handleNext = () => onPageChange(page + 1);

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-4 py-2">
				<Typography tag="p" className="text-[11px] font-medium text-t-3">
					{t("admin.heritage.moderation.total", { count: total })}
				</Typography>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<ModerationListSkeleton />
				) : items.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
						<Typography tag="p" className="text-[13px] text-t-3">
							{t("admin.heritage.moderation.empty")}
						</Typography>
					</div>
				) : (
					items.map((item) => (
						<ModerationListItem
							key={item.heritageId}
							item={item}
							isSelected={selectedId === item.heritageId}
							onSelect={onSelect}
							t={t}
						/>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex shrink-0 items-center justify-between border-t border-bd-1 px-4 py-2">
					<button
						type="button"
						onClick={handlePrev}
						disabled={page <= 1}
						className="rounded px-2 py-1 text-[12px] text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{t("common.prev")}
					</button>
					<Typography tag="span" className="text-[12px] text-t-3">
						{page} / {totalPages}
					</Typography>
					<button
						type="button"
						onClick={handleNext}
						disabled={page >= totalPages}
						className="rounded px-2 py-1 text-[12px] text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{t("common.next")}
					</button>
				</div>
			)}
		</div>
	);
};

const ModerationListSkeleton = () => (
	<div className="flex flex-col gap-0">
		{Array.from({ length: 8 }).map((_, i) => (
			<div key={i} className="border-b border-bd-1 px-4 py-3">
				<Skeleton className="mb-2 h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		))}
	</div>
);
