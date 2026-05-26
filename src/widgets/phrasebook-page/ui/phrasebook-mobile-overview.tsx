"use client";

import {
	usePhrasebookCategories,
	usePhrasebookStats,
} from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Skeleton } from "@/shared/ui/skeleton";

export const PhrasebookMobileOverview = () => {
	const { t } = useI18n();
	const { data: stats, isLoading } = usePhrasebookStats();
	const { data: categories } = usePhrasebookCategories();

	return (
		<div className="flex gap-2 px-3.5 py-2 bg-surf border-b border-bd-1 overflow-x-auto shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<MobileStatItem
				value={isLoading ? null : (stats?.totalPhrases ?? 0)}
				label={t("phrasebook.overview.phrases")}
			/>
			<MobileStatItem
				value={isLoading ? null : (stats?.savedCount ?? 0)}
				label={t("phrasebook.overview.saved")}
			/>
			<MobileStatItem
				value={
					isLoading ? null : (categories?.length ?? stats?.totalCategories ?? 0)
				}
				label={t("phrasebook.overview.categories")}
			/>
		</div>
	);
};

interface MobileStatItemProps {
	value: number | null;
	label: string;
}

const MobileStatItem = ({ value, label }: MobileStatItemProps) => (
	<div className="flex flex-col items-center bg-surf-2 border-[0.5px] border-bd-1 rounded-lg px-3.5 py-1.5 shrink-0">
		{value === null ? (
			<Skeleton className="w-6 h-4 rounded mb-0.5" />
		) : (
			<span className="font-display text-[17px] text-t-1 leading-none">
				{value}
			</span>
		)}
		<span className="text-[10px] text-t-3 mt-0.5 whitespace-nowrap">
			{label}
		</span>
	</div>
);
