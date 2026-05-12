"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { PopularBy, PopularTextItem } from "@/entities/admin-analytics";
import { CEFR_CEFR_LEVEL_BADGE_CLASS } from "@/shared/lib/cefr-colors";

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

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.popularTexts.title")}
				</Typography>
				<Typography tag="span" className="ml-2 text-[11px] text-t-3">
					{t("admin.analytics.popularTexts.subtitle")}
				</Typography>
			</div>

			{/* Tab strip */}
			<div className="-mb-px flex gap-px overflow-x-auto border-b border-bd-1 px-4">
				{TABS.map((tb) => {
				  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onTabChange(tb);
				  return (
					<Button
						key={tb}
						onClick={handleClick}
						className={cn(
							"whitespace-nowrap border-b-2 px-2.5 py-2 text-[12px] font-medium transition-colors",
							tb === tab
								? "border-acc text-t-1"
								: "border-transparent text-t-3 hover:text-t-2",
						)}
					>
						{t(`admin.analytics.popularTexts.tab${tb.charAt(0).toUpperCase() + tb.slice(1)}`)}
					</Button>
				);
				})}
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-[12.5px]">
					<thead>
						<tr className="border-b border-bd-1">
							<th className="py-2 pl-4 pr-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								#
							</th>
							<th className="px-2 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.text")}
							</th>
							<th className="px-2 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.level")}
							</th>
							<th className="py-2 pl-2 pr-4 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.analytics.popularTexts.count")}
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading || !items
							? Array.from({ length: 7 }).map((_, i) => (
									<tr key={i} className="border-b border-bd-1 last:border-0">
										<td className="py-2 pl-4 pr-2">
											<div className="h-3 w-4 animate-pulse rounded bg-surf-3" />
										</td>
										<td className="px-2 py-2">
											<div className="mb-1 h-3 w-32 animate-pulse rounded bg-surf-3" />
											<div className="h-2.5 w-20 animate-pulse rounded bg-surf-3" />
										</td>
										<td className="px-2 py-2">
											<div className="h-4 w-8 animate-pulse rounded bg-surf-3" />
										</td>
										<td className="py-2 pl-2 pr-4 text-right">
											<div className="ml-auto h-3 w-8 animate-pulse rounded bg-surf-3" />
										</td>
									</tr>
								))
							: items.map((item) => (
									<tr
										key={item.rank}
										className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
									>
										<td className="py-2.5 pl-4 pr-2 text-[12px] text-t-2">
											{item.rank}
										</td>
										<td className="px-2 py-2.5">
											<div className="font-medium text-t-1">{item.title}</div>
											{item.author && (
												<div className="text-[11.5px] text-t-3">{item.author}</div>
											)}
										</td>
										<td className="px-2 py-2.5">
											{item.level && (
												<Typography tag="span"
													className={cn(
														"inline-flex h-5 w-8 items-center justify-center rounded-[5px] text-[10.5px] font-bold",
														CEFR_LEVEL_BADGE_CLASS[item.level],
													)}
												>
													{item.level}
												</Typography>
											)}
										</td>
										<td className="py-2.5 pl-2 pr-4 text-right font-mono text-[12px] text-t-2">
											{item.metricValue.toLocaleString()}
										</td>
									</tr>
								))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
