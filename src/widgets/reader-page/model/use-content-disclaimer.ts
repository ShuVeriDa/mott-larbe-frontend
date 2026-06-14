"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "content_disclaimer_dismissed";

export const useContentDisclaimer = () => {
	const [isDismissed, setIsDismissed] = useState(true);

	useEffect(() => {
		try {
			setIsDismissed(localStorage.getItem(STORAGE_KEY) === "1");
		} catch {
			setIsDismissed(true);
		}
	}, []);

	const dismiss = () => {
		try {
			localStorage.setItem(STORAGE_KEY, "1");
		} catch {
			// localStorage unavailable (private mode / SSR)
		}
		setIsDismissed(true);
	};

	return { showDisclaimer: !isDismissed, dismiss };
};
