"use client";
import type { ReviewSessionsStats } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ReviewSessionsCardProps {
	data: ReviewSessionsStats;
}

interface StatItemProps {
	label: string;
	value: string;
	sub?: string;
}

const StatItem = ({ label, value, sub }: StatItemProps) => (
	<div className="flex flex-col gap-0.5">
		<Typography tag="span" className="text-[10.5px] text-t-3">{label}</Typography>
		<Typography tag="span" className="text-base font-semibold text-t-1">{value}</Typography>
		{sub && <Typography tag="span" className="text-[10px] text-t-3">{sub}</Typography>}
	</div>
);

export const ReviewSessionsCard = ({ data }: ReviewSessionsCardProps) => {
	const { t } = useI18n();

	const durationLabel = data.avgDurationSeconds !== null
		? data.avgDurationSeconds >= 60
			? t("statistics.reviewSessions.minutes", { n: Math.round(data.avgDurationSeconds / 60) })
			: t("statistics.reviewSessions.seconds", { n: data.avgDurationSeconds })
		: "—";

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.reviewSessions.title")}
				</Typography>
			</header>

			<div className="grid grid-cols-2 gap-3">
				<StatItem
					label={t("statistics.reviewSessions.sessions")}
					value={data.totalSessions.toLocaleString()}
				/>
				<StatItem
					label={t("statistics.reviewSessions.totalCards")}
					value={data.totalCards.toLocaleString()}
				/>
				<StatItem
					label={t("statistics.reviewSessions.avgPerSession")}
					value={data.avgCardsPerSession.toLocaleString()}
					sub={t("statistics.reviewSessions.cardsUnit")}
				/>
				<StatItem
					label={t("statistics.reviewSessions.bestDay")}
					value={data.bestDayCount.toLocaleString()}
					sub={t("statistics.reviewSessions.cardsUnit")}
				/>
				<StatItem
					label={t("statistics.reviewSessions.avgDuration")}
					value={durationLabel}
				/>
				<StatItem
					label={t("statistics.reviewSessions.mastered")}
					value={data.masteredWords.toLocaleString()}
					sub={t("statistics.reviewSessions.wordsUnit")}
				/>
			</div>
		</section>
	);
};
