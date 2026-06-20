"use client";

import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { PendingHeritageItem } from "@/entities/heritage";

interface ModerationListItemProps {
	item: PendingHeritageItem;
	isSelected: boolean;
	onSelect: (item: PendingHeritageItem) => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const ModerationListItem = ({
	item,
	isSelected,
	onSelect,
	t,
}: ModerationListItemProps) => {
	const handleClick = () => onSelect(item);
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect(item);
		}
	};

	const typeLabel = item.type === "TAIP"
		? t("admin.heritage.moderation.typeTaip")
		: t("admin.heritage.moderation.typeGara");

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"flex cursor-pointer flex-col gap-1 border-b border-bd-1 px-4 py-3 transition-colors duration-150 ease-out",
				"hover:bg-surf-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-acc",
				isSelected && "bg-surf-2",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<Typography tag="p" className="truncate text-[13px] font-medium text-t-1">
					{item.customValue}
				</Typography>
				<span
					className={cn(
						"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
						item.type === "TAIP"
							? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
							: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
					)}
				>
					{typeLabel}
				</span>
			</div>
			<Typography tag="p" className="truncate text-[11px] text-t-3">
				{item.username ? `@${item.username}` : item.userId}
			</Typography>
			{item.nationName && (
				<Typography tag="p" className="text-[11px] text-t-4">
					{item.nationName.ru}
					{item.tukhumName ? ` · ${item.tukhumName.ru}` : ""}
				</Typography>
			)}
		</div>
	);
};
