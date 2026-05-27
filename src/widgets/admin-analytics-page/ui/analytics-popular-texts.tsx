"use client";

import type { PopularBy, PopularTextItem } from "@/entities/admin-analytics";
import { CEFR_LEVEL_BADGE_CLASS } from "@/shared/lib/cefr-colors";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { AdminCard } from "@/shared/ui/admin-card";
import { AdminTabStrip, type AdminTabStripItem } from "@/shared/ui/admin-tab-strip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Typography } from "@/shared/ui/typography";

const TABS: PopularBy[] = ["opens", "complete", "saved"];

interface AnalyticsPopularTextsProps {
	tab: PopularBy;
	items?: PopularTextItem[];
	isLoading?: boolean;
	onTabChange: (tab: PopularBy) => void;
}

export const AnalyticsPopularTexts = ({
	tab,
	items,
	isLoading,
	onTabChange,
}: AnalyticsPopularTextsProps) => {
	const { t } = useI18n();

	const tabItems: AdminTabStripItem<PopularBy>[] = TABS.map(tb => ({
		key: tb,
		label: t(`admin.analytics.popularTexts.tab${tb.charAt(0).toUpperCase() + tb.slice(1)}`),
	}));

	return (
		<AdminCard>
			<div className="px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.popularTexts.title")}
				</Typography>
				<Typography tag="span" className="ml-2 text-[11px] text-t-3">
					{t("admin.analytics.popularTexts.subtitle")}
				</Typography>
			</div>

			<AdminTabStrip tabs={tabItems} activeTab={tab} onTabChange={onTabChange} />

			<div className="overflow-x-auto">
				<Table className="text-[12.5px]" aria-label={t("admin.analytics.popularTexts.title")}>
					<TableHeader>
						<TableRow className="border-b border-bd-1">
							<TableHead className="py-2 pl-4 pr-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								#
							</TableHead>
							<TableHead className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.text")}
							</TableHead>
							<TableHead className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.level")}
							</TableHead>
							<TableHead className="py-2 pl-2 pr-4 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.count")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading || !items
							? Array.from({ length: 7 }).map((_, i) => (
									<TableRow key={i} className="border-b border-bd-1 last:border-0">
										<TableCell className="py-2 pl-4 pr-2">
											<div className="h-3 w-4 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="px-2 py-2">
											<div className="mb-1 h-3 w-32 animate-pulse rounded bg-surf-3" />
											<div className="h-2.5 w-20 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="px-2 py-2">
											<div className="h-4 w-8 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="py-2 pl-2 pr-4 text-right">
											<div className="ml-auto h-3 w-8 animate-pulse rounded bg-surf-3" />
										</TableCell>
									</TableRow>
								))
							: items.map(item => (
									<TableRow
										key={item.rank}
										className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
									>
										<TableCell className="py-2.5 pl-4 pr-2 text-[12px] text-t-2">
											{item.rank}
										</TableCell>
										<TableCell className="px-2 py-2.5">
											<div className="font-medium text-t-1">{item.title}</div>
											{item.author && (
												<div className="text-[11.5px] text-t-3">{item.author}</div>
											)}
										</TableCell>
										<TableCell className="px-2 py-2.5">
											{item.level && (
												<Typography
													tag="span"
													className={cn(
														"inline-flex h-5 items-center justify-center rounded-[5px] px-1.5 text-[10.5px] font-bold",
														CEFR_LEVEL_BADGE_CLASS[item.level],
													)}
												>
													{t(`shared.cefrLevel.${item.level}`)}
												</Typography>
											)}
										</TableCell>
										<TableCell className="py-2.5 pl-2 pr-4 text-right font-mono text-[12px] text-t-2">
											{item.metricValue.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
					</TableBody>
				</Table>
			</div>
		</AdminCard>
	);
};
