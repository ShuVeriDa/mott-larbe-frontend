"use client";

import { usePhrasebookCategories } from "@/entities/phrasebook";
import { usePhrasebookParams } from "@/features/phrasebook-filters";
import { PhrasebookCategoryChip } from "./phrasebook-category-chip";

export const PhrasebookCategoryChips = () => {
	const { data: categories } = usePhrasebookCategories();
	const { categoryId, setCategoryId } = usePhrasebookParams();

	if (!categories?.length) return null;

	return (
		<div className="flex overflow-x-auto gap-1.5 px-3.5 py-2 bg-surf border-b border-bd-1 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{categories.map(cat => (
				<PhrasebookCategoryChip
					key={cat.id}
					category={cat}
					active={categoryId === cat.id}
					onSelect={setCategoryId}
				/>
			))}
		</div>
	);
};
