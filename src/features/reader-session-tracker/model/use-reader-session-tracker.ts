"use client";
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from "@/shared/config";
import { useEffect, useRef } from "react";

const MIN_DURATION_S = 10;

const flush = (textId: string, durationSeconds: number, wordsRead: number | undefined) => {
	if (durationSeconds < MIN_DURATION_S) return;

	const match = typeof document !== "undefined"
		? document.cookie.match(new RegExp(`(?:^|; )${ACCESS_TOKEN_STORAGE_KEY}=([^;]*)`))
		: null;
	const token = match ? decodeURIComponent(match[1]) : null;
	if (!token) return;

	const body = JSON.stringify({
		textId,
		durationSeconds,
		...(wordsRead ? { wordsRead } : {}),
	});

	// keepalive: true ensures the request completes even when the page is unloading
	void fetch(`${API_URL}/statistics/reading-time`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body,
		keepalive: true,
	}).catch(() => undefined);
};

export const useReaderSessionTracker = (textId: string, pageNumber: number, wordCount: number) => {
	const startRef = useRef<number>(Date.now());
	const wordCountRef = useRef<number>(wordCount);
	wordCountRef.current = wordCount;

	// Flush and reset timer when textId or pageNumber changes (user navigates to next page)
	useEffect(() => {
		startRef.current = Date.now();

		return () => {
			const duration = Math.round((Date.now() - startRef.current) / 1000);
			flush(textId, duration, wordCountRef.current || undefined);
		};
	}, [textId, pageNumber]);

	// Flush on tab hide / page unload; reset timer on tab show
	useEffect(() => {
		let flushedOnHide = false;

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				flushedOnHide = true;
				const duration = Math.round((Date.now() - startRef.current) / 1000);
				flush(textId, duration, wordCountRef.current || undefined);
			} else {
				flushedOnHide = false;
				// Tab became visible again — restart the timer
				startRef.current = Date.now();
			}
		};

		const handlePageHide = () => {
			// visibilitychange fires before pagehide on tab close — skip double flush
			if (flushedOnHide) return;
			const duration = Math.round((Date.now() - startRef.current) / 1000);
			flush(textId, duration, wordCountRef.current || undefined);
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("pagehide", handlePageHide);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("pagehide", handlePageHide);
		};
	}, [textId]);
};
