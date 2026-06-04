"use client";

import { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { StatusDot } from "@/shared/ui/status-badge";
import type { ReviewStatus } from "@/shared/ui/status-badge";

interface ReviewListItemProps {
	id: string;
	title: string;
	subtitle: string;
	status: ReviewStatus;
	isActive: boolean;
	onSelect: (id: string) => void;
	/** Optional right-side slot — e.g. a full StatusBadge for admin, nothing for user */
	rightSlot?: ReactNode;
}

export const ReviewListItem = ({
	id, title, subtitle, status, isActive, onSelect, rightSlot,
}: ReviewListItemProps) => {
	const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onSelect(id);
	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = (e) => {
		if (e.key === "Enter" || e.key === " ") onSelect(id);
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"cursor-pointer border-b border-bd-1 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-surf-2",
				isActive && "border-l-2 border-l-acc bg-acc-bg/40 hover:bg-acc-bg/60",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<Typography tag="p" className="truncate text-[13px] font-semibold text-t-1 leading-snug">
						{title}
					</Typography>
					<Typography tag="p" className="mt-0.5 text-[11px] text-t-3">
						{subtitle}
					</Typography>
				</div>
				<div className="flex shrink-0 flex-col items-end gap-1.5">
					<StatusDot status={status} className="mt-1" />
					{rightSlot}
				</div>
			</div>
		</div>
	);
};

export const ReviewListItemSkeleton = () => (
	<div className="border-b border-bd-1 px-3 py-2.5 last:border-b-0">
		<div className="mb-1.5 h-3 w-2/3 animate-pulse rounded bg-surf-3" />
		<div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
	</div>
);
