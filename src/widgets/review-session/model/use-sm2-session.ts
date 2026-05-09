"use client";
import { type ReviewDueWord, type ReviewQuality } from "@/entities/review";
import { useRateWord } from "@/features/rate-word";
import { useState } from "react";

export type Sm2Mode = "wordToTrans" | "transToWord";

export interface Sm2Counts {
	easy: number;
	good: number;
	hard: number;
}

export interface UseSm2SessionResult {
	current: ReviewDueWord | null;
	currentIndex: number;
	total: number;
	mode: Sm2Mode;
	flipped: boolean;
	counts: Sm2Counts;
	isFinished: boolean;
	flip: () => void;
	skip: () => void;
	rate: (quality: ReviewQuality) => void;
	toggleMode: () => void;
	resetIndex: () => void;
}

export const useSm2Session = (words: ReviewDueWord[]): UseSm2SessionResult => {
	const [index, setIndex] = useState(0);
	const [mode, setMode] = useState<Sm2Mode>("wordToTrans");
	const [flipped, setFlipped] = useState(false);
	const [counts, setCounts] = useState<Sm2Counts>({
		easy: 0,
		good: 0,
		hard: 0,
	});

	const { mutate: rateMutation } = useRateWord();

	const total = words.length;
	const current = words[index] ?? null;
	const isFinished = total > 0 && index >= total;

	const advance = () => {
		setFlipped(false);
		setIndex(i => i + 1);
	};

	const flip = () => setFlipped(v => !v);

	const skip = () => {
		if (!current) return;
		advance();
	};

	const rate = (quality: ReviewQuality) => {
		if (!current) return;

		setCounts(prev => {
			if (quality >= 5) return { ...prev, easy: prev.easy + 1 };
			if (quality >= 3) return { ...prev, good: prev.good + 1 };
			return { ...prev, hard: prev.hard + 1 };
		});

		rateMutation({ lemmaId: current.lemmaId, body: { quality } });
		advance();
	};

	const toggleMode = () => {
		setMode(m => (m === "wordToTrans" ? "transToWord" : "wordToTrans"));
		setFlipped(false);
	};

	const resetIndex = () => {
		setIndex(0);
		setFlipped(false);
		setCounts({ easy: 0, good: 0, hard: 0 });
	};

	return {
		current,
		currentIndex: index,
		total,
		mode,
		flipped,
		counts,
		isFinished,
		flip,
		skip,
		rate,
		toggleMode,
		resetIndex,
	};
};
