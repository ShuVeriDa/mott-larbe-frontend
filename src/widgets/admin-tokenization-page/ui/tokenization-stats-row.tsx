"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { TokenizationStats } from "@/entities/token";

interface TokenizationStatsRowProps {
	stats: TokenizationStats | undefined;
}

const StatCard = ({
	label,
	value,
	sub,
	valueColor,
}: {
	label: string;
	value: string | number;
	sub?: string;
	valueColor?: string;
}) => (
	<div className="rounded-card border border-bd-1 bg-surf px-3.5 py-3">
		<div className="mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.3px] text-t-3">
			{label}
		</div>
		<div className={`text-[20px] font-semibold leading-none ${valueColor ?? "text-t-1"}`}>
			{value}
		</div>
		{sub && <div className="mt-1 text-[10.5px] text-t-3">{sub}</div>}
	</div>
);

const StatSkeleton = () => (
	<div className="rounded-card border border-bd-1 bg-surf px-3.5 py-3">
		<div className="mb-2 h-2 w-16 animate-pulse rounded bg-surf-3" />
		<div className="h-6 w-12 animate-pulse rounded bg-surf-3" />
		<div className="mt-1.5 h-2 w-20 animate-pulse rounded bg-surf-3" />
	</div>
);

export const TokenizationStatsRow = ({ stats }: TokenizationStatsRowProps) => {
	const { t } = useI18n();

	if (!stats) {
		return (
			<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<StatSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
			<StatCard
				label={t("admin.tokenization.stats.total")}
				value={stats.totalTokens.toLocaleString()}
				sub={t("admin.tokenization.stats.totalSub")}
			/>
			<StatCard
				label={t("admin.tokenization.stats.analyzed")}
				value={stats.analyzedCount.toLocaleString()}
				sub={`${stats.analyzedPercent}%`}
				valueColor="text-grn-t"
			/>
			<StatCard
				label={t("admin.tokenization.stats.ambiguous")}
				value={stats.ambiguousCount.toLocaleString()}
				sub={`${stats.ambiguousPercent}%`}
				valueColor="text-amb-t"
			/>
			<StatCard
				label={t("admin.tokenization.stats.notFound")}
				value={stats.notFoundCount.toLocaleString()}
				sub={`${stats.notFoundPercent}%`}
				valueColor="text-red-t"
			/>
			<StatCard
				label={t("admin.tokenization.stats.unprocessed")}
				value={stats.textsWithoutProcessing}
				sub={t("admin.tokenization.stats.unprocessedSub")}
			/>
		</div>
	);
};
