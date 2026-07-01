"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderScript = "CYRILLIC" | "LATIN" | "ARABIC";
export type ReaderOrthography = "NEW" | "OLD";

interface ReaderScriptState {
	script: ReaderScript;
	showDiacritics: boolean;
	orthography: ReaderOrthography;
	setScript: (script: ReaderScript) => void;
	setShowDiacritics: (value: boolean) => void;
	setOrthography: (o: ReaderOrthography) => void;
}

export const useReaderScript = create<ReaderScriptState>()(
	persist(
		(set) => ({
			script: "CYRILLIC",
			showDiacritics: true,
			orthography: "NEW",
			setScript: (script) => set({ script }),
			setShowDiacritics: (value) => set({ showDiacritics: value }),
			setOrthography: (orthography) => set({ orthography }),
		}),
		{ name: "reader-script" },
	),
);
