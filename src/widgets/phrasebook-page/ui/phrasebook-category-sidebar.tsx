"use client";

import {
	usePhrasebookCategories,
	usePhraseCategoryProgress,
	type PhraseCategoryProgress,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";
import { Skeleton } from "@/shared/ui/skeleton";
import { PhrasebookCategoryItem } from "./phrasebook-category-item";

export const PhrasebookCategorySidebar = () => {
	const { t } = useI18n();
	const { data: categories, isLoading } = usePhrasebookCategories();
	const { data: progressList } = usePhraseCategoryProgress();
	const { activeCategoryId, setActiveCategoryId } = usePhrasebookFilters();

	const progressMap = new Map<string, PhraseCategoryProgress>(
		progressList?.map(p => [p.id, p]) ?? [],
	);

	return (
		<nav aria-label={t("phrasebook.categories.title")} className="w-[200px] shrink-0 bg-surf border-[0.5px] border-bd-1 rounded-card overflow-hidden flex flex-col h-full">
			<h2 className="px-3 py-2.5 border-b border-bd-1 text-[10px] font-semibold text-t-3 uppercase tracking-[0.6px]">
				{t("phrasebook.categories.title")}
			</h2>
			<div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
				{isLoading
					? Array.from({ length: 6 }, (_, i) => (
							<div key={i} className="flex items-center gap-2 px-3 py-2">
								<Skeleton className="w-4 h-4 rounded" />
								<Skeleton className="flex-1 h-3 rounded" />
							</div>
						))
					: categories?.map(cat => (
							<PhrasebookCategoryItem
								key={cat.id}
								category={cat}
								progress={progressMap.get(cat.id)}
								active={activeCategoryId === cat.id}
								onSelect={setActiveCategoryId}
							/>
						))}
			</div>
		</nav>
	);
};
