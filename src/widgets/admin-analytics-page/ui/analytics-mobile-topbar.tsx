"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AnalyticsRange } from "@/entities/admin-analytics";

const RANGES: AnalyticsRange[] = ["7d", "30d", "90d"];

interface AnalyticsMobileTopbarProps {
	range: AnalyticsRange;
	onRangeChange: (range: AnalyticsRange) => void;
}

export const AnalyticsMobileTopbar = ({
	range,
	onRangeChange,
}: AnalyticsMobileTopbarProps) => {
	const { t } = useI18n();

	return (
		<div className="sticky top-0 z-40 flex items-center justify-between border-b border-bd-1 bg-surf px-4 py-2.5 transition-colors md:hidden">
			<span className="font-display text-[13px] font-medium text-t-1">
				{t("admin.analytics.title")}
			</span>
			<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
				{RANGES.map((r) => (
					<button
						key={r}
						type="button"
						onClick={() => onRangeChange(r)}
						className={cn(
							"h-6 rounded-md px-2 text-[11px] font-medium transition-all",
							r === range
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-2 hover:text-t-1",
						)}
					>
						{t(`admin.analytics.range.${r}`)}
					</button>
				))}
			</div>
		</div>
	);
};
