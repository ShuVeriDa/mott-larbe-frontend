"use client";

import { useRef, useState } from "react";
import { useRatePhrase } from "@/features/rate-phrase";
import type { PhraseDue, PhraseReviewQuality } from "@/entities/phrasebook";

export interface PhraseCounts {
	easy: number;
	good: number;
	hard: number;
}

export interface UsePhraseSessionResult {
	current: PhraseDue | null;
	currentIndex: number;
	total: number;
	flipped: boolean;
	counts: PhraseCounts;
	flip: () => void;
	skip: () => void;
	rate: (quality: PhraseReviewQuality) => void;
}

interface UsePhraseSessionOptions {
	phrases: PhraseDue[];
	onFinish?: (counts: PhraseCounts) => void;
	onProgress?: (idx: number, total: number, counts: PhraseCounts) => void;
}

export const usePhraseSession = ({
	phrases,
	onFinish,
	onProgress,
}: UsePhraseSessionOptions): UsePhraseSessionResult => {
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [counts, setCounts] = useState<PhraseCounts>({ easy: 0, good: 0, hard: 0 });
	const { mutate: rateMutation } = useRatePhrase();

	const indexRef = useRef(index);
	const countsRef = useRef(counts);
	indexRef.current = index;
	countsRef.current = counts;

	const total = phrases.length;
	const current = phrases[index] ?? null;

	const advance = (nextIndex: number, nextCounts: PhraseCounts) => {
		setFlipped(false);
		setIndex(nextIndex);
		if (nextIndex >= total) {
			onFinish?.(nextCounts);
		} else {
			onProgress?.(nextIndex, total, nextCounts);
		}
	};

	const flip = () => setFlipped((v) => !v);

	const skip = () => {
		const nextIndex = indexRef.current + 1;
		advance(nextIndex, countsRef.current);
	};

	const rate = (quality: PhraseReviewQuality) => {
		const prev = countsRef.current;
		const nextCounts =
			quality >= 5
				? { ...prev, easy: prev.easy + 1 }
				: quality >= 3
					? { ...prev, good: prev.good + 1 }
					: { ...prev, hard: prev.hard + 1 };
		countsRef.current = nextCounts;
		setCounts(nextCounts);
		rateMutation({ phraseId: phrases[indexRef.current]!.id, quality });
		advance(indexRef.current + 1, nextCounts);
		indexRef.current += 1;
	};

	return { current, currentIndex: index, total, flipped, counts, flip, skip, rate };
};
