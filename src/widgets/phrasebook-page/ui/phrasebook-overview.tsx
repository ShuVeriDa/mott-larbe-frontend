"use client";

import { usePhrasebookStats } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

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
		<div className="flex items-center gap-2 px-3.5 py-2.5 bg-surf border-[0.5px] border-bd-1 rounded-card shrink-0  ">
			<StatItem
				value={isLoading ? null : (data?.totalPhrases ?? 0)}
				label={t("phrasebook.overview.phrases")}
			/>
			<div className="w-px h-[22px] bg-bd-2 mx-1 shrink-0" />
			<StatItem
				value={isLoading ? null : (data?.savedCount ?? 0)}
				label={t("phrasebook.overview.saved")}
			/>
			<div className="w-px h-[22px] bg-bd-2 mx-1 shrink-0" />
			<StatItem
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

interface StatItemProps {
	value: number | null;
	label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
	<div className="flex items-center gap-1.5">
		{value === null ? (
			<Skeleton className="w-6 h-5 rounded" />
		) : (
			<span className="font-display text-[18px] text-t-1 leading-none">
				{value}
			</span>
		)}
		<span className="text-[11.5px] text-t-2">{label}</span>
	</div>
);
