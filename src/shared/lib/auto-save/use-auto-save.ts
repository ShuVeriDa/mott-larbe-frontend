"use client";
import { useEffect, useRef } from "react";

interface UseAutoSaveOptions {
	/** Called to perform the silent background save. Must be stable (use ref internally if needed). */
	onSave: () => Promise<void>;
	/** Whether there are unsaved changes to trigger auto-save for. */
	isDirty: boolean;
	/** Whether the record is ready to be auto-saved (e.g. already created on server). */
	isReady: boolean;
	/** Whether a save is currently in flight — pauses the schedule. */
	isSaving: boolean;
	/** Milliseconds to wait after last change before saving. Default 2500. */
	debounceMs?: number;
	/** Minimum milliseconds between saves even during continuous editing. Default 30000. */
	throttleMs?: number;
}

/**
 * Schedules silent background saves using debounce + throttle.
 *
 * - Debounce: waits `debounceMs` after last change before firing.
 * - Throttle: forces a save every `throttleMs` during continuous editing
 *   so the user never loses more than 30 s of work.
 * - Pauses when `isSaving` is true to avoid concurrent requests.
 * - Does nothing when `isReady` is false (record not yet persisted).
 */
export const useAutoSave = ({
	onSave,
	isDirty,
	isReady,
	isSaving,
	debounceMs = 2500,
	throttleMs = 30_000,
}: UseAutoSaveOptions) => {
	const onSaveRef = useRef(onSave);
	onSaveRef.current = onSave;

	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastSavedRef = useRef<number>(0);
	const isSavingRef = useRef(isSaving);
	isSavingRef.current = isSaving;

	const clearDebounce = () => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}
	};

	const clearThrottle = () => {
		if (throttleTimerRef.current) {
			clearTimeout(throttleTimerRef.current);
			throttleTimerRef.current = null;
		}
	};

	const executeSave = async () => {
		if (isSavingRef.current) return;
		clearDebounce();
		clearThrottle();
		lastSavedRef.current = Date.now();
		await onSaveRef.current();
	};

	useEffect(() => {
		if (!isDirty || !isReady) {
			clearDebounce();
			clearThrottle();
			return;
		}

		// Debounce: reset on every change, fires `debounceMs` after the last one
		clearDebounce();
		debounceTimerRef.current = setTimeout(() => void executeSave(), debounceMs);

		// Throttle: if no save has happened in `throttleMs`, force one
		const timeSinceSave = Date.now() - lastSavedRef.current;
		if (!throttleTimerRef.current && timeSinceSave < throttleMs) {
			const remaining = throttleMs - timeSinceSave;
			throttleTimerRef.current = setTimeout(() => void executeSave(), remaining);
		}

		return () => {
			// Intentionally not clearing on every render —
			// timers are cleared in executeSave or when dirty/ready change.
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty, isReady, debounceMs, throttleMs]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearDebounce();
			clearThrottle();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
