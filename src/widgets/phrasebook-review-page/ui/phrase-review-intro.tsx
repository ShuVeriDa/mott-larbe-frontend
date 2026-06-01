"use client";

import type { PhraseDue, PhraseReviewStats } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { PhraseReviewMode } from "../model";
import { ModePicker } from "./mode-picker";
import { StatBox } from "./stat-box";

interface PhraseReviewIntroProps {
	stats: PhraseReviewStats | undefined;
	queue: PhraseDue[];
	loading: boolean;
	error: boolean;
	mode: PhraseReviewMode;
	selectedCategoryId: string | undefined;
	onModeChange: (mode: PhraseReviewMode) => void;
	onCategoryChange: (id: string | undefined) => void;
	onStart: () => void;
}

const QUEUE_PREVIEW = 4;

const statusDotClass = (status: string) => {
	switch (status) {
		case "LEARNING": return "bg-amb";
		case "KNOWN": return "bg-grn";
		default: return "bg-acc";
	}
};

export const PhraseReviewIntro = ({
	stats,
	queue,
	loading,
	error,
	mode,
	selectedCategoryId,
	onModeChange,
	onCategoryChange,
	onStart,
}: PhraseReviewIntroProps) => {
	const { t } = useI18n();
	const dueCount = stats?.dueCount ?? 0;
	const learningCount = stats?.learningCount ?? 0;
	const knownCount = stats?.knownCount ?? 0;
	const remainder = Math.max(queue.length - QUEUE_PREVIEW, 0);

	return (
		<section
			className="flex flex-1 flex-col items-center justify-center px-6 py-8 max-md:justify-start max-md:px-4 max-md:pt-6"
			aria-busy={loading}
		>
			<div className="mb-5 flex gap-2 max-md:w-full">
				<StatBox value={dueCount} label={t("phrasebook.review.intro.stats.due")} tone="amb" />
				<StatBox value={learningCount} label={t("phrasebook.review.intro.stats.learning")} tone="grn" />
				<StatBox
					value={knownCount}
					label={t("phrasebook.review.intro.stats.known")}
					tone="acc"
					hint={t("phrasebook.review.intro.stats.knownHint")}
				/>
			</div>

			<Typography
				tag="h1"
				className="mb-1.5 text-center font-display text-[21px] font-normal text-t-1"
			>
				{t("phrasebook.review.intro.title")}
			</Typography>

			<ModePicker
				mode={mode}
				selectedCategoryId={selectedCategoryId}
				onModeChange={onModeChange}
				onCategoryChange={onCategoryChange}
			/>

			<Typography className="mb-5 mt-3 max-w-[340px] text-center text-[13px] leading-[1.6] text-t-3">
				{loading
					? t("phrasebook.review.intro.loading")
					: error
						? t("phrasebook.review.intro.error")
						: queue.length === 0
							? t("phrasebook.review.intro.empty")
							: mode === "category"
								? t("phrasebook.review.intro.subtitleCategory", { count: queue.length })
								: mode === "saved"
									? t("phrasebook.review.intro.subtitleSaved", { count: queue.length })
									: t("phrasebook.review.intro.subtitle", { count: queue.length })}
			</Typography>

			<Button
				variant="action"
				size="lg"
				onClick={onStart}
				disabled={loading || queue.length === 0}
			>
				{t("phrasebook.review.startReview")}
			</Button>

			{queue.length > 0 ? (
				<div className="mt-5 w-full max-w-[420px] border-t border-bd-1 pt-4 max-md:max-w-full">
					<Typography className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("phrasebook.review.intro.queue.title")}
					</Typography>
					<ul className="flex flex-col gap-1">
						{queue.slice(0, QUEUE_PREVIEW).map((phrase) => (
							<li
								key={phrase.id}
								className="flex items-center gap-2.5 rounded-base border-[0.5px] border-bd-1 bg-surf px-3 py-2"
							>
								<span
									aria-hidden="true"
									className={`size-1.5 shrink-0 rounded-full ${statusDotClass(phrase.status)}`}
								/>
								<span className="sr-only">{phrase.status}</span>
								<Typography
									tag="span"
									className="flex-1 truncate text-[13px] font-medium text-t-1"
								>
									{phrase.original}
								</Typography>
								<Typography tag="span" className="max-w-[40%] shrink truncate text-[12px] text-t-3">
									{phrase.translation}
								</Typography>
							</li>
						))}
					</ul>
					{remainder > 0 ? (
						<Typography className="mt-1.5 text-center text-[11.5px] text-t-3">
							{t("phrasebook.review.intro.queue.more", { count: remainder })}
						</Typography>
					) : null}
				</div>
			) : null}
		</section>
	);
};
