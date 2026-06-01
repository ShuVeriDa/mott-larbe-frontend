"use client";

import type { PhrasebookCategory } from "@/entities/phrasebook";
import { cn } from "@/shared/lib/cn";

export interface PhrasebookCategoryChipProps {
	category: PhrasebookCategory;
	active: boolean;
	onSelect: (id: string | null) => void;
}

export const PhrasebookCategoryChip = ({
	category,
	active,
	onSelect,
}: PhrasebookCategoryChipProps) => {
	const handleClick = () => onSelect(active ? null : category.id);

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"inline-flex items-center gap-1 h-9 px-2.5 rounded-[20px]",
				"whitespace-nowrap text-[12px] font-medium font-[inherit]",
				"shrink-0 border-[0.5px] cursor-pointer transition-all duration-150 motion-reduce:transition-none",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1",
				active
					? "bg-acc-bg text-acc-t border-transparent"
					: "bg-surf-2 border-bd-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
			)}
		>
			<span className="text-[13px] leading-none">{category.emoji}</span>
			{category.name}
		</button>
	);
};
