"use client";

import { useEffect } from "react";
import type { PhraseDue } from "@/entities/phrasebook";
import { FlipCard } from "@/features/flip-card";
import { RatePhraseButtons } from "@/features/rate-phrase";
import { useI18n } from "@/shared/lib/i18n";
import { useSwipe } from "@/shared/lib/swipe";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { usePhraseSession, type PhraseCounts } from "../model";

interface PhraseSessionProps {
	phrases: PhraseDue[];
	onFinish: (counts: PhraseCounts) => void;
	onBack?: () => void;
	onProgress?: (idx: number, total: number, counts: PhraseCounts) => void;
}

export const PhraseSession = ({ phrases, onFinish, onBack, onProgress }: PhraseSessionProps) => {
	const { t } = useI18n();
	const { current, currentIndex, total, flipped, counts, isFinished, flip, skip, rate } =
		usePhraseSession(phrases);

	useEffect(() => {
		onProgress?.(currentIndex, total, counts);
	}, [counts, currentIndex, onProgress, total]);

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
			const quality =
				e.key === "1" ? 0 : e.key === "2" ? 2 : e.key === "3" ? 4 : e.key === "4" ? 5 : null;
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

	if (!current) return null;

	const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

	return (
		<div
			className="flex flex-1 flex-col items-center px-5 pt-5 pb-4 max-md:px-4 max-md:pt-3.5"
			onPointerDown={swipe.onPointerDown}
			onPointerUp={swipe.onPointerUp}
			onPointerCancel={swipe.onPointerCancel}
		>
			{/* Progress bar */}
			<div className="mb-4 flex w-full max-w-[520px] items-center gap-2.5">
				<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-acc transition-[width] duration-400"
						style={{ width: `${progressPct}%` }}
					/>
				</div>
				<Typography tag="span" className="text-[11.5px] font-semibold text-t-2 tabular-nums">
					{currentIndex + 1}
				</Typography>
				<Typography tag="span" className="text-[11.5px] text-t-3">
					/ {total}
				</Typography>
			</div>

			{/* Flashcard */}
			<FlipCard
				flipped={flipped}
				onFlip={flip}
				front={<PhraseFront phrase={current} cardNumber={currentIndex + 1} />}
				back={<PhraseBack phrase={current} />}
			/>

			{/* Rating buttons */}
			<RatePhraseButtons visible={flipped} onRate={rate} />

			{/* Bottom controls */}
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
						{t("phrasebook.review.card.exit")}
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
					{t("phrasebook.review.card.skip")}
				</Button>
			</div>
		</div>
	);
};

interface PhraseFrontProps {
	phrase: PhraseDue;
	cardNumber: number;
}

const LANG_DOT_COLOR: Record<string, string> = {
	che: "#e53935",
	ru: "#3b82f6",
	ar: "#f59e0b",
	en: "#22c55e",
};

const PhraseFront = ({ phrase, cardNumber }: PhraseFrontProps) => {
	const { t } = useI18n();
	const dotColor = LANG_DOT_COLOR[phrase.lang] ?? LANG_DOT_COLOR.che;

	return (
		<>
			<Typography
				tag="span"
				className="absolute right-3.5 top-3 text-[10.5px] text-t-3"
			>
				#{cardNumber}
			</Typography>
			<div className="flex flex-col items-center gap-1">
				<span
					className="mb-1 h-1.5 w-1.5 rounded-full"
					style={{ backgroundColor: dotColor }}
					aria-label={phrase.lang.toUpperCase()}
				/>
				<Typography
					tag="h2"
					className="mb-0.5 text-center font-display text-[30px] font-normal leading-[1.25] tracking-[-0.3px] text-t-1 max-md:text-[26px]"
				>
					{phrase.original}
				</Typography>
				{phrase.transliteration ? (
					<Typography className="text-center text-[13px] italic text-t-3">
						{phrase.transliteration}
					</Typography>
				) : null}
			</div>
			<Typography className="mt-3.5 flex items-center gap-1 text-[12px] text-t-3 opacity-60">
				<svg viewBox="0 0 13 13" fill="none" className="size-3">
					<circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" />
					<path d="M6.5 5v1.5l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
				</svg>
				{t("review.sm2.card.flipHint")}
			</Typography>
		</>
	);
};

interface PhraseBackProps {
	phrase: PhraseDue;
}

const PhraseBack = ({ phrase }: PhraseBackProps) => {
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col items-center">
			<div className="mb-3 flex w-full flex-col items-center border-b border-bd-1 pb-3">
				<Typography tag="h2" className="mb-0.5 font-display text-[21px] font-normal text-t-1">
					{phrase.original}
				</Typography>
				{phrase.transliteration ? (
					<Typography className="mb-1 text-center text-[13px] italic text-t-3">
						{phrase.transliteration}
					</Typography>
				) : null}
				<Typography className="text-center text-[17px] font-medium text-acc">
					{phrase.translation}
				</Typography>
			</div>

			{phrase.words.length > 0 ? (
				<div className="w-full">
					<Typography className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("phrasebook.review.card.wordBreakdown")}
					</Typography>
					<div className="flex flex-wrap gap-1">
						{phrase.words.map((w) => (
							<div
								key={w.id}
								className="rounded-[4px] border-[0.5px] border-bd-2 bg-surf-2 px-2 py-1"
							>
								<Typography tag="span" className="block text-[12px] font-medium text-t-1">
									{w.original}
								</Typography>
								<Typography tag="span" className="block text-[11px] text-t-3">
									{w.translation}
								</Typography>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};
