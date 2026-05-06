"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { getPrimaryTranslation, type ReviewDueWord } from "@/entities/review";
import type { ReviewSystem } from "../review-topbar";
import type { ReviewScreen } from "../../model";

interface Sm2Counts {
	easy: number;
	good: number;
	hard: number;
}

interface DeckCounts {
	know: number;
	again: number;
}

export interface ReviewSidePanelProps {
	system: ReviewSystem;
	screen: ReviewScreen;
	streak: number;
	sm2Counts: Sm2Counts;
	deckCounts: DeckCounts;
	nextWords: ReviewDueWord[];
}

export const ReviewSidePanel = ({
	system,
	screen,
	streak,
	sm2Counts,
	deckCounts,
	nextWords,
}: ReviewSidePanelProps) => {
	const { t } = useI18n();

	const sm2Passed = sm2Counts.easy + sm2Counts.good + sm2Counts.hard;
	const deckPassed = deckCounts.know + deckCounts.again;

	return (
		<aside className="hidden w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-bd-1 bg-surf px-4 py-5 lg:flex">
			<Typography
				tag="h2"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{system === "sm2"
					? t("review.sidePanel.sm2Title")
					: t("review.sidePanel.deckTitle")}
			</Typography>

			{system === "sm2" && screen === "card" ? (
				<>
					<StatRow
						label={t("review.sidePanel.passed")}
						value={sm2Passed}
						tone="neu"
					/>
					<div className="flex flex-col gap-1">
						<StatRow label={t("review.sidePanel.easy")} value={sm2Counts.easy} tone="grn" />
						<StatRow label={t("review.sidePanel.good")} value={sm2Counts.good} tone="acc" />
						<StatRow label={t("review.sidePanel.hard")} value={sm2Counts.hard} tone="amb" />
					</div>
				</>
			) : null}

			{system === "deck" && screen === "card" ? (
				<div className="flex flex-col gap-1">
					<StatRow label={t("review.sidePanel.know")} value={deckCounts.know} tone="grn" />
					<StatRow label={t("review.sidePanel.again")} value={deckCounts.again} tone="amb" />
					{deckPassed > 0 ? (
						<StatRow label={t("review.sidePanel.passed")} value={deckPassed} tone="neu" />
					) : null}
				</div>
			) : null}

			{system === "sm2" ? (
				<>
					<div className="border-t border-bd-1 pt-3">
						<Typography className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
							{t("review.sidePanel.streakTitle")}
						</Typography>
						<div className="flex items-center gap-1.5">
							<span aria-hidden="true" className="text-[16px]">🔥</span>
							<Typography className="text-[13px] font-semibold text-t-1">
								{t("review.sidePanel.streakDays", { n: streak })}
							</Typography>
						</div>
					</div>

					{nextWords.length > 0 ? (
						<div className="border-t border-bd-1 pt-3">
							<Typography className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
								{t("review.sm2.intro.queue.title")}
							</Typography>
							<ul className="flex flex-col gap-1">
								{nextWords.map((word) => (
									<li
										key={word.lemmaId}
										className="flex items-center gap-1.5 rounded-base px-2 py-1.5 hover:bg-surf-2"
									>
										<Typography
											tag="span"
											className="min-w-0 flex-1 truncate text-[12px] font-medium text-t-1"
										>
											{word.lemma.baseForm}
										</Typography>
										<Typography
											tag="span"
											className="shrink-0 truncate text-[11px] text-t-3"
										>
											{getPrimaryTranslation(word.lemma)}
										</Typography>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</>
			) : null}
		</aside>
	);
};

const toneClass: Record<"grn" | "acc" | "amb" | "neu", string> = {
	grn: "text-grn",
	acc: "text-acc",
	amb: "text-amb",
	neu: "text-t-2",
};

const StatRow = ({
	label,
	value,
	tone,
}: {
	label: string;
	value: number;
	tone: "grn" | "acc" | "amb" | "neu";
}) => (
	<div className="flex items-center justify-between gap-2">
		<Typography className="text-[12px] text-t-3">{label}</Typography>
		<Typography
			className={`text-[13px] font-semibold tabular-nums ${toneClass[tone]}`}
		>
			{value}
		</Typography>
	</div>
);
