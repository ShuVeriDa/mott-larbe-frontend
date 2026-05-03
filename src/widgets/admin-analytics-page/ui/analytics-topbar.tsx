"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AnalyticsRange } from "@/entities/admin-analytics";

const RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "all"];

interface AnalyticsTopbarProps {
	range: AnalyticsRange;
	onRangeChange: (range: AnalyticsRange) => void;
	onExport: () => void;
}

export const AnalyticsTopbar = ({
	range,
	onRangeChange,
	onExport,
}: AnalyticsTopbarProps) => {
	const { t } = useI18n();

	return (
		<div className="sticky top-0 z-10 flex items-center gap-3 border-b border-bd-1 bg-bg px-5 py-3.5 transition-colors max-md:hidden">
			<div>
				<h1 className="font-display text-base font-medium text-t-1">
					{t("admin.analytics.title")}
				</h1>
				<p className="mt-0.5 text-[12px] text-t-3">
					{t("admin.analytics.subtitle")}
				</p>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
					{RANGES.map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => onRangeChange(r)}
							className={cn(
								"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
								r === range
									? "bg-surf text-t-1 shadow-sm"
									: "text-t-2 hover:text-t-1",
							)}
						>
							{t(`admin.analytics.range.${r}`)}
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M8 2v8M5 7l3 3 3-3M3 12h10"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.analytics.export")}
				</button>
			</div>
		</div>
	);
};
