"use client";

import { useEffect } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { getPrimaryTranslation } from "@/entities/review";
import type { DeckDueResponse, DeckRateResult } from "@/entities/deck";
import { FlipCard } from "@/features/flip-card";
import { DeckRatingButtons } from "@/features/rate-deck-card";
import { FlashcardBack } from "@/widgets/review-session";
import { DeckBadge } from "../deck-badge";
import { useDeckSession, type DeckCounts } from "../../model";

export interface DeckSessionProps {
	due: DeckDueResponse;
	onFinish: (counts: DeckCounts) => void;
	onBack: () => void;
}

export const DeckSession = ({ due, onFinish, onBack }: DeckSessionProps) => {
	const { t } = useI18n();
	const session = useDeckSession(due);
	const {
		current,
		currentIndex,
		total,
		counts,
		flipped,
		isFinished,
		flip,
		rate,
	} = session;

	useEffect(() => {
		if (isFinished) onFinish(counts);
	}, [counts, isFinished, onFinish]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement | null)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;

			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				flip();
				return;
			}
			if (!flipped) return;

			let result: DeckRateResult | null = null;
			if (e.key === "ArrowLeft") result = "again";
			else if (e.key === "ArrowRight") result = "know";

			if (result) {
				e.preventDefault();
				rate(result);
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [flip, flipped, rate]);

	if (!current) return null;

	const lemma = current.lemma;
	const translation = getPrimaryTranslation(lemma);
	const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

	const deckTypeName = (() => {
		if (current.deckType === "NUMBERED") {
			return t("review.deck.card.badge.NUMBERED", {
				n: current.deckNumber ?? 1,
			});
		}
		return current.deckType;
	})();

	return (
		<div className="flex flex-1 flex-col items-center px-5 pt-5 pb-4 max-md:px-4 max-md:pt-3.5">
			<div className="mb-4 flex w-full max-w-[520px] items-center gap-2.5">
				<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-acc transition-[width] duration-[400ms]"
						style={{ width: `${progressPct}%` }}
					/>
				</div>
				<Typography
					tag="span"
					className="text-[11.5px] font-semibold text-t-2 tabular-nums"
				>
					{currentIndex + 1}
				</Typography>
				<Typography tag="span" className="text-[11.5px] text-t-3">
					/ {total}
				</Typography>
			</div>

			<FlipCard
				flipped={flipped}
				onFlip={flip}
				front={
					<DeckCardFront
						word={lemma.baseForm}
						pos={lemma.partOfSpeech}
						cardNumber={currentIndex + 1}
						type={current.deckType}
						deckNumber={current.deckNumber}
					/>
				}
				back={
					<FlashcardBack
						word={lemma.baseForm}
						translation={translation}
						pos={lemma.partOfSpeech}
						context={current.latestContext}
						morphForms={lemma.morphForms}
					/>
				}
			/>

			<DeckRatingButtons visible={flipped} onRate={rate} />

			<div className="mt-2.5 flex w-full max-w-[520px] items-center gap-2">
				<button
					type="button"
					onClick={onBack}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-hairline border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
				>
					<svg viewBox="0 0 12 12" fill="none" className="size-3">
						<path
							d="M8 6H4M5 3L2 6l3 3"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("review.deck.card.backToDecks")}
				</button>
				<Typography tag="span" className="ml-2 text-[12px] text-t-3">
					{t("review.deck.card.currentDeck", { name: deckTypeName })}
				</Typography>
			</div>
		</div>
	);
};

interface DeckCardFrontProps {
	word: string;
	pos: string | null;
	cardNumber: number;
	type: DeckDueResponse["new"][number]["deckType"];
	deckNumber?: number | null;
}

const DeckCardFront = ({
	word,
	pos,
	cardNumber,
	type,
	deckNumber,
}: DeckCardFrontProps) => {
	const { t } = useI18n();

	return (
		<>
			<div className="absolute left-3 top-2.5">
				<DeckBadge type={type} deckNumber={deckNumber} />
			</div>
			<span className="absolute right-3.5 top-3 text-[10.5px] text-t-3">
				#{cardNumber}
			</span>

			<Typography
				tag="h2"
				className="mb-1 text-center font-display text-[34px] font-normal leading-[1.2] tracking-[-0.3px] text-t-1 max-md:text-[30px] max-[375px]:text-[26px]"
			>
				{word}
			</Typography>
			{pos ? (
				<Typography className="text-center text-[11.5px] text-t-3">
					{pos}
				</Typography>
			) : null}

			<Typography className="mt-3.5 flex items-center gap-1 text-[12px] text-t-3 opacity-60">
				<svg viewBox="0 0 13 13" fill="none" className="size-3">
					<circle
						cx="6.5"
						cy="6.5"
						r="4"
						stroke="currentColor"
						strokeWidth="1.2"
					/>
					<path
						d="M6.5 5v1.5l1 1"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
				</svg>
				{t("review.sm2.card.flipHint")}
			</Typography>
		</>
	);
};
