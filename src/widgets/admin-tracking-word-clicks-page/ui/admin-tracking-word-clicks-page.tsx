"use client";

import { useAdminAnalyticsTopWordClicks, useAnalyticsRange, useInvalidateAdminAnalytics } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/locales";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingWordClicksPageProps {
	lang: Locale;
	dict: TrackingDict;
}

export const AdminTrackingWordClicksPage = ({ lang, dict }: AdminTrackingWordClicksPageProps) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const invalidate = useInvalidateAdminAnalytics();

	const query = useAdminAnalyticsTopWordClicks({ from: range.from, to: range.to, limit: 100 });
	const items = query.data ?? [];
	const max = items[0]?.count ?? 1;

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.wordClicks.title}</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="wordClicks" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
					<Table aria-label={dict.wordClicks.title}>
						<TableHeader>
							<TableRow className="border-b border-bd-1">
								<TableHead className="w-10 px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									#
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.wordClicks.word}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.wordClicks.clicks}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.isLoading
								? Array.from({ length: 20 }).map((_, i) => (
										<TableRow key={i} className="border-b border-bd-1">
											<TableCell className="px-3.5 py-[10px]">
												<div className="h-3 w-5 animate-pulse rounded bg-surf-3" />
											</TableCell>
											<TableCell className="px-3.5 py-[10px]">
												<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right">
												<div className="ml-auto h-3 w-12 animate-pulse rounded bg-surf-3" />
											</TableCell>
										</TableRow>
									))
								: items.map((item, idx) => {
										const barPct = Math.round((item.count / max) * 100);
										return (
											<TableRow
												key={item.word}
												className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
											>
												<TableCell className="px-3.5 py-[10px] text-[12px] text-t-3">
													{idx + 1}
												</TableCell>
												<TableCell className="px-3.5 py-[10px]">
													<div className="relative">
														<div
															className="absolute inset-y-0 left-0 rounded-sm bg-acc/10"
															style={{ width: `${barPct}%` }}
														/>
														<span className="relative text-[12.5px] font-medium text-t-1">
															{item.word}
														</span>
													</div>
												</TableCell>
												<TableCell className="px-3.5 py-[10px] text-right font-mono text-[12px] text-t-3">
													{item.count.toLocaleString()}
												</TableCell>
											</TableRow>
										);
									})}
							{!query.isLoading && items.length === 0 && (
								<TableRow>
									<TableCell colSpan={3} className="px-4 py-10 text-center text-[12px] text-t-3">
										{dict.wordClicks.noData}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};
