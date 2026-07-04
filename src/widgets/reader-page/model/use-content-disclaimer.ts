"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "content_disclaimer_dismissed_at";
const MAX_STORED_TEXTS = 200;

type DismissedMap = Record<string, string>;

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const readDismissedMap = (): DismissedMap => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as DismissedMap) : {};
	} catch {
		return {};
	}
};

const writeDismissedMap = (map: DismissedMap) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch {
		// localStorage unavailable (private mode / SSR)
	}
};

const pruneOldEntries = (map: DismissedMap): DismissedMap => {
	const entries = Object.entries(map);
	if (entries.length <= MAX_STORED_TEXTS) return map;
	const sorted = entries.sort(([, a], [, b]) => (a < b ? 1 : -1));
	return Object.fromEntries(sorted.slice(0, MAX_STORED_TEXTS));
};

export const useContentDisclaimer = (textId: string) => {
	const [isDismissedToday, setIsDismissedToday] = useState(true);

	useEffect(() => {
		const map = readDismissedMap();
		setIsDismissedToday(map[textId] === getTodayKey());
	}, [textId]);

	const dismiss = () => {
		const map = pruneOldEntries({ ...readDismissedMap(), [textId]: getTodayKey() });
		writeDismissedMap(map);
		setIsDismissedToday(true);
	};

	return { showDisclaimer: !isDismissedToday, dismiss };
};
