"use client";

import { create } from "zustand";
import type { TextToken } from "@/entities/text";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";

export type WordLookupSurface = "popup" | "panel" | "sheet" | null;

export interface PopupAnchor {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface WordLookupState {
	activeToken: TextToken | null;
	activePhrase: PagePhraseOccurrence | null;
	contextSentence: string | undefined;
	surface: WordLookupSurface;
	anchor: PopupAnchor | null;
	panelOpen: boolean;
	panelPinned: boolean;
	sheetExpanded: boolean;
	openInPopup: (token: TextToken, anchor: PopupAnchor, contextSentence?: string) => void;
	openPhraseInPopup: (phrase: PagePhraseOccurrence, anchor: PopupAnchor) => void;
	openInPanel: (token: TextToken | null, contextSentence?: string) => void;
	openInSheet: (token: TextToken, contextSentence?: string) => void;
	openInSheetExpanded: (token: TextToken, contextSentence?: string) => void;
	/** Narrow layout: word tray open with no token (empty hint UI). */
	openEmptyWordSheet: () => void;
	togglePanel: () => void;
	closePanel: () => void;
	closePopup: () => void;
	closeSheet: () => void;
	clear: () => void;
}

export const useWordLookupStore = create<WordLookupState>((set) => ({
	activeToken: null,
	activePhrase: null,
	contextSentence: undefined,
	surface: null,
	anchor: null,
	panelOpen: false,
	panelPinned: false,
	sheetExpanded: false,
	openInPopup: (token, anchor, contextSentence) =>
		set({
			activeToken: token,
			activePhrase: null,
			contextSentence,
			surface: "popup",
			anchor,
		}),
	openPhraseInPopup: (phrase, anchor) =>
		set({
			activePhrase: phrase,
			activeToken: null,
			contextSentence: undefined,
			surface: "popup",
			anchor,
		}),
	openInPanel: (token, contextSentence) =>
		set((state) => ({
			activeToken: token,
			contextSentence,
			surface: token ? "panel" : state.surface,
			panelOpen: true,
			panelPinned: true,
			anchor: null,
		})),
	openInSheet: (token, contextSentence) =>
		set({
			activeToken: token,
			contextSentence,
			surface: "sheet",
			anchor: null,
			sheetExpanded: false,
		}),
	openInSheetExpanded: (token, contextSentence) =>
		set({
			activeToken: token,
			contextSentence,
			surface: "sheet",
			anchor: null,
			sheetExpanded: true,
		}),
	openEmptyWordSheet: () =>
		set({
			activeToken: null,
			surface: "sheet",
			anchor: null,
		}),
	togglePanel: () =>
		set((state) => ({
			panelOpen: !state.panelOpen,
			panelPinned: !state.panelOpen,
		})),
	closePanel: () =>
		set({ panelOpen: false, panelPinned: false }),
	closePopup: () =>
		set((state) =>
			state.surface === "popup"
				? { surface: null, activeToken: null, activePhrase: null, contextSentence: undefined, anchor: null }
				: state,
		),
	closeSheet: () =>
		set((state) =>
			state.surface === "sheet"
				? { surface: null, activeToken: null, contextSentence: undefined, sheetExpanded: false }
				: state,
		),
	clear: () =>
		set({
			activeToken: null,
			activePhrase: null,
			contextSentence: undefined,
			surface: null,
			anchor: null,
			sheetExpanded: false,
		}),
}));
