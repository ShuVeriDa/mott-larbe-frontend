"use client";

import {
	type ReviewDueWord,
	type ReviewQuality,
	getPrimaryTranslation,
} from "@/entities/review";
import { FlipCard } from "@/features/flip-card";
import { RatingButtons } from "@/features/rate-word";
import type { SessionMode } from "@/features/session-mode";
import { useI18n } from "@/shared/lib/i18n";
import { useSwipe } from "@/shared/lib/swipe";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useEffect } from "react";
import { useSm2Session } from "../../model";
import { ChoiceCardSm2 } from "../choice-card";
import { FlashcardBack } from "../flashcard-back";
import { FlashcardFront } from "../flashcard-front";
import { TypingCardSm2 } from "../typing-card";

export interface Sm2SessionProps {
	words: ReviewDueWord[];
	sessionMode?: SessionMode;
	onFinish: (counts: { easy: number; good: number; hard: number }) => void;
	onBack?: () => void;
	onProgress?: (
		currentIndex: number,
		total: number,
		counts: {
			easy: number;
			good: number;
			hard: number;
		},
	) => void;
}

const buildOptions = (
	words: ReviewDueWord[],
	currentIndex: number,
): { options: string[]; correctIndex: number } => {
	const current = words[currentIndex];
	if (!current) return { options: [], correctIndex: 0 };

	const correct = getPrimaryTranslation(current.lemma);
	if (!correct) return { options: [], correctIndex: 0 };

	const seen = new Set<string>([correct.toLowerCase()]);
	const pool: string[] = [];

	for (let i = 0; i < words.length; i++) {
		if (i === currentIndex) continue;
		// Primary translation (headword or user dictionary entry — always filled)
		const primary = getPrimaryTranslation(words[i].lemma);
		if (primary && !seen.has(primary.toLowerCase())) {
			seen.add(primary.toLowerCase());
			pool.push(primary);
		}
		// Additional headword translations for more variety
		for (const hw of words[i].lemma.headwords) {
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

export const Sm2Session = ({
	words,
	sessionMode = "flashcard",
	onFinish,
	onBack,
	onProgress,
}: Sm2SessionProps) => {
	const { t } = useI18n();
	const session = useSm2Session(words);
	const {
		current,
		currentIndex,
		total,
		mode,
		flipped,
		counts,
		isFinished,
		flip,
		skip,
		rate,
		toggleMode,
	} = session;

	useEffect(() => {
		onProgress?.(currentIndex, total, counts);
	}, [counts, currentIndex, onProgress, total]);

	useEffect(() => {
		if (isFinished) onFinish(counts);
	}, [counts, isFinished, onFinish]);

	useEffect(() => {
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

			const quality: ReviewQuality | null =
				e.key === "1"
					? 0
					: e.key === "2"
						? 2
						: e.key === "3"
							? 4
							: e.key === "4"
								? 5
								: null;

			if (quality !== null) {
				e.preventDefault();
				rate(quality);
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [flip, flipped, rate]);

	const swipe = useSwipe({
		enabled: flipped,
		onSwipeLeft: () => rate(0),
		onSwipeRight: () => rate(5),
	});

	const { options, correctIndex } = buildOptions(words, currentIndex);

	if (!current) return null;

	const lemma = current.lemma;
	const translation = getPrimaryTranslation(lemma);
	const word = lemma.baseForm;
	const pos = lemma.partOfSpeech;
	const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

	const frontWord = mode === "wordToTrans" ? word : translation;
	const frontPos = mode === "wordToTrans" ? pos : null;
	const backWord = mode === "wordToTrans" ? word : translation;
	const backTranslation = mode === "wordToTrans" ? translation : word;

	// Fall back to flashcard when translation is missing or insufficient distractors for choice
	const hasTranslation = translation !== "";
	const hasEnoughOptions = options.length >= 2;
	const effectiveMode =
		(sessionMode === "choice" || sessionMode === "typing") &&
		(!hasTranslation || (sessionMode === "choice" && !hasEnoughOptions))
			? "flashcard"
			: sessionMode;

	const isFlashcard = effectiveMode === "flashcard";

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
				<ChoiceCardSm2
					key={currentIndex}
					word={frontWord}
					pos={frontPos}
					cardNumber={currentIndex + 1}
					options={options}
					correctIndex={correctIndex}
					onRate={rate}
				/>
			) : effectiveMode === "typing" ? (
				<TypingCardSm2
					key={currentIndex}
					word={frontWord}
					pos={frontPos}
					cardNumber={currentIndex + 1}
					correctAnswer={backTranslation}
					onRate={rate}
				/>
			) : (
				<FlipCard
					flipped={flipped}
					onFlip={flip}
					front={
						<FlashcardFront
							word={frontWord}
							pos={frontPos}
							cardNumber={currentIndex + 1}
							modeLabel={t(
								mode === "wordToTrans"
									? "review.sm2.card.modeFront"
									: "review.sm2.card.modeBack",
							)}
						/>
					}
					back={
						<FlashcardBack
							word={backWord}
							translation={backTranslation}
							pos={pos}
							context={current.latestContext}
							morphForms={lemma.morphForms}
						/>
					}
				/>
			)}

			{isFlashcard ? <RatingButtons visible={flipped} onRate={rate} /> : null}

			<div className="mt-2.5 flex w-full max-w-[520px] items-center gap-2">
				{onBack ? (
					<Button
						onClick={onBack}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
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
						{t("review.sm2.card.exit")}
					</Button>
				) : null}
				<Button
					onClick={skip}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
				>
					<svg viewBox="0 0 12 12" fill="none" className="size-3">
						<path
							d="M2 6h8M7 3l3 3-3 3"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("review.sm2.card.skip")}
				</Button>
				<div className="flex-1" />
				{isFlashcard ? (
					<Button
						onClick={toggleMode}
						aria-label={t("review.sm2.card.modeToggle")}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-3"
					>
						<svg viewBox="0 0 12 12" fill="none" className="size-3 text-t-3">
							<path
								d="M1 4h10M1 8h10M4 1L1 4l3 3"
								stroke="currentColor"
								strokeWidth="1.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{t(
							mode === "wordToTrans"
								? "review.sm2.card.modeBack"
								: "review.sm2.card.modeFront",
						)}
					</Button>
				) : null}
			</div>
		</div>
	);
};
