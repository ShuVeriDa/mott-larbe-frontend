"use client";

import {
	type ReviewDueWord,
	type ReviewQuality,
	getPrimaryTranslation,
} from "@/entities/review";
import { FlipCard } from "@/features/flip-card";
import { RatingButtons } from "@/features/rate-word";
import type { SessionMode } from "@/features/session-mode";
import { duration, ease } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { useSwipe } from "@/shared/lib/swipe";
import { MotionButton } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { buildSm2Options } from "../../lib/build-sm2-options";
import { useSm2Session } from "../../model";
import { ChoiceCardSm2 } from "../choice-card";
import { FlashcardBack } from "../flashcard-back";
import { FlashcardFront } from "../flashcard-front";
import { TypingCardSm2 } from "../typing-card";
import { SwipeHint } from "./swipe-hint";

const SWIPE_HINT_KEY = "review_swipe_hint_seen";

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

export const Sm2Session = ({
	words,
	sessionMode = "flashcard",
	onFinish,
	onBack,
	onProgress,
}: Sm2SessionProps) => {
	const { t } = useI18n();
	const [swipeHintVisible, setSwipeHintVisible] = useState(
		() => typeof window !== "undefined" && !localStorage.getItem(SWIPE_HINT_KEY),
	);
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
		const handleKey = (e: KeyboardEvent) => {
			const tag = (e.currentTarget as Window & typeof globalThis) === window
				? (e.target as HTMLElement | null)?.tagName
				: null;
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

	const handleRate = (quality: ReviewQuality) => {
		const nextIndex = currentIndex + 1;
		const nextCounts = {
			...counts,
			easy: quality === 5 ? counts.easy + 1 : counts.easy,
			good: quality === 4 ? counts.good + 1 : counts.good,
			hard: quality <= 2 ? counts.hard + 1 : counts.hard,
		};
		onProgress?.(nextIndex, total, nextCounts);
		rate(quality);
		if (nextIndex >= total) {
			onFinish(nextCounts);
		}
	};

	const handleSkip = () => {
		const nextIndex = currentIndex + 1;
		onProgress?.(nextIndex, total, counts);
		skip();
		if (nextIndex >= total) {
			onFinish(counts);
		}
	};

	const handleDismissHint = () => {
		if (!swipeHintVisible) return;
		localStorage.setItem(SWIPE_HINT_KEY, "1");
		setSwipeHintVisible(false);
	};

	const swipe = useSwipe({
		enabled: flipped,
		onSwipeLeft: () => { handleDismissHint(); handleRate(0); },
		onSwipeRight: () => { handleDismissHint(); handleRate(5); },
	});

	const { options, correctIndex } = buildSm2Options(words, currentIndex);

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
					<motion.div
						className="h-full origin-left rounded-full bg-acc"
						animate={{ scaleX: progressPct / 100 }}
						transition={{ duration: duration.slow, ease: ease.enter }}
						style={{ originX: 0 }}
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
					onRate={handleRate}
				/>
			) : effectiveMode === "typing" ? (
				<TypingCardSm2
					key={currentIndex}
					word={frontWord}
					pos={frontPos}
					cardNumber={currentIndex + 1}
					correctAnswer={backTranslation}
					onRate={handleRate}
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

			<AnimatePresence>
				{isFlashcard && <RatingButtons key="rating" visible={flipped} onRate={handleRate} />}
			</AnimatePresence>
			<AnimatePresence>
				{isFlashcard && <SwipeHint key="hint" visible={flipped && swipeHintVisible} />}
			</AnimatePresence>

			<div className="mt-2.5 flex w-full max-w-[520px] items-center gap-2">
				{onBack ? (
					<MotionButton
						onClick={onBack}
						whileTap={{ scale: 0.95 }}
						className="flex h-10 cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<ArrowLeft className="size-3" />
						{t("review.sm2.card.exit")}
					</MotionButton>
				) : null}
				<MotionButton
					onClick={handleSkip}
					whileTap={{ scale: 0.95 }}
					className="flex h-10 cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
				>
					<ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform duration-150 ease-out" />
					{t("review.sm2.card.skip")}
				</MotionButton>
				<div className="flex-1" />
				<AnimatePresence>
					{isFlashcard && (
						<MotionButton
							key="mode-toggle"
							onClick={toggleMode}
							whileTap={{ scale: 0.95 }}
							aria-label={t("review.sm2.card.modeToggle")}
							className="flex h-10 cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-3"
						>
							<ArrowRightLeft className="size-3 text-t-3" />
							{t(
								mode === "wordToTrans"
									? "review.sm2.card.modeBack"
									: "review.sm2.card.modeFront",
							)}
						</MotionButton>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};
