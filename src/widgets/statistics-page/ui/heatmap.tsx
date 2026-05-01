"use client";

import type { HeatmapLevel, HeatmapMonth } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

interface HeatmapProps {
	months: HeatmapMonth[];
}

const LEVEL_CLASS: Record<HeatmapLevel, string> = {
	0: "bg-surf-3",
	1: "bg-acc/25",
	2: "bg-acc/45",
	3: "bg-acc/70",
	4: "bg-acc",
};

export const Heatmap = ({ months }: HeatmapProps) => {
	const { t } = useI18n();

	return (
		<div className="min-w-0 flex-1">
			<div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-t-3">
				{t("statistics.streak.yearActivity")}
			</div>

			<div className="flex flex-col gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{months.map((m) => (
					<div key={m.month} className="flex items-center gap-1.5">
						<div className="w-[22px] shrink-0 text-[10px] font-medium text-t-3">
							{m.month}
						</div>
						<div className="flex flex-nowrap gap-[2.5px]">
							{m.days.map((day) => (
								<div
									key={day.date}
									title={`${day.date} · ${day.count}`}
									className={cn(
										"size-[11px] shrink-0 rounded-[2.5px] transition-colors max-md:size-[9px] max-[480px]:size-[8px]",
										LEVEL_CLASS[day.level],
									)}
								/>
							))}
						</div>
					</div>
				))}
			</div>

			<div className="mt-2 flex items-center gap-1.5">
				<span className="text-[10px] text-t-3">{t("statistics.streak.less")}</span>
				<div className="flex gap-[3px]">
					{([0, 1, 2, 3, 4] as HeatmapLevel[]).map((lvl) => (
						<div
							key={lvl}
							className={cn(
								"size-2.5 rounded-[2px]",
								LEVEL_CLASS[lvl],
							)}
						/>
					))}
				</div>
				<span className="text-[10px] text-t-3">{t("statistics.streak.more")}</span>
			</div>
		</div>
	);
};
