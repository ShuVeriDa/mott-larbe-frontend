"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAdminAnalyticsRealtime } from "@/features/admin-analytics";
import { adminAnalyticsApi } from "@/features/admin-analytics";
import type { AnalyticsLiveEvent, AnalyticsLiveEventType } from "@/features/admin-analytics";

const FEED_LIMIT = 100;
const POLL_MS = 5_000;
const JUST_IN_MS = 1_500;

export const useLiveState = () => {
	const [events, setEvents] = useState<(AnalyticsLiveEvent & { _justIn?: boolean })[]>([]);
	const [filter, setFilter] = useState<AnalyticsLiveEventType | null>(null);
	const [paused, setPaused] = useState(false);
	const maxIdRef = useRef<string | undefined>(undefined);
	const pausedRef = useRef(false);
	const justInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const realtime = useAdminAnalyticsRealtime();

	useEffect(() => {
		pausedRef.current = paused;
	}, [paused]);

	const fetchEvents = useCallback(async () => {
		if (pausedRef.current) return;
		try {
			const fresh = await adminAnalyticsApi.getRecent({
				limit: 50,
				sinceId: maxIdRef.current,
				eventType: filter ?? undefined,
			});
			if (!fresh.length) return;

			maxIdRef.current = fresh[0].id;

			let addedIds: Set<string> | null = null as Set<string> | null;

			setEvents((prev) => {
				const existingIds = new Set(prev.map((e) => e.id));
				const newItems = fresh
					.filter((e) => !existingIds.has(e.id))
					.map((e) => ({ ...e, _justIn: true as const }));
				if (!newItems.length) return prev;
				addedIds = new Set(newItems.map((e) => e.id));
				return [...newItems, ...prev].slice(0, FEED_LIMIT);
			});

			if (!addedIds) return;

			const capturedIds = addedIds;
			if (justInTimerRef.current !== null) clearTimeout(justInTimerRef.current);
			justInTimerRef.current = setTimeout(() => {
				setEvents((cur) =>
					cur.map((e) => (capturedIds.has(e.id) ? { ...e, _justIn: false } : e)),
				);
				justInTimerRef.current = null;
			}, JUST_IN_MS);
		} catch {
			// silently ignore poll errors
		}
	}, [filter]);

	useEffect(() => {
		return () => {
			if (justInTimerRef.current !== null) clearTimeout(justInTimerRef.current);
		};
	}, []);

	useEffect(() => {
		void fetchEvents();
		const id = setInterval(fetchEvents, POLL_MS);
		return () => clearInterval(id);
	}, [fetchEvents]);

	const handleTogglePause = () => setPaused((p) => !p);
	const handleClear = () => setEvents([]);
	const handleFilterChange = (type: AnalyticsLiveEventType | null) => {
		setFilter(type);
		setEvents([]);
		maxIdRef.current = undefined;
	};

	const visibleEvents = filter ? events.filter((e) => e.eventType === filter) : events;

	return {
		events: visibleEvents,
		filter,
		paused,
		realtime,
		handleTogglePause,
		handleClear,
		handleFilterChange,
	};
};
