"use client";

import { useCallback, useState } from "react";

export interface UseFlipStateResult {
	flipped: boolean;
	flip: () => void;
	reset: () => void;
}

export const useFlipState = (initial = false): UseFlipStateResult => {
	const [flipped, setFlipped] = useState(initial);
	const flip = useCallback(() => setFlipped((v) => !v), []);
	const reset = useCallback(() => setFlipped(false), []);
	return { flipped, flip, reset };
};
