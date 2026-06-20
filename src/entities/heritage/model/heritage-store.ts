"use client";

import { create } from "zustand";
import type { HeritageFormState } from "./types";

interface HeritageFormStore extends HeritageFormState {
	setSelectedNationSlug: (slug: string | null) => void;
	setSelectedTukhumId: (tukhumId: string | null) => void;
	setHasTukhum: (hasTukhum: boolean | null) => void;
	setSelectedTaipId: (taipId: string | null) => void;
	setShowAllTaips: (show: boolean) => void;
	resetForm: () => void;
}

const DEFAULT_STATE: HeritageFormState = {
	selectedNationSlug: null,
	selectedTukhumId: null,
	hasTukhum: null,
	selectedTaipId: null,
	showAllTaips: false,
};

export const useHeritageFormStore = create<HeritageFormStore>((set) => ({
	...DEFAULT_STATE,

	setSelectedNationSlug: (slug) =>
		set({
			selectedNationSlug: slug,
			selectedTukhumId: null,
			hasTukhum: null,
			selectedTaipId: null,
			showAllTaips: false,
		}),

	setSelectedTukhumId: (tukhumId) =>
		set({
			selectedTukhumId: tukhumId,
			selectedTaipId: null,
			showAllTaips: false,
		}),

	setHasTukhum: (hasTukhum) =>
		set({
			hasTukhum,
			selectedTukhumId: hasTukhum ? null : null,
			selectedTaipId: null,
			showAllTaips: !hasTukhum,
		}),

	setSelectedTaipId: (taipId) => set({ selectedTaipId: taipId }),

	setShowAllTaips: (show) => set({ showAllTaips: show }),

	resetForm: () => set(DEFAULT_STATE),
}));
