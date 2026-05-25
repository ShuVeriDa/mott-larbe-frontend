"use client";
import { useState } from "react";
import type { SessionMode } from "./types";

const STORAGE_KEY = "review:sessionMode";

const readStored = (): SessionMode => {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === "flashcard" || v === "choice" || v === "typing") return v;
	} catch {
		// localStorage unavailable (SSR, private mode)
	}
	return "flashcard";
};

export const useSessionMode = () => {
	const [mode, setModeState] = useState<SessionMode>(readStored);

	const setMode = (next: SessionMode) => {
		setModeState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// ignore
		}
	};

	return { mode, setMode };
};
