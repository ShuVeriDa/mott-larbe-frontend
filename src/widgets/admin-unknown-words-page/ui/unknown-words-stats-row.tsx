"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordsStats } from "@/entities/unknown-word";

interface StatCardProps {
	label: string;
	value: number | string;
	sub: string;
	valueColor?: string;
}

const StatCard = ({ label, value, sub, valueColor }: StatCardProps) => (
	<div className="rounded-[10px] border border-bd-1 bg-surf px-3 py-[11px]">
		<div className="mb-1 text-[10.5px] font-medium text-t-3">{label}</div>
		<div
			className={`text-[20px] font-semibold leading-none ${valueColor ?? "text-t-1"}`}
		>
			{typeof value === "number" ? value.toLocaleString("ru-RU") : value}
		</div>
		<div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>
	</div>
);

interface UnknownWordsStatsRowProps {
	stats: UnknownWordsStats | undefined;
	isLoading: boolean;
}

export const UnknownWordsStatsRow = ({
	stats,
	isLoading,
}: UnknownWordsStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-3.5 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="h-[68px] animate-pulse rounded-[10px] bg-surf"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="mb-3.5 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
			<StatCard
				label={t("admin.unknownWords.stats.totalPending")}
				value={stats.totalPending}
				sub={t("admin.unknownWords.stats.totalPendingSub")}
				valueColor="text-amb"
			/>
			<StatCard
				label={t("admin.unknownWords.stats.addedToDictionary")}
				value={stats.totalAddedToDictionary}
				sub={t("admin.unknownWords.stats.addedToDictionarySub")}
			/>
			<StatCard
				label={t("admin.unknownWords.stats.encounteredToday")}
				value={stats.encounteredToday}
				sub={t("admin.unknownWords.stats.encounteredTodaySub", {
					count: stats.textsToday,
				})}
			/>
			<StatCard
				label={t("admin.unknownWords.stats.deleted")}
				value={stats.totalDeleted}
				sub={t("admin.unknownWords.stats.deletedSub")}
			/>
		</div>
	);
};
