"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { DifficultBy, DifficultTextItem } from "@/entities/admin-analytics";
import type { CefrLevel } from "@/shared/types";

const TABS: DifficultBy[] = ["fail", "pct", "abandon"];

const LEVEL_BADGE_CLASS: Record<CefrLevel, string> = {
	A1: "bg-grn-bg text-grn-t",
	A2: "bg-grn-bg text-grn-t",
	B1: "bg-acc-bg text-acc-t",
	B2: "bg-pur-bg text-pur-t",
	C1: "bg-amb-bg text-amb-t",
	C2: "bg-red-bg text-red-t",
};

const METRIC_COLOR_CLASS: Record<string, string> = {
	red: "text-red-t",
	amber: "text-amb-t",
	green: "text-grn-t",
	blue: "text-acc-t",
	neutral: "text-t-2",
};

interface AnalyticsDifficultTextsProps {
	tab: DifficultBy;
	items?: DifficultTextItem[];
	isLoading?: boolean;
	onTabChange: (tab: DifficultBy) => void;
}

export const AnalyticsDifficultTexts = ({
	tab,
	items,
	isLoading,
	onTabChange,
}: AnalyticsDifficultTextsProps) => {
	const { t } = useI18n();

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="px-4 pt-3.5">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.difficultTexts.title")}
				</span>
				<span className="ml-2 text-[11px] text-t-3">
					{t("admin.analytics.difficultTexts.subtitle")}
				</span>
			</div>

			{/* Tab strip */}
			<div className="-mb-px flex gap-px overflow-x-auto border-b border-bd-1 px-4">
				{TABS.map((tb) => {
				  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onTabChange(tb);
				  return (
					<button
						key={tb}
						type="button"
						onClick={handleClick}
						className={cn(
							"whitespace-nowrap border-b-2 px-2.5 py-2 text-[12px] font-medium transition-colors",
							tb === tab
								? "border-acc text-t-1"
								: "border-transparent text-t-3 hover:text-t-2",
						)}
					>
						{t(`admin.analytics.difficultTexts.tab${tb.charAt(0).toUpperCase() + tb.slice(1)}`)}
					</button>
				);
				})}
			</div>

			{/* Rows */}
			{isLoading || !items
				? Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-2.5 border-b border-bd-1 px-4 py-2 last:border-0"
						>
							<div className="h-3 w-4 animate-pulse rounded bg-surf-3" />
							<div className="flex-1">
								<div className="mb-1 h-3 w-36 animate-pulse rounded bg-surf-3" />
								<div className="h-2.5 w-20 animate-pulse rounded bg-surf-3" />
							</div>
							<div className="h-4 w-8 animate-pulse rounded bg-surf-3" />
						</div>
					))
				: items.map((item) => (
						<div
							key={item.rank}
							className="flex items-center gap-2.5 border-b border-bd-1 px-4 py-2 last:border-0"
						>
							<span className="w-4 shrink-0 text-right text-[10.5px] font-semibold text-t-3">
								{item.rank}
							</span>
							<div className="min-w-0 flex-1">
								<div className="truncate text-[12.5px] font-medium text-t-1">
									{item.title}
								</div>
								<div className="mt-0.5 flex items-center gap-1 text-[11px] text-t-3">
									{item.level && (
										<span
											className={cn(
												"inline-flex h-5 w-8 items-center justify-center rounded-[5px] text-[10.5px] font-bold",
												LEVEL_BADGE_CLASS[item.level],
											)}
										>
											{item.level}
										</span>
									)}
									{item.wordsCount.toLocaleString()}{" "}
									{t("admin.analytics.difficultTexts.words")}
								</div>
							</div>
							<div className="shrink-0 text-right">
								<div
									className={cn(
										"text-[13px] font-semibold",
										METRIC_COLOR_CLASS[item.metricColor] ?? "text-t-2",
									)}
								>
									{item.metricValue}
								</div>
								<div className="text-[10px] text-t-3">{item.metricLabel}</div>
							</div>
						</div>
					))}
		</div>
	);
};
