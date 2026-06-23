"use client";

import {
	usePhrasebookCategories,
	usePhrasebookStats,
} from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { PhrasebookMobileStatItem } from "./phrasebook-mobile-stat-item";

export const PhrasebookMobileOverview = () => {
	const { t } = useI18n();
	const { data: stats, isLoading } = usePhrasebookStats();
	const { data: categories } = usePhrasebookCategories();

	return (
		<div className="flex gap-2 px-3.5 py-2 bg-surf border-b border-bd-1 overflow-x-auto shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<PhrasebookMobileStatItem
				index={0}
				value={isLoading ? null : (stats?.totalPhrases ?? 0)}
				label={t("phrasebook.overview.phrases")}
			/>
			<PhrasebookMobileStatItem
				index={1}
				value={isLoading ? null : (stats?.savedCount ?? 0)}
				label={t("phrasebook.overview.saved")}
			/>
			<PhrasebookMobileStatItem
				index={2}
				value={
					isLoading ? null : (categories?.length ?? stats?.totalCategories ?? 0)
				}
				label={t("phrasebook.overview.categories")}
			/>
		</div>
	);
};
