"use client";
import type { ReviewSessionsStats } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { ReviewStatItem } from "./review-stat-item";

interface ReviewSessionsCardProps {
	data: ReviewSessionsStats;
}

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
				<ReviewStatItem
					label={t("statistics.reviewSessions.sessions")}
					value={data.totalSessions.toLocaleString()}
				/>
				<ReviewStatItem
					label={t("statistics.reviewSessions.totalCards")}
					value={data.totalCards.toLocaleString()}
				/>
				<ReviewStatItem
					label={t("statistics.reviewSessions.avgPerSession")}
					value={data.avgCardsPerSession.toLocaleString()}
					sub={t("statistics.reviewSessions.cardsUnit")}
				/>
				<ReviewStatItem
					label={t("statistics.reviewSessions.bestDay")}
					value={data.bestDayCount.toLocaleString()}
					sub={t("statistics.reviewSessions.cardsUnit")}
				/>
				<ReviewStatItem
					label={t("statistics.reviewSessions.avgDuration")}
					value={durationLabel}
				/>
				<ReviewStatItem
					label={t("statistics.reviewSessions.mastered")}
					value={data.masteredWords.toLocaleString()}
					sub={t("statistics.reviewSessions.wordsUnit")}
				/>
			</div>
		</section>
	);
};
