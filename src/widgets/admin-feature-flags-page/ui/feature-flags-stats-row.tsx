import { cn } from "@/shared/lib/cn";
import type { FeatureFlagStats } from "@/entities/feature-flag";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

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
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<AdminStatCard
				label={t("admin.featureFlags.stats.total")}
				value={stats.totalFlags}
				sub={t("admin.featureFlags.stats.categories", { count: stats.categoriesCount })}
			/>
			<AdminStatCard
				label={t("admin.featureFlags.stats.enabled")}
				value={stats.enabledGlobalCount}
				sub={`${stats.enabledGlobalPercent}%`}
				valueClassName={cn(stats.enabledGlobalPercent > 50 && "text-grn")}
			/>
			<AdminStatCard
				label={t("admin.featureFlags.stats.overrides")}
				value={stats.overridesCount}
				sub={t("admin.featureFlags.stats.overridesUsers", { count: stats.overridesUsersCount })}
			/>
			<AdminStatCard
				label={t("admin.featureFlags.stats.prodOnly")}
				value={stats.prodOnlyCount}
				sub={t("admin.featureFlags.stats.prodOnlySub")}
			/>
		</div>
	);
};
