"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminTextsStats } from "@/entities/admin-text";

interface TextsStatsRowProps {
	stats: AdminTextsStats | undefined;
	isLoading: boolean;
}

const StatCard = ({
	label,
	value,
	sub,
	valueClass,
}: {
	label: string;
	value: string | number;
	sub?: string;
	valueClass?: string;
}) => (
	<div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3 transition-colors">
		<div className="mb-1.5 text-[10.5px] font-medium tracking-[0.3px] text-t-3">{label}</div>
		<div className={`text-[20px] font-semibold leading-none text-t-1 ${valueClass ?? ""}`}>
			{value}
		</div>
		{sub && <div className="mt-1 text-[10.5px] text-t-3">{sub}</div>}
	</div>
);

const StatSkeleton = () => (
	<div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3">
		<div className="mb-1.5 h-2.5 w-20 animate-pulse rounded bg-surf-3" />
		<div className="h-6 w-10 animate-pulse rounded bg-surf-3" />
		<div className="mt-1 h-2 w-16 animate-pulse rounded bg-surf-3" />
	</div>
);

export const TextsStatsRow = ({ stats, isLoading }: TextsStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2 [&>:last-child]:max-sm:col-span-full">
				{Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2 [&>:last-child]:max-sm:col-span-full">
			<StatCard
				label={t("admin.texts.stats.total")}
				value={stats.totalCount}
				sub={t("admin.texts.stats.totalSub", { count: stats.totalGrowthPerMonth })}
			/>
			<StatCard
				label={t("admin.texts.stats.published")}
				value={stats.publishedCount}
				sub={t("admin.texts.stats.publishedSub", { percent: Math.round(stats.publishedPercent) })}
				valueClass="text-grn"
			/>
			<StatCard
				label={t("admin.texts.stats.drafts")}
				value={stats.draftCount}
				sub={t("admin.texts.stats.draftsSub")}
				valueClass="text-amb"
			/>
			<StatCard
				label={t("admin.texts.stats.processing")}
				value={stats.processingCount}
				sub={t("admin.texts.stats.processingSub")}
				valueClass="text-acc"
			/>
			<StatCard
				label={t("admin.texts.stats.errors")}
				value={stats.errorCount}
				sub={t("admin.texts.stats.errorsSub")}
				valueClass="text-red"
			/>
		</div>
	);
};
