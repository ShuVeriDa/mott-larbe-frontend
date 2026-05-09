"use client";
import type { StatsPeriod, WordsPerDayPoint } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface WordsPerDayChartProps {
	points: WordsPerDayPoint[];
	period?: StatsPeriod;
}

const CHART_HEIGHT = 65;

export const WordsPerDayChart = ({ points, period }: WordsPerDayChartProps) => {
	const { t } = useI18n();

	const max = points.reduce((acc, p) => Math.max(acc, p.count), 1);

	return (
		<section className="rounded-card border-hairline border-bd-1 bg-surf p-4">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.perDay.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
				{period === "all"
					? t("statistics.perDay.metaAll")
					: t("statistics.perDay.meta")}
			</Typography>
			</header>

			{points.length === 0 ? (
				<div className="flex h-20 items-center justify-center text-[11px] text-t-3">
					{t("statistics.perDay.empty")}
				</div>
			) : (
				<div className="flex h-20 items-end gap-[5px]">
					{points.map((p, idx) => {
						const h = Math.max(
							4,
							Math.round((p.count / max) * CHART_HEIGHT),
						);
						const isMajor = idx % 5 === 0;
						return (
							<div
								key={p.date}
								className="flex flex-1 flex-col items-center gap-[3px]"
							>
								<div className="flex w-full items-end" style={{ height: CHART_HEIGHT }}>
									<div
										className="w-full cursor-pointer rounded-t-[4px] bg-acc-bg transition-colors hover:bg-acc"
										style={{ height: h }}
										title={`${p.date}: ${p.count}`}
									/>
								</div>
								<Typography tag="span" className="h-[12px] text-[9.5px] font-medium text-t-3">
									{isMajor ? idx + 1 : ""}
								</Typography>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
};
