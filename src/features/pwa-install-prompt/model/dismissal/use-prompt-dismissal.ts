"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pwa-install-dismissed-at";
const SNOOZE_DAYS = 14;

const readDismissedAt = (): number | null => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? Number(raw) : null;
	} catch {
		return null;
	}
};

const writeDismissedAt = (): void => {
	try {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
	} catch {
		// ignore
	}
};

export const usePromptDismissal = () => {
	const [isDismissed, setIsDismissed] = useState(true);

	useEffect(() => {
		const dismissedAt = readDismissedAt();
		if (!dismissedAt) {
			setIsDismissed(false);
			return;
		}
		const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
		setIsDismissed(daysSince < SNOOZE_DAYS);
	}, []);

	const dismiss = () => {
		writeDismissedAt();
		setIsDismissed(true);
	};

	return { isDismissed, dismiss };
};
