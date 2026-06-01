"use client";

import type { AccuracyStats } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AccuracyRowBlock } from "./accuracy-row-block";

interface AccuracyBlockProps {
	accuracy: AccuracyStats;
}

export const AccuracyBlock = ({ accuracy }: AccuracyBlockProps) => {
	const { t } = useI18n();

	const correctPct = accuracy.percent;
	const wrongPct = Math.max(0, 100 - accuracy.percent);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.accuracy.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("statistics.accuracy.meta")}
				</Typography>
			</header>

			<div className="flex items-start gap-5 max-[480px]:flex-col max-[480px]:gap-3">
				<div className="shrink-0 text-center">
					<Typography
						tag="p"
						className="font-display text-5xl font-normal leading-none tracking-[-1px] text-grn max-[480px]:text-[40px]"
					>
						{Math.round(accuracy.percent)}%
					</Typography>
					<Typography tag="p" className="mt-0.5 text-[11px] text-t-3">
						{t("statistics.accuracy.score")}
					</Typography>
				</div>

				<div className="w-px shrink-0 self-stretch bg-bd-1 max-[480px]:hidden" />

				<div className="flex flex-1 flex-col gap-2">
					<AccuracyRowBlock
						label={t("statistics.accuracy.correct")}
						value={accuracy.correct.toLocaleString()}
						dotColor="bg-grn"
						statColor="text-grn"
						percent={correctPct}
						barColor="bg-grn"
					/>
					<AccuracyRowBlock
						label={t("statistics.accuracy.wrong")}
						value={accuracy.wrong.toLocaleString()}
						dotColor="bg-amb"
						statColor="text-amb"
						percent={wrongPct}
						barColor="bg-amb"
					/>

					<div className="mt-0.5 border-t border-bd-1 pt-1.5">
						<div className="flex items-center justify-between">
							<Typography tag="span" className="text-[11px] text-t-3">
								{t("statistics.accuracy.bestStreak")}
							</Typography>
							<Typography tag="span" className="text-xs font-semibold text-t-1">
								{t("statistics.accuracy.bestStreakValue", {
									n: accuracy.bestStreak,
								})}
							</Typography>
						</div>
						<div className="mt-1 flex items-center justify-between">
							<Typography tag="span" className="text-[11px] text-t-3">
								{t("statistics.accuracy.sessions")}
							</Typography>
							<Typography tag="span" className="text-xs font-semibold text-t-1">
								{accuracy.sessions.toLocaleString()}
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
