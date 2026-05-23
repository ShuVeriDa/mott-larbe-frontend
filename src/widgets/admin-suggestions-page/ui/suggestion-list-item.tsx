"use client";

import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { SuggestionStatusBadge } from "@/widgets/suggestions-page/ui/suggestion-status-badge";
import type { Suggestion } from "@/features/suggestions";

interface SuggestionListItemProps {
	item: Suggestion;
	isActive: boolean;
	onSelect: (id: string) => void;
	t: (key: string) => string;
}

export const SuggestionListItem = ({ item, isActive, onSelect, t }: SuggestionListItemProps) => {
	const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onSelect(item.id);
	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = e => {
		if (e.key === "Enter" || e.key === " ") onSelect(item.id);
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"group relative w-full cursor-pointer border-b border-bd-1 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-surf-2",
				isActive && "border-l-2 border-l-acc bg-acc-bg/40 hover:bg-acc-bg/60",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<Typography tag="p" className="truncate text-[13px] font-semibold text-t-1 leading-snug italic font-display">
						{item.entry?.rawWord ?? "—"}
					</Typography>
					<div className="mt-0.5 flex items-center gap-1.5">
						<Typography tag="span" className="text-[11px] text-t-3">
							{t(`suggest.fields.${item.field}`)}
						</Typography>
						<Typography tag="span" className="text-bd-3">·</Typography>
						<Typography tag="span" className="text-[11px] text-t-4">
							{item.user?.username ?? item.user?.name ?? "—"}
						</Typography>
					</div>
				</div>
				<SuggestionStatusBadge
					status={item.status}
					label={t(`adminSuggestions.status.${item.status}`)}
				/>
			</div>
		</div>
	);
};

export const SuggestionListItemSkeleton = () => (
	<div className="border-b border-bd-1 px-3 py-2.5 last:border-b-0">
		<div className="mb-1.5 h-3 w-2/3 animate-pulse rounded bg-surf-3" />
		<div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
	</div>
);
