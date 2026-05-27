"use client";

import {
	usePhrasebookCategories,
	type PhrasebookCategory,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { cn } from "@/shared/lib/cn";

export const PhrasebookCategoryChips = () => {
	const { data: categories } = usePhrasebookCategories();
	const { activeCategoryId, setActiveCategoryId } = usePhrasebookFilters();

	if (!categories?.length) return null;

	return (
		<div className="flex overflow-x-auto gap-1.5 px-3.5 py-2 bg-surf border-b border-bd-1 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{categories.map(cat => (
				<CategoryChip
					key={cat.id}
					category={cat}
					active={activeCategoryId === cat.id}
					onSelect={setActiveCategoryId}
				/>
			))}
		</div>
	);
};

interface CategoryChipProps {
	category: PhrasebookCategory;
	active: boolean;
	onSelect: (id: string | null) => void;
}

const CategoryChip = ({ category, active, onSelect }: CategoryChipProps) => {
	const handleClick = () => onSelect(active ? null : category.id);

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"inline-flex items-center gap-1 h-7 px-2.5 rounded-[20px]",
				"whitespace-nowrap text-[12px] font-medium font-[inherit]",
				"shrink-0 border-[0.5px] cursor-pointer transition-all duration-150",
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
