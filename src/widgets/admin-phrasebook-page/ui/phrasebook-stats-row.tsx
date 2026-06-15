"use client";

import { cn } from "@/shared/lib/cn";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface PhrasebookStatsRowProps {
	categoriesCount: number;
	phrasesTotal: number;
	suggestionsCount: number;
	isLoading: boolean;
	t: (key: string) => string;
}

export const PhrasebookStatsRow = ({
	categoriesCount,
	phrasesTotal,
	suggestionsCount,
	isLoading,
	t,
}: PhrasebookStatsRowProps) => {
	if (isLoading) {
		return (
			<div className="mb-5 grid grid-cols-3 gap-2.5 max-sm:grid-cols-3 max-sm:gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-3 gap-2.5 max-sm:gap-2">
			<AdminStatCard
				label={t("adminPhrasebook.stats.categories")}
				value={categoriesCount}
				sub={t("adminPhrasebook.stats.categoriesSub")}
			/>
			<AdminStatCard
				label={t("adminPhrasebook.stats.phrases")}
				value={phrasesTotal}
				sub={t("adminPhrasebook.stats.phrasesSub")}
				valueClassName="text-acc"
			/>
			<AdminStatCard
				label={t("adminPhrasebook.stats.suggestions")}
				value={suggestionsCount}
				sub={t("adminPhrasebook.stats.suggestionsSub")}
				valueClassName={cn(suggestionsCount > 0 && "text-amb")}
			/>
		</div>
	);
};
