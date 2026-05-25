"use client";

import { Button } from "@/shared/ui/button";
import { useEffect } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useSwipe } from "@/shared/lib/swipe";
import { Typography } from "@/shared/ui/typography";
import { getPrimaryTranslation } from "@/entities/review";
import type { DeckCard, DeckDueResponse, DeckRateResult } from "@/entities/deck";
import { FlipCard } from "@/features/flip-card";
import { DeckRatingButtons, useAddToRepeat, useReturnFromRepeat } from "@/features/rate-deck-card";
import type { SessionMode } from "@/features/session-mode";
import { FlashcardBack } from "@/widgets/review-session";
import { DeckBadge } from "../deck-badge";
import { ChoiceCardDeck } from "../choice-card";
import { TypingCardDeck } from "../typing-card";
import { useDeckSession, type DeckCounts } from "../../model";

export interface DeckSessionProps {
	due: DeckDueResponse;
	sessionMode?: SessionMode;
	onFinish: (counts: DeckCounts, againCards: DeckCard[]) => void;
	onBack: () => void;
	onProgress?: (currentIndex: number, total: number, counts: DeckCounts) => void;
}

const buildDeckOptions = (
	queue: DeckCard[],
	currentIndex: number,
): { options: string[]; correctIndex: number } => {
	const current = queue[currentIndex];
	if (!current) return { options: [], correctIndex: 0 };

	const correct = getPrimaryTranslation(current.lemma);
	if (!correct) return { options: [], correctIndex: 0 };

	const seen = new Set<string>([correct.toLowerCase()]);
	const pool: string[] = [];

	for (let i = 0; i < queue.length; i++) {
		if (i === currentIndex) continue;
		// Primary translation (headword or user dictionary entry — always filled)
		const primary = getPrimaryTranslation(queue[i].lemma);
		if (primary && !seen.has(primary.toLowerCase())) {
			seen.add(primary.toLowerCase());
			pool.push(primary);
		}
		// Additional headword translations for more variety
		for (const hw of queue[i].lemma.headwords) {
			const t = hw.entry.rawTranslate?.trim();
			if (t && !seen.has(t.toLowerCase())) {
				seen.add(t.toLowerCase());
				pool.push(t);
			}
		}
	}

	const distractors = pool.slice(0, 3);
	const all = [correct, ...distractors].slice(0, 4);
	all.sort();
	return { options: all, correctIndex: all.indexOf(correct) };
};

export const DeckSession = ({ due, sessionMode = "flashcard", onFinish, onBack, onProgress }: DeckSessionProps) => {
	const { t } = useI18n();
	const session = useDeckSession(due);
	const {
		current,
		currentIndex,
		total,
		queue,
		counts,
		againCards,
		flipped,
		isFinished,
		flip,
		rate,
	} = session;

	const { mutate: addToRepeat, isPending: isAddingToRepeat } = useAddToRepeat();
	const { mutate: returnFromRepeat, isPending: isReturning } = useReturnFromRepeat();

	const { options, correctIndex } = buildDeckOptions(queue, currentIndex);

	useEffect(() => {
		onProgress?.(currentIndex, total, counts);
	}, [counts, currentIndex, onProgress, total]);

	useEffect(() => {
		if (isFinished) onFinish(counts, againCards);
	}, [againCards, counts, isFinished, onFinish]);

	useEffect(() => {
		if (sessionMode !== "flashcard") return;
		const handleKey = (e: KeyboardEvent) => {
			// intentional: delegated event inspects the actual clicked element
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
	}, [flip, flipped, rate, sessionMode]);

	const swipe = useSwipe({
		enabled: sessionMode === "flashcard" && flipped,
		onSwipeLeft: () => rate("again"),
		onSwipeRight: () => rate("know"),
	});

	const handleMoveToRepeat = () => {
		if (!current) return;
		addToRepeat(current.lemmaId, { onSuccess: () => rate("again") });
	};

	const handleReturnFromRepeat = () => {
		if (!current) return;
		returnFromRepeat(current.lemmaId, { onSuccess: () => rate("know") });
	};

	if (!current) return null;

	const lemma = current.lemma;
	const translation = getPrimaryTranslation(lemma);
	const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

	const hasTranslation = translation !== "";
	const hasEnoughOptions = options.length >= 2;
	const effectiveMode = (sessionMode === "choice" || sessionMode === "typing") && (!hasTranslation || (sessionMode === "choice" && !hasEnoughOptions))
		? "flashcard"
		: sessionMode;
	const isFlashcard = effectiveMode === "flashcard";

	const deckTypeName = (() => {
		if (current.deckType === "NUMBERED") {
			return t("review.deck.card.badge.NUMBERED", {
				n: current.deckNumber ?? 1,
			});
		}
		return current.deckType;
	})();

	return (
		<div
			className="flex flex-1 flex-col items-center px-5 pt-5 pb-4 max-md:px-4 max-md:pt-3.5"
			onPointerDown={isFlashcard ? swipe.onPointerDown : undefined}
			onPointerUp={isFlashcard ? swipe.onPointerUp : undefined}
			onPointerCancel={isFlashcard ? swipe.onPointerCancel : undefined}
		>
			<div className="mb-4 flex w-full max-w-[520px] items-center gap-2.5">
				<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-acc transition-[width] duration-400"
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

			{effectiveMode === "choice" ? (
				<ChoiceCardDeck
					key={currentIndex}
					word={lemma.baseForm}
					pos={lemma.partOfSpeech}
					cardNumber={currentIndex + 1}
					type={current.deckType}
					deckNumber={current.deckNumber}
					options={options}
					correctIndex={correctIndex}
					onRate={rate}
				/>
			) : effectiveMode === "typing" ? (
				<TypingCardDeck
					key={currentIndex}
					word={lemma.baseForm}
					pos={lemma.partOfSpeech}
					cardNumber={currentIndex + 1}
					type={current.deckType}
					deckNumber={current.deckNumber}
					correctAnswer={translation}
					onRate={rate}
				/>
			) : (
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
			)}

			{isFlashcard ? (
				<DeckRatingButtons visible={flipped} onRate={rate} />
			) : null}

			{isFlashcard && flipped && current.deckType !== "REPEAT" ? (
				<button
					type="button"
					onClick={handleMoveToRepeat}
					disabled={isAddingToRepeat}
					className="mt-1 flex h-7 items-center gap-1.5 rounded-base border-hairline border-red/30 bg-red-bg px-3 text-[11.5px] font-medium text-red-t transition-opacity disabled:opacity-50"
				>
					{t("review.deck.card.moveToRepeat")}
				</button>
			) : null}

			{isFlashcard && flipped && current.deckType === "REPEAT" ? (
				<button
					type="button"
					onClick={handleReturnFromRepeat}
					disabled={isReturning}
					className="mt-1 flex h-7 items-center gap-1.5 rounded-base border-hairline border-grn/30 bg-grn-bg px-3 text-[11.5px] font-medium text-grn-t transition-opacity disabled:opacity-50"
				>
					{t("review.deck.card.returnFromRepeat")}
				</button>
			) : null}

			<div className="mt-2.5 flex w-full max-w-[520px] items-center gap-2">
				<Button
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
				</Button>
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
			<Typography tag="span" className="absolute right-3.5 top-3 text-[10.5px] text-t-3">
				#{cardNumber}
			</Typography>

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
