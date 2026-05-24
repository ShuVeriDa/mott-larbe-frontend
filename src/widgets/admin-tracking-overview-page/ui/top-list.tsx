import type { AnalyticsPageItem, AnalyticsTopReferrerItem } from "@/features/admin-analytics";
import { DIRECT_REFERRER_KEY } from "@/features/admin-analytics";
import { formatNumber } from "../lib/format";

type Item = Pick<AnalyticsPageItem, "key" | "count"> | Pick<AnalyticsTopReferrerItem, "key" | "count">;

interface TopListProps {
	items: Item[] | undefined;
	loading: boolean;
	noData: string;
	direct: string;
}

export const TopList = ({ items, loading, noData, direct }: TopListProps) => {
	if (loading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-2">
						<div className="h-6 flex-1 animate-pulse rounded bg-surf-3" />
						<div className="h-3 w-8 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	if (!items?.length) {
		return <p className="text-[12px] text-t-3">{noData}</p>;
	}

	const max = items[0]?.count ?? 1;

	return (
		<ol className="flex flex-col gap-0.5">
			{items.map((item) => {
				const label = item.key === DIRECT_REFERRER_KEY ? direct : item.key;
				const barPct = Math.round((item.count / max) * 100);
				return (
					<li key={item.key} className="flex items-center gap-2 text-[12px]">
						<div className="relative min-w-0 flex-1">
							<div
								className="absolute inset-y-0 left-0 rounded-sm bg-acc/10 transition-all"
								style={{ width: `${barPct}%` }}
							/>
							<span className="relative truncate px-1.5 py-1 font-mono text-[11px] text-t-1">
								{label}
							</span>
						</div>
						<span className="shrink-0 font-mono text-[11.5px] text-t-3">
							{formatNumber(item.count)}
						</span>
					</li>
				);
			})}
		</ol>
	);
};
