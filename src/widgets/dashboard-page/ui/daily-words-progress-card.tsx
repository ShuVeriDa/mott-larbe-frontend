"use client";

import { useI18n } from "@/shared/lib/i18n";

interface DailyWordsProgressCardProps {
	wordsAddedToday: number;
	dailyWordsGoal: number;
}

export const DailyWordsProgressCard = ({
	wordsAddedToday,
	dailyWordsGoal,
}: DailyWordsProgressCardProps) => {
	const { t } = useI18n();

	const progress = Math.min(wordsAddedToday / dailyWordsGoal, 1);
	const done = wordsAddedToday >= dailyWordsGoal;

	return (
		<div className="cursor-default rounded-card border border-bd-1 bg-surf p-[13px_14px]">
			<div className="mb-2.5 flex size-7 items-center justify-center rounded-base bg-grn/15">
				<svg
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.4"
					className="size-[13px] text-grn"
					aria-hidden="true"
				>
					<path d="M2 7h10M7 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-t-1 max-sm:text-[22px]">
				{wordsAddedToday}
				<span className="ml-1 text-[14px] font-normal text-t-3">/ {dailyWordsGoal}</span>
			</div>
			<div className="mb-2 text-[11px] leading-[1.4] text-t-2">
				{t("dashboard.stats.dailyWords")}
			</div>
			<div className="h-[3px] overflow-hidden rounded-full bg-surf-3">
				<div
					className={`h-full rounded-full transition-all duration-500 ${done ? "bg-grn" : "bg-acc"}`}
					style={{ width: `${progress * 100}%` }}
				/>
			</div>
		</div>
	);
};
