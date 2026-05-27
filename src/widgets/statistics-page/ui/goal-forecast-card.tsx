"use client";
import type { GoalForecast } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface GoalForecastCardProps {
	data: GoalForecast;
}

export const GoalForecastCard = ({ data }: GoalForecastCardProps) => {
	const { t } = useI18n();

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.goalForecast.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{data.pct}%
				</Typography>
			</header>

			{/* Progress bar */}
			<div className="mb-3">
				<div className="h-2 w-full overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-acc transition-[width]"
						style={{ width: `${data.pct}%` }}
					/>
				</div>
				<div className="mt-1.5 flex items-center justify-between">
					<Typography tag="span" className="text-[11px] text-t-3">
						{data.current.toLocaleString()}
					</Typography>
					<Typography tag="span" className="text-[11px] text-t-3">
						{t("statistics.goalForecast.goal", { n: data.goal })}
					</Typography>
				</div>
			</div>

			{/* Forecast */}
			<div className="rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-3 py-2.5">
				{data.remaining === 0 ? (
					<Typography tag="p" className="text-[11.5px] font-semibold text-grn">
						{t("statistics.goalForecast.reached")}
					</Typography>
				) : data.daysToGoal !== null ? (
					<>
						<Typography tag="p" className="text-[11.5px] font-semibold text-t-1">
							{t("statistics.goalForecast.forecast", { days: data.daysToGoal })}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[10.5px] text-t-3">
							{t("statistics.goalForecast.avgPerDay", { n: data.avgPerDay })}
						</Typography>
					</>
				) : (
					<Typography tag="p" className="text-[11.5px] text-t-3">
						{t("statistics.goalForecast.noData")}
					</Typography>
				)}
			</div>
		</section>
	);
};
