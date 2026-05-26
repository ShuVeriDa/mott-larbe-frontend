"use client";

interface StatCardProps {
	label: string;
	value: string | number;
	sub?: string;
	valueClass?: string;
}

const StatCard = ({ label, value, sub, valueClass }: StatCardProps) => (
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

interface PhrasebookStatsRowProps {
	categoriesCount: number;
	phrasesTotal: number;
	suggestionsCount: number;
	isLoading: boolean;
	t: (key: string) => string;
}

export const PhrasebookStatsRow = ({
	categoriesCount,
	phrasesTotal,
	suggestionsCount,
	isLoading,
	t,
}: PhrasebookStatsRowProps) => {
	if (isLoading) {
		return (
			<div className="mb-5 grid grid-cols-3 gap-2.5 max-sm:grid-cols-3 max-sm:gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<StatSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-3 gap-2.5 max-sm:gap-2">
			<StatCard
				label={t("adminPhrasebook.stats.categories")}
				value={categoriesCount}
				sub={t("adminPhrasebook.stats.categoriesSub")}
			/>
			<StatCard
				label={t("adminPhrasebook.stats.phrases")}
				value={phrasesTotal}
				sub={t("adminPhrasebook.stats.phrasesSub")}
				valueClass="text-acc"
			/>
			<StatCard
				label={t("adminPhrasebook.stats.suggestions")}
				value={suggestionsCount}
				sub={t("adminPhrasebook.stats.suggestionsSub")}
				valueClass={suggestionsCount > 0 ? "text-amb" : ""}
			/>
		</div>
	);
};
