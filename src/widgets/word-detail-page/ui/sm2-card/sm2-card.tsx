"use client";

import type {
	DetailReviewHistory,
	DetailSm2Progress,
} from "@/entities/dictionary";
import { formatNextReview } from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";

export interface Sm2CardProps {
	sm2: DetailSm2Progress | null;
	reviewHistory: DetailReviewHistory;
}

export const Sm2Card = ({ sm2, reviewHistory }: Sm2CardProps) => {
	const { t, lang } = useI18n();

	if (!sm2) {
		return (
			<section
				aria-labelledby="sm2-card-title"
				className="mb-3.5 rounded-card border-hairline border-bd-1 bg-surf p-4"
			>
				<h3
					id="sm2-card-title"
					className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
				>
					{t("vocabulary.wordDetail.sections.sm2")}
				</h3>
				<p className="text-[12.5px] text-t-3">
					{t("vocabulary.wordDetail.sm2.empty")}
				</p>
			</section>
		);
	}

	const target = Math.max(sm2.targetRepetitions, 1);
	const fillPercent = Math.min(100, Math.round((sm2.repetitions / target) * 100));
	const intervalLabel =
		sm2.interval === 1
			? t("vocabulary.wordDetail.sm2.intervalDay", { n: sm2.interval })
			: t("vocabulary.wordDetail.sm2.intervalDays", { n: sm2.interval });

	return (
		<section
			aria-labelledby="sm2-card-title"
			className="mb-3.5 rounded-card border-hairline border-bd-1 bg-surf p-4"
		>
			<h3
				id="sm2-card-title"
				className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("vocabulary.wordDetail.sections.sm2")}
			</h3>

			<div className="mb-1.5 flex items-center justify-between">
				<span className="text-[12px] text-t-2">
					{t("vocabulary.wordDetail.sm2.progress")}
				</span>
				<span className="font-display text-[17px] text-t-1">
					{t("vocabulary.wordDetail.sm2.progressValue", {
						current: sm2.repetitions,
						target: sm2.targetRepetitions,
					})}
				</span>
			</div>
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={fillPercent}
				className="mb-3 h-[5px] overflow-hidden rounded-[3px] bg-surf-3"
			>
				<div
					className="h-full rounded-[3px] bg-amb"
					style={{ width: `${fillPercent}%` }}
				/>
			</div>

			<dl className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<dt className="text-[12px] text-t-3">
						{t("vocabulary.wordDetail.sm2.next")}
					</dt>
					<dd className="text-[12px] font-medium text-amb">
						{formatNextReview(sm2.nextReview, t, lang)}
					</dd>
				</div>
				<div className="flex items-center justify-between">
					<dt className="text-[12px] text-t-3">
						{t("vocabulary.wordDetail.sm2.interval")}
					</dt>
					<dd className="text-[12px] font-medium text-t-1">{intervalLabel}</dd>
				</div>
				<div className="flex items-center justify-between">
					<dt className="text-[12px] text-t-3">
						{t("vocabulary.wordDetail.sm2.totalReviews")}
					</dt>
					<dd className="text-[12px] font-medium text-t-1">
						{reviewHistory.totalReviews}
					</dd>
				</div>
				<div className="flex items-center justify-between">
					<dt className="text-[12px] text-t-3">
						{t("vocabulary.wordDetail.sm2.successCount")}
					</dt>
					<dd className="text-[12px] font-medium text-grn">
						{t("vocabulary.wordDetail.sm2.successValue", {
							success: reviewHistory.successCount,
							total: reviewHistory.totalReviews,
						})}
					</dd>
				</div>
			</dl>
		</section>
	);
};
