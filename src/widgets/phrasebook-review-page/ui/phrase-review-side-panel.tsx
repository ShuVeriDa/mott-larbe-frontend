"use client";

import type { PhraseDue } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { PhraseReviewScreen, PhraseCounts } from "../model";

interface PhraseReviewSidePanelProps {
	screen: PhraseReviewScreen;
	streak: number;
	counts: PhraseCounts;
	nextPhrases: PhraseDue[];
}

export const PhraseReviewSidePanel = ({
	screen,
	streak,
	counts,
	nextPhrases,
}: PhraseReviewSidePanelProps) => {
	const { t } = useI18n();
	const passed = counts.easy + counts.good + counts.hard;

	return (
		<aside className="hidden w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-bd-1 bg-surf px-4 py-5 lg:flex">
			<Typography
				tag="h2"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("phrasebook.review.sidePanel.title")}
			</Typography>

			{screen === "card" ? (
				<>
					<StatRow label={t("phrasebook.review.sidePanel.passed")} value={passed} tone="neu" />
					<div className="flex flex-col gap-1">
						<StatRow label={t("phrasebook.review.sidePanel.easy")} value={counts.easy} tone="grn" />
						<StatRow label={t("phrasebook.review.sidePanel.good")} value={counts.good} tone="acc" />
						<StatRow label={t("phrasebook.review.sidePanel.hard")} value={counts.hard} tone="amb" />
					</div>
				</>
			) : null}

			<div className="border-t border-bd-1 pt-3">
				<Typography className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("phrasebook.review.sidePanel.streakTitle")}
				</Typography>
				<div className="flex items-center gap-1.5">
					<Typography tag="span" aria-hidden="true" className="text-[16px]">🔥</Typography>
					<Typography className="text-[13px] font-semibold text-t-1">
						{t("phrasebook.review.sidePanel.streakDays", { n: streak })}
					</Typography>
				</div>
			</div>

			{nextPhrases.length > 0 ? (
				<div className="border-t border-bd-1 pt-3">
					<Typography className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("phrasebook.review.sidePanel.queue")}
					</Typography>
					<ul className="flex flex-col gap-1">
						{nextPhrases.map((phrase) => (
							<li
								key={phrase.id}
								className="flex items-center gap-1.5 rounded-base px-2 py-1.5 hover:bg-surf-2"
							>
								<Typography
									tag="span"
									className="min-w-0 flex-1 truncate text-[12px] font-medium text-t-1"
								>
									{phrase.original}
								</Typography>
								<Typography tag="span" className="shrink-0 truncate text-[11px] text-t-3">
									{phrase.translation}
								</Typography>
							</li>
						))}
					</ul>
				</div>
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

const StatRow = ({ label, value, tone }: { label: string; value: number; tone: "grn" | "acc" | "amb" | "neu" }) => (
	<div className="flex items-center justify-between gap-2">
		<Typography className="text-[12px] text-t-3">{label}</Typography>
		<Typography className={`text-[13px] font-semibold tabular-nums ${toneClass[tone]}`}>
			{value}
		</Typography>
	</div>
);
