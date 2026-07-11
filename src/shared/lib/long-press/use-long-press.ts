"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const LONG_PRESS_MS = 450;
const MOVE_CANCEL_THRESHOLD_PX = 10;

export interface UseLongPressOptions {
	onLongPress?: (event: ReactPointerEvent) => void;
}

export const useLongPress = ({ onLongPress }: UseLongPressOptions) => {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startPos = useRef<{ x: number; y: number } | null>(null);
	// Exposed so callers can render a press "build-up" affordance (e.g. a
	// subtle scale) while the long-press timer is running — see LONG_PRESS_MS.
	const [isPressing, setIsPressing] = useState(false);

	const clear = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = null;
		startPos.current = null;
		setIsPressing(false);
	};

	const handlePointerDown = (event: ReactPointerEvent) => {
		if (event.pointerType !== "touch" || !onLongPress) return;
		startPos.current = { x: event.clientX, y: event.clientY };
		setIsPressing(true);
		// Capture the native event now — React pools/reuses synthetic events,
		// so `event` itself may not be safe to read inside the timeout callback.
		const nativeEvent = event.nativeEvent;
		timerRef.current = setTimeout(() => {
			nativeEvent.preventDefault();
			setIsPressing(false);
			onLongPress(event);
		}, LONG_PRESS_MS);
	};

	const handlePointerMove = (event: ReactPointerEvent) => {
		if (!startPos.current) return;
		const dx = Math.abs(event.clientX - startPos.current.x);
		const dy = Math.abs(event.clientY - startPos.current.y);
		if (dx > MOVE_CANCEL_THRESHOLD_PX || dy > MOVE_CANCEL_THRESHOLD_PX) clear();
	};

	const handlePointerUp = () => clear();
	const handlePointerCancel = () => clear();

	return {
		isPressing,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerCancel,
	};
};
