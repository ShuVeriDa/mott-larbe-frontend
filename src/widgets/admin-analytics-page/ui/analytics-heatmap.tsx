"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { HeatmapHour } from "@/entities/admin-analytics";

const CELL_COLORS = [
	"bg-surf-3",
	"bg-acc/15",
	"bg-acc/30",
	"bg-acc/50",
	"bg-acc/70",
	"bg-acc/90",
] as const;

interface AnalyticsHeatmapProps {
	days?: string[];
	hours?: HeatmapHour[];
	isLoading?: boolean;
}

export const AnalyticsHeatmap = ({
	days,
	hours,
	isLoading,
}: AnalyticsHeatmapProps) => {
	const { t } = useI18n();

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between px-4 py-3.5 pb-2.5">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.heatmap.title")}
				</span>
				<span className="text-[11px] text-t-3">
					{t("admin.analytics.heatmap.subtitle")}
				</span>
			</div>

			<div className="overflow-x-auto px-4 pb-4">
				{isLoading || !days || !hours ? (
					<div className="h-[220px] animate-pulse rounded-lg bg-surf-2" />
				) : (
					<div className="min-w-[185px]">
						{/* Day headers */}
						<div
							className="mb-1 flex gap-[3px]"
							style={{ marginLeft: 32 }}
						>
							{days.map((d) => (
								<div
									key={d}
									className="w-[14px] shrink-0 text-center text-[9px] text-t-3"
								>
									{d}
								</div>
							))}
						</div>

						{/* Hour rows */}
						{hours.map(({ hour, values }) => (
							<div
								key={hour}
								className="mb-[3px] flex items-center gap-[3px]"
							>
								<div className="mr-1 w-6 shrink-0 text-right text-[9px] text-t-3">
									{hour % 3 === 0
										? `${String(hour).padStart(2, "0")}:00`
										: ""}
								</div>
								{values.map((v, di) => (
									<div
										key={di}
										className={cn(
											"size-[14px] shrink-0 rounded-[3px] transition-transform hover:scale-125",
											CELL_COLORS[v] ?? CELL_COLORS[0],
										)}
										title={`${days[di]} ${String(hour).padStart(2, "0")}:00`}
									/>
								))}
							</div>
						))}

						{/* Legend */}
						<div className="mt-2 flex items-center gap-1" style={{ marginLeft: 32 }}>
							<span className="mr-0.5 text-[9.5px] text-t-3">
								{t("admin.analytics.heatmap.less")}
							</span>
							{CELL_COLORS.map((cls, i) => (
								<div
									key={i}
									className={cn("size-[11px] shrink-0 rounded-[2px]", cls)}
								/>
							))}
							<span className="ml-0.5 text-[9.5px] text-t-3">
								{t("admin.analytics.heatmap.more")}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
