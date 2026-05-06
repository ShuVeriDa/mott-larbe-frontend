"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface UseSwipeOptions {
	threshold?: number;
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	enabled?: boolean;
}

export interface SwipeHandlers {
	onPointerDown: (e: ReactPointerEvent) => void;
	onPointerUp: (e: ReactPointerEvent) => void;
	onPointerCancel: () => void;
}

export const useSwipe = ({
	threshold = 40,
	onSwipeLeft,
	onSwipeRight,
	enabled = true,
}: UseSwipeOptions): SwipeHandlers => {
	const origin = useRef<{ x: number; y: number } | null>(null);

	const onPointerDown = useCallback(
		(e: ReactPointerEvent) => {
			if (!enabled || e.pointerType === "mouse") return;
			origin.current = { x: e.clientX, y: e.clientY };
		},
		[enabled],
	);

	const onPointerUp = useCallback(
		(e: ReactPointerEvent) => {
			if (!enabled || !origin.current) return;
			const dx = e.clientX - origin.current.x;
			const dy = e.clientY - origin.current.y;
			origin.current = null;

			if (Math.abs(dx) < threshold) return;
			if (Math.abs(dx) <= Math.abs(dy) * 1.5) return;

			if (dx < 0) onSwipeLeft?.();
			else onSwipeRight?.();
		},
		[enabled, threshold, onSwipeLeft, onSwipeRight],
	);

	const onPointerCancel = useCallback(() => {
		origin.current = null;
	}, []);

	return { onPointerDown, onPointerUp, onPointerCancel };
};
