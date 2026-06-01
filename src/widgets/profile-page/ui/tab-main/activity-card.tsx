"use client";

import type { HeatmapDay } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard as SettingCard } from "../profile-card";
import { HeatmapCell } from "./heatmap-cell";

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
