"use client";

import { Typography } from "@/shared/ui/typography";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { HeatmapDay, HeatmapLevel } from "@/entities/statistics";
import { ProfileCard as SettingCard } from "../profile-card";

const LEVEL_CLASSES: Record<HeatmapLevel, string> = {
	0: "bg-surf-3",
	1: "bg-acc-bg",
	2: "bg-acc/30",
	3: "bg-acc/60",
	4: "bg-acc",
};

interface HeatmapCellProps {
	level: HeatmapLevel;
	count: number;
	date: string;
}

const HeatmapCell = ({ level, count, date }: HeatmapCellProps) => (
	<div
		title={count > 0 ? `${date}: ${count}` : date}
		className={cn(
			"size-[10px] rounded-[2px] max-sm:size-[9px] max-[420px]:size-[8px]",
			LEVEL_CLASSES[level],
		)}
	/>
);

export interface ActivityCardProps {
	heatmap: HeatmapDay[];
}

export const ActivityCard = ({ heatmap }: ActivityCardProps) => {
	const { t } = useI18n();

	return (
		<SettingCard title={t("profile.activity.title")} noBody>
			<div className="px-4 pt-3 pb-3.5">
				<Typography tag="p" className="text-[11px] text-t-3 mb-2">{t("profile.activity.label")}</Typography>
				<div className="flex flex-wrap gap-[2.5px]">
					{heatmap.map((day) => (
						<HeatmapCell
							key={day.date}
							level={day.level}
							count={day.count}
							date={day.date}
						/>
					))}
				</div>
			</div>
		</SettingCard>
	);
};
