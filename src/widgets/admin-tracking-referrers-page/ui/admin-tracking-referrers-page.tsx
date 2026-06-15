"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import {
	useAdminAnalyticsReferrersBreakdown,
	useAdminAnalyticsTopReferrersInfinite,
	useAnalyticsRange,
	useInvalidateAdminAnalytics,
	DIRECT_REFERRER_KEY,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/types";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Button } from "@/shared/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingReferrersPageProps {
	lang: Locale;
	dict: TrackingDict;
}

const CATEGORIES = ["search", "direct", "social", "other"] as const;

export const AdminTrackingReferrersPage = ({ lang, dict }: AdminTrackingReferrersPageProps) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const invalidate = useInvalidateAdminAnalytics();

	const breakdown = useAdminAnalyticsReferrersBreakdown({ from: range.from, to: range.to });
	const referrers = useAdminAnalyticsTopReferrersInfinite({ from: range.from, to: range.to, limit: 50 });

	const items = referrers.data?.pages.flatMap((p) => p) ?? [];
	const bd = breakdown.data;

	const handleLoadMore = () => referrers.fetchNextPage();

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.referrers.title}</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="referrers" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				{bd && (
					<div className="mb-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 max-sm:gap-2">
						{CATEGORIES.map((cat) => {
							const stats = bd.byCategory[cat];
							return (
								<AdminCard key={cat} className="p-3.5">
									<p className="mb-1.5 text-[11px] font-medium tracking-[0.3px] text-t-3">
										{dict.referrers.categories[cat]}
									</p>
									<p className="mb-1 text-[22px] font-semibold leading-none text-t-1">
										{stats.count.toLocaleString()}
									</p>
									<p className="text-[11px] text-t-3">
										{(stats.share * 100).toFixed(1)}%
									</p>
								</AdminCard>
							);
						})}
					</div>
				)}

				<AdminCard>
					<Table aria-label={dict.referrers.title}>
						<TableHeader>
							<TableRow className="border-b border-bd-1">
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2">
									{dict.referrers.host}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2">
									{dict.referrers.visits}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{referrers.isLoading
								? Array.from({ length: 10 }).map((_, i) => (
										<TableRow key={i} className="border-b border-bd-1">
											<TableCell className="px-3.5 py-[10px]">
												<div className="h-3 w-48 animate-pulse rounded bg-surf-3" />
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right">
												<div className="ml-auto h-3 w-12 animate-pulse rounded bg-surf-3" />
											</TableCell>
										</TableRow>
									))
								: items.map((item) => (
										<TableRow
											key={item.key}
											className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
										>
											<TableCell className="px-3.5 py-[10px] font-mono text-[11.5px] text-t-1">
												{item.key === DIRECT_REFERRER_KEY ? dict.common.direct : item.key}
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right font-mono text-[11.5px] text-t-3">
												{item.count.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
							{!referrers.isLoading && items.length === 0 && (
								<TableRow>
									<TableCell colSpan={2} className="px-4 py-10 text-center text-[12px] text-t-3">
										{dict.referrers.noData}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</AdminCard>

				{referrers.hasNextPage && (
					<div className="mt-3.5 flex justify-center">
						<Button
							onClick={handleLoadMore}
							disabled={referrers.isFetchingNextPage}
							title={dict.pages.loadMore}
							className="flex h-[30px] items-center rounded-base border border-bd-2 bg-transparent px-3 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:opacity-40"
						>
							{dict.pages.loadMore}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
