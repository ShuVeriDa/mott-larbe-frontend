"use client";

import { useState } from "react";
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
	isFinished: boolean;
	flip: () => void;
	skip: () => void;
	rate: (quality: PhraseReviewQuality) => void;
}

export const usePhraseSession = (phrases: PhraseDue[]): UsePhraseSessionResult => {
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [counts, setCounts] = useState<PhraseCounts>({ easy: 0, good: 0, hard: 0 });
	const { mutate: rateMutation } = useRatePhrase();

	const total = phrases.length;
	const current = phrases[index] ?? null;
	const isFinished = total > 0 && index >= total;

	const advance = () => {
		setFlipped(false);
		setIndex((i) => i + 1);
	};

	const flip = () => setFlipped((v) => !v);

	const skip = () => {
		if (!current) return;
		advance();
	};

	const rate = (quality: PhraseReviewQuality) => {
		if (!current) return;
		setCounts((prev) => {
			if (quality >= 5) return { ...prev, easy: prev.easy + 1 };
			if (quality >= 3) return { ...prev, good: prev.good + 1 };
			return { ...prev, hard: prev.hard + 1 };
		});
		rateMutation({ phraseId: current.id, quality });
		advance();
	};

	return { current, currentIndex: index, total, flipped, counts, isFinished, flip, skip, rate };
};
