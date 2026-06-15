import { cn } from "@/shared/lib/cn";
import type { AdminDictStats } from "@/entities/dictionary";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface DictionaryStatsRowProps {
	stats: AdminDictStats | undefined;
	isLoading: boolean;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryStatsRow = ({ stats, isLoading, t }: DictionaryStatsRowProps) => {
	if (isLoading) {
		return (
			<div className="mb-4 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => <AdminStatCardSkeleton key={i} />)}
			</div>
		);
	}
	if (!stats) return null;

	return (
		<div className="mb-4 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
			<AdminStatCard
				label={t("admin.dictionary.stats.total")}
				value={stats.totalEntries.toLocaleString()}
				sub={t("admin.dictionary.stats.totalSub")}
			/>
			<AdminStatCard
				label={t("admin.dictionary.stats.lemmas")}
				value={stats.totalLemmas.toLocaleString()}
				sub={t("admin.dictionary.stats.lemmasSub")}
			/>
			<AdminStatCard
				label={t("admin.dictionary.stats.senses")}
				value={stats.totalSenses.toLocaleString()}
				sub={t("admin.dictionary.stats.sensesSub")}
			/>
			<AdminStatCard
				label={t("admin.dictionary.stats.forms")}
				value={stats.totalMorphForms.toLocaleString()}
				sub={t("admin.dictionary.stats.formsSub")}
			/>
			<AdminStatCard
				label={t("admin.dictionary.stats.withoutSenses")}
				value={stats.entriesWithoutSenses.toLocaleString()}
				sub={t("admin.dictionary.stats.withoutSensesSub")}
				valueClassName={cn(stats.entriesWithoutSenses > 0 && "text-red")}
			/>
		</div>
	);
};
