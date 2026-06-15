"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import { useState } from "react";
import { useAdminAnalyticsPages, useAnalyticsRange, useInvalidateAdminAnalytics } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/types";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import type { ComponentProps } from "react";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingPagesPageProps {
	lang: Locale;
	dict: TrackingDict;
}

export const AdminTrackingPagesPage = ({ lang, dict }: AdminTrackingPagesPageProps) => {
	const [search, setSearch] = useState("");
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const invalidate = useInvalidateAdminAnalytics();

	const query = useAdminAnalyticsPages({ from: range.from, to: range.to, search, limit: 50 });
	const items = query.data?.pages.flatMap((p) => p.items) ?? [];
	const total = query.data?.pages[0]?.total ?? 0;

	const handleSearchChange: ComponentProps<"input">["onChange"] = (e) =>
		setSearch(e.currentTarget.value);
	const handleLoadMore = () => query.fetchNextPage();

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.pages.title}</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="pages" dict={dict.tabs} />

				<div className="mt-4 mb-4 flex flex-wrap items-center gap-3">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				<div className="mb-3.5">
					<Input
						placeholder={dict.pages.search}
						value={search}
						onChange={handleSearchChange}
						className="max-w-sm h-[30px] text-[12px]"
					/>
				</div>

				<AdminCard>
					<Table aria-label={dict.pages.title}>
						<TableHeader>
							<TableRow className="border-b border-bd-1">
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2">
									{dict.pages.path}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2">
									{dict.pages.views}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.isLoading
								? Array.from({ length: 12 }).map((_, i) => (
										<TableRow key={i} className="border-b border-bd-1">
											<TableCell className="px-3.5 py-[10px]">
												<div className="h-3 w-64 animate-pulse rounded bg-surf-3" />
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
												{item.key}
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right font-mono text-[11.5px] text-t-3">
												{item.count.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
							{!query.isLoading && items.length === 0 && (
								<TableRow>
									<TableCell colSpan={2} className="px-4 py-10 text-center text-[12px] text-t-3">
										{dict.pages.noData}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</AdminCard>

				{query.hasNextPage && items.length < total && (
					<div className="mt-3.5 flex justify-center">
						<Button
							onClick={handleLoadMore}
							disabled={query.isFetchingNextPage}
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
