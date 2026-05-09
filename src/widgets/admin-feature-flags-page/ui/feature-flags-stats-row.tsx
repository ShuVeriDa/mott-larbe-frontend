import { cn } from "@/shared/lib/cn";
import type { FeatureFlagStats } from "@/entities/feature-flag";

import { Typography } from "@/shared/ui/typography";
interface StatCardProps {
	label: string;
	value: string | number;
	sub?: string;
	subVariant?: "default" | "green" | "red";
}

const StatCard = ({ label, value, sub, subVariant = "default" }: StatCardProps) => (
	<div className="rounded-[10px] border border-bd-1 bg-surf p-3 transition-colors">
		<Typography tag="p" className="mb-1.5 text-[10.5px] font-medium tracking-[0.3px] text-t-3">{label}</Typography>
		<Typography tag="p" className="mb-0.5 text-[22px] font-semibold leading-none text-t-1">{value}</Typography>
		{sub && (
			<Typography tag="p"
				className={cn(
					"text-[11px]",
					subVariant === "green" && "text-grn-t",
					subVariant === "red" && "text-red-t",
					subVariant === "default" && "text-t-3",
				)}
			>
				{sub}
			</Typography>
		)}
	</div>
);

const SkeletonCard = () => (
	<div className="rounded-[10px] border border-bd-1 bg-surf p-3">
		<div className="mb-2 h-3 w-20 animate-pulse rounded bg-surf-3" />
		<div className="mb-1 h-6 w-12 animate-pulse rounded bg-surf-3" />
		<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
	</div>
);

interface FeatureFlagsStatsRowProps {
	stats: FeatureFlagStats | undefined;
	isLoading: boolean;
	t: (key: string, params?: Record<string, string | number>) => string;
}

export const FeatureFlagsStatsRow = ({ stats, isLoading, t }: FeatureFlagsStatsRowProps) => {
	if (isLoading) {
		return (
			<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<SkeletonCard key={i} />
				))}
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<StatCard
				label={t("admin.featureFlags.stats.total")}
				value={stats.totalFlags}
				sub={t("admin.featureFlags.stats.categories", { count: stats.categoriesCount })}
			/>
			<StatCard
				label={t("admin.featureFlags.stats.enabled")}
				value={stats.enabledGlobalCount}
				sub={`${stats.enabledGlobalPercent}%`}
				subVariant={stats.enabledGlobalPercent > 50 ? "green" : "default"}
			/>
			<StatCard
				label={t("admin.featureFlags.stats.overrides")}
				value={stats.overridesCount}
				sub={t("admin.featureFlags.stats.overridesUsers", { count: stats.overridesUsersCount })}
			/>
			<StatCard
				label={t("admin.featureFlags.stats.prodOnly")}
				value={stats.prodOnlyCount}
				sub={t("admin.featureFlags.stats.prodOnlySub")}
			/>
		</div>
	);
};
