"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
	counts: DeckCounts;
	flipped: boolean;
	isFinished: boolean;
	flip: () => void;
	rate: (result: DeckRateResult) => void;
	resetIndex: () => void;
}

const flatten = (resp: DeckDueResponse): DeckCard[] => [
	...resp.new,
	...resp.old,
	...resp.retired,
	...resp.numbered,
];

export const useDeckSession = (
	due: DeckDueResponse | undefined,
): UseDeckSessionResult => {
	const queue = useMemo(() => (due ? flatten(due) : []), [due]);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [counts, setCounts] = useState<DeckCounts>({ know: 0, again: 0 });

	const { mutate: rateMutation } = useRateDeckCard();

	useEffect(() => {
		setFlipped(false);
	}, [index]);

	const total = queue.length;
	const current = queue[index] ?? null;
	const isFinished = total > 0 && index >= total;

	const flip = useCallback(() => setFlipped((v) => !v), []);

	const rate = useCallback(
		(result: DeckRateResult) => {
			if (!current) return;

			setCounts((prev) =>
				result === "know"
					? { ...prev, know: prev.know + 1 }
					: { ...prev, again: prev.again + 1 },
			);

			rateMutation({ lemmaId: current.lemmaId, body: { result } });
			setFlipped(false);
			setIndex((i) => i + 1);
		},
		[current, rateMutation],
	);

	const resetIndex = useCallback(() => {
		setIndex(0);
		setFlipped(false);
		setCounts({ know: 0, again: 0 });
	}, []);

	return {
		current,
		currentIndex: index,
		total,
		counts,
		flipped,
		isFinished,
		flip,
		rate,
		resetIndex,
	};
};
