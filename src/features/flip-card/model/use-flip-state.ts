"use client";
import { useState } from 'react';
export interface UseFlipStateResult {
	flipped: boolean;
	flip: () => void;
	reset: () => void;
}

export const useFlipState = (initial = false): UseFlipStateResult => {
	const [flipped, setFlipped] = useState(initial);
	const flip = () => setFlipped((v) => !v);
	const reset = () => setFlipped(false);
	return { flipped, flip, reset };
};
