"use client";

import { useEffect, useRef, useState } from "react";

import type { BeforeInstallPromptEvent, InstallOutcome } from "../types";

export const useInstallPrompt = () => {
	const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
	const [isAvailable, setIsAvailable] = useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			deferredPromptRef.current = e as BeforeInstallPromptEvent;
			setIsAvailable(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
	}, []);

	const triggerInstall = async (): Promise<InstallOutcome> => {
		const deferredPrompt = deferredPromptRef.current;
		if (!deferredPrompt) return null;

		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		deferredPromptRef.current = null;
		setIsAvailable(false);
		return outcome;
	};

	return { isAvailable, triggerInstall };
};
