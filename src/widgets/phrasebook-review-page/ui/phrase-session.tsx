"use client";

import { useEffect } from "react";
import type { PhraseDue } from "@/entities/phrasebook";
import { FlipCard } from "@/features/flip-card";
import { RatePhraseButtons } from "@/features/rate-phrase";
import { useI18n } from "@/shared/lib/i18n";
import { useSwipe } from "@/shared/lib/swipe";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePhraseSession, type PhraseCounts } from "../model";
import { PhraseFront } from "./phrase-front";
import { PhraseBack } from "./phrase-back";

interface PhraseSessionProps {
	phrases: PhraseDue[];
	onFinish: (counts: PhraseCounts) => void;
	onBack?: () => void;
	onProgress?: (idx: number, total: number, counts: PhraseCounts) => void;
}

export const PhraseSession = ({ phrases, onFinish, onBack, onProgress }: PhraseSessionProps) => {
	const { t } = useI18n();
	const { current, currentIndex, total, flipped, flip, skip, rate } =
		usePhraseSession({ phrases, onFinish, onProgress });

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
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
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [flip, rate, flipped]);

	const handleSwipeLeft = () => rate(0);
	const handleSwipeRight = () => rate(5);

	const swipe = useSwipe({
		enabled: flipped,
		onSwipeLeft: handleSwipeLeft,
		onSwipeRight: handleSwipeRight,
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
						className="h-full origin-left rounded-full bg-acc transition-transform duration-400"
						style={{ transform: `scaleX(${progressPct / 100})` }}
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
						<ArrowLeft className="size-3" />
						{t("phrasebook.review.card.exit")}
					</Button>
				) : null}
				<Button
					onClick={skip}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent px-3 text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
				>
					<ArrowRight className="size-3" />
					{t("phrasebook.review.card.skip")}
				</Button>
			</div>
		</div>
	);
};
