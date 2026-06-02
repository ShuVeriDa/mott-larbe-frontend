"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { PhraseCounts } from "../model";
import { DoneStat } from "./done-stat";

interface PhraseReviewDoneProps {
	counts: PhraseCounts;
	lang: string;
	onReviewAgain: () => void;
}

export const PhraseReviewDone = ({ counts, lang, onReviewAgain }: PhraseReviewDoneProps) => {
	const { t } = useI18n();

	return (
		<section className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-md:px-5 max-md:py-8">
			<div className="mb-4 flex size-[52px] items-center justify-center rounded-[14px] bg-grn-bg shadow-md">
				<svg viewBox="0 0 24 24" fill="none" className="size-[22px] text-grn">
					<path
						d="M5 13l4 4L19 7"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			<Typography
				tag="h2"
				className="mb-1.5 text-center font-display text-[21px] font-normal text-t-1"
			>
				{t("phrasebook.review.done.title")}
			</Typography>
			<Typography className="mb-5 max-w-[300px] text-center text-[13px] leading-[1.6] text-t-3">
				{t("phrasebook.review.done.subtitle")}
			</Typography>

			<div className="mb-5 flex gap-2.5 max-md:w-full">
				<DoneStat value={counts.easy} label={t("phrasebook.review.done.easy")} tone="grn" />
				<DoneStat value={counts.good} label={t("phrasebook.review.done.good")} tone="acc" />
				<DoneStat value={counts.hard} label={t("phrasebook.review.done.hard")} tone="amb" />
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2">
				<Link
					href={`/${lang}/phrasebook`}
					className={buttonVariants({ variant: "ghost", size: "lg" })}
				>
					{t("phrasebook.review.done.backToPhrasebook")}
				</Link>
				<Button variant="action" size="lg" onClick={onReviewAgain}>
					{t("phrasebook.review.done.reviewAgain")}
				</Button>
			</div>
		</section>
	);
};
