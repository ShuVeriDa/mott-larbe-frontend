"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderScript = "CYRILLIC" | "LATIN" | "ARABIC";

interface ReaderScriptState {
	script: ReaderScript;
	showDiacritics: boolean;
	setScript: (script: ReaderScript) => void;
	setShowDiacritics: (value: boolean) => void;
}

export const useReaderScript = create<ReaderScriptState>()(
	persist(
		(set) => ({
			script: "CYRILLIC",
			showDiacritics: true,
			setScript: (script) => set({ script }),
			setShowDiacritics: (value) => set({ showDiacritics: value }),
		}),
		{ name: "reader-script" },
	),
);
