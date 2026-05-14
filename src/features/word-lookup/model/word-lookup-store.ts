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
	surface: WordLookupSurface;
	anchor: PopupAnchor | null;
	panelOpen: boolean;
	panelPinned: boolean;
	openInPopup: (token: TextToken, anchor: PopupAnchor) => void;
	openPhraseInPopup: (phrase: PagePhraseOccurrence, anchor: PopupAnchor) => void;
	openInPanel: (token: TextToken | null) => void;
	openInSheet: (token: TextToken) => void;
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
	surface: null,
	anchor: null,
	panelOpen: false,
	panelPinned: false,
	openInPopup: (token, anchor) =>
		set({
			activeToken: token,
			activePhrase: null,
			surface: "popup",
			anchor,
		}),
	openPhraseInPopup: (phrase, anchor) =>
		set({
			activePhrase: phrase,
			activeToken: null,
			surface: "popup",
			anchor,
		}),
	openInPanel: (token) =>
		set((state) => ({
			activeToken: token,
			surface: token ? "panel" : state.surface,
			panelOpen: true,
			panelPinned: true,
			anchor: null,
		})),
	openInSheet: (token) =>
		set({
			activeToken: token,
			surface: "sheet",
			anchor: null,
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
				? { surface: null, activeToken: null, activePhrase: null, anchor: null }
				: state,
		),
	closeSheet: () =>
		set((state) =>
			state.surface === "sheet"
				? { surface: null, activeToken: null }
				: state,
		),
	clear: () =>
		set({
			activeToken: null,
			activePhrase: null,
			surface: null,
			anchor: null,
		}),
}));
