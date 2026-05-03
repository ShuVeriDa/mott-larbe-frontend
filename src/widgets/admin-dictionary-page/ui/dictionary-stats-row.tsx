import { cn } from "@/shared/lib/cn";
import type { AdminDictStats } from "@/entities/dictionary";

interface StatCardProps {
	label: string;
	value: string | number;
	sub?: string;
	subVariant?: "default" | "red";
}

const StatCard = ({ label, value, sub, subVariant = "default" }: StatCardProps) => (
	<div className="rounded-[10px] border border-bd-1 bg-surf p-3 transition-colors">
		<p className="mb-1.5 text-[10.5px] font-medium tracking-[0.3px] text-t-3">{label}</p>
		<p className="mb-0.5 text-[22px] font-semibold leading-none text-t-1">{value}</p>
		{sub && (
			<p className={cn("text-[11px]", subVariant === "red" ? "text-red-t" : "text-t-3")}>{sub}</p>
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

interface DictionaryStatsRowProps {
	stats: AdminDictStats | undefined;
	isLoading: boolean;
	t: (key: string, params?: Record<string, unknown>) => string;
}

export const DictionaryStatsRow = ({ stats, isLoading, t }: DictionaryStatsRowProps) => {
	if (isLoading) {
		return (
			<div className="mb-4 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
			</div>
		);
	}
	if (!stats) return null;

	return (
		<div className="mb-4 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
			<StatCard
				label={t("admin.dictionary.stats.total")}
				value={stats.totalEntries.toLocaleString()}
				sub={t("admin.dictionary.stats.totalSub")}
			/>
			<StatCard
				label={t("admin.dictionary.stats.lemmas")}
				value={stats.totalLemmas.toLocaleString()}
				sub={t("admin.dictionary.stats.lemmasSub")}
			/>
			<StatCard
				label={t("admin.dictionary.stats.senses")}
				value={stats.totalSenses.toLocaleString()}
				sub={t("admin.dictionary.stats.sensesSub")}
			/>
			<StatCard
				label={t("admin.dictionary.stats.forms")}
				value={stats.totalMorphForms.toLocaleString()}
				sub={t("admin.dictionary.stats.formsSub")}
			/>
			<StatCard
				label={t("admin.dictionary.stats.withoutSenses")}
				value={stats.entriesWithoutSenses.toLocaleString()}
				sub={t("admin.dictionary.stats.withoutSensesSub")}
				subVariant={stats.entriesWithoutSenses > 0 ? "red" : "default"}
			/>
		</div>
	);
};
