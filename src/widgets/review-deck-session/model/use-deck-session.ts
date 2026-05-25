"use client";
import { useState, useRef } from 'react';
import type {
	DeckCard,
	DeckDueResponse,
	DeckRateResult,
} from "@/entities/deck";
import { useRateDeckCard } from "@/features/rate-deck-card";

export interface DeckCounts {
	know: number;
	again: number;
}

export interface UseDeckSessionResult {
	current: DeckCard | null;
	currentIndex: number;
	total: number;
	queue: DeckCard[];
	counts: DeckCounts;
	againCards: DeckCard[];
	currentAgainStreak: number;
	flipped: boolean;
	isFinished: boolean;
	flip: () => void;
	rate: (result: DeckRateResult) => void;
	resetIndex: () => void;
}

const flatten = (resp: DeckDueResponse): DeckCard[] => [
	...resp.repeat,
	...resp.new,
	...resp.old,
	...resp.retired,
	...resp.numbered,
];

export const useDeckSession = (
	due: DeckDueResponse | undefined,
): UseDeckSessionResult => {
	// Snapshot the queue once on first load — never mutate it during the session.
	// This prevents mid-session refetches (triggered by shouldRefreshDeck invalidation)
	// from reshuffling the queue and causing the same card to appear multiple times.
	const snapshotRef = useRef<DeckCard[] | null>(null);
	if (snapshotRef.current === null && due) {
		snapshotRef.current = flatten(due);
	}
	const queue = snapshotRef.current ?? [];

	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [counts, setCounts] = useState<DeckCounts>({ know: 0, again: 0 });
	const [againCards, setAgainCards] = useState<DeckCard[]>([]);
	// lemmaId → count of consecutive "again" answers without a "know" in between
	const againStreakRef = useRef<Map<string, number>>(new Map());

	const { mutate: rateMutation } = useRateDeckCard();

	const total = queue.length;
	const current = queue[index] ?? null;
	const isFinished = total > 0 && index >= total;
	const currentAgainStreak = current ? (againStreakRef.current.get(current.lemmaId) ?? 0) : 0;

	const flip = () => setFlipped((v) => !v);

	const rate = (result: DeckRateResult) => {
		if (!current) return;

		setCounts((prev) =>
			result === "know"
				? { ...prev, know: prev.know + 1 }
				: { ...prev, again: prev.again + 1 },
		);

		if (result === "again") {
			setAgainCards((prev) => [...prev, current]);
			againStreakRef.current.set(
				current.lemmaId,
				(againStreakRef.current.get(current.lemmaId) ?? 0) + 1,
			);
		} else {
			againStreakRef.current.delete(current.lemmaId);
		}

		rateMutation({ lemmaId: current.lemmaId, body: { result } });
		setFlipped(false);
		setIndex((i) => i + 1);
	};

	const resetIndex = () => {
		snapshotRef.current = null;
		againStreakRef.current = new Map();
		setIndex(0);
		setFlipped(false);
		setCounts({ know: 0, again: 0 });
		setAgainCards([]);
	};

	return {
		current,
		currentIndex: index,
		total,
		queue,
		counts,
		againCards,
		currentAgainStreak,
		flipped,
		isFinished,
		flip,
		rate,
		resetIndex,
	};
};
