"use client";

import { useI18n } from "@/shared/lib/i18n";

interface WordsStatCardProps {
	wordsInDictionary: number;
	wordsAddedToday?: number;
	dailyWordsGoal?: number | null;
}

export const WordsStatCard = ({
	wordsInDictionary,
	wordsAddedToday,
	dailyWordsGoal,
}: WordsStatCardProps) => {
	const { t } = useI18n();

	const hasGoal = dailyWordsGoal != null && wordsAddedToday != null;
	const progress = hasGoal ? Math.min(wordsAddedToday! / dailyWordsGoal!, 1) : 0;
	const done = hasGoal && wordsAddedToday! >= dailyWordsGoal!;

	return (
		<div className="cursor-default rounded-card border border-bd-1 bg-surf p-[13px_14px]">
			<div className="mb-2.5 flex size-7 items-center justify-center rounded-base bg-grn-bg">
				<svg
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.4"
					className="size-[13px] text-grn-t"
					aria-hidden="true"
				>
					<path d="M2 4h10M2 7h7M2 10h5" strokeLinecap="round" />
				</svg>
			</div>
			<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-t-1 max-sm:text-[22px]">
				{wordsInDictionary.toLocaleString()}
				{hasGoal && (
					<span
						className="ml-1 text-[14px] font-normal text-grn-t"
						title={t("dashboard.stats.dailyWordsHint")}
					>
						+{wordsAddedToday} / {dailyWordsGoal}
					</span>
				)}
			</div>
			<div className={`text-[11px] leading-[1.4] text-t-2 ${hasGoal ? "mb-2" : ""}`}>
				{t("dashboard.stats.words")}
			</div>
			{hasGoal && (
				<div className="h-[3px] overflow-hidden rounded-full bg-surf-3">
					<div
						className={`h-full rounded-full transition-all duration-500 ${done ? "bg-grn" : "bg-acc"}`}
						style={{ width: `${progress * 100}%` }}
					/>
				</div>
			)}
		</div>
	);
};
