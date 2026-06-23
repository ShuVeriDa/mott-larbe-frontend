"use client";

import { usePhrasebookStats } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { PhrasebookStatItem } from "./phrasebook-stat-item";

interface PhrasebookOverviewProps {
	categoriesCount?: number;
	onSuggest: () => void;
}

export const PhrasebookOverview = ({
	categoriesCount,
	onSuggest,
}: PhrasebookOverviewProps) => {
	const { t } = useI18n();
	const { data, isLoading } = usePhrasebookStats();

	return (
		<div className="flex items-center gap-2 px-3.5 py-2.5 bg-surf border-[0.5px] border-bd-1 rounded-card shrink-0 animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none" style={{ animationDuration: "300ms", animationFillMode: "both" }}>
			<PhrasebookStatItem
				value={isLoading ? null : (data?.totalPhrases ?? 0)}
				label={t("phrasebook.overview.phrases")}
			/>
			<div className="w-px h-[22px] bg-bd-2 mx-1 shrink-0" />
			<PhrasebookStatItem
				value={isLoading ? null : (data?.savedCount ?? 0)}
				label={t("phrasebook.overview.saved")}
			/>
			<div className="w-px h-[22px] bg-bd-2 mx-1 shrink-0" />
			<PhrasebookStatItem
				value={
					isLoading ? null : (categoriesCount ?? data?.totalCategories ?? 0)
				}
				label={t("phrasebook.overview.categories")}
			/>
			<div className="ml-auto">
				<Button variant="ghost" size="default" onClick={onSuggest}>
					{t("phrasebook.overview.suggest")}
				</Button>
			</div>
		</div>
	);
};
