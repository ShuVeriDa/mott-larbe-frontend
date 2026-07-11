"use client";

import { create } from "zustand";

export interface TokenRangeSelectionState {
	isActive: boolean;
	anchorPosition: number | null;
	focusPosition: number | null;
	startSelection: (position: number) => void;
	extendSelection: (position: number) => void;
	endSelection: () => void;
}

export const useTokenRangeSelectionStore = create<TokenRangeSelectionState>((set) => ({
	isActive: false,
	anchorPosition: null,
	focusPosition: null,
	startSelection: (position) =>
		set({ isActive: true, anchorPosition: position, focusPosition: position }),
	extendSelection: (position) =>
		set((state) => (state.isActive ? { focusPosition: position } : state)),
	endSelection: () =>
		set({ isActive: false, anchorPosition: null, focusPosition: null }),
}));

export const getTokenRangeBounds = (
	anchorPosition: number | null,
	focusPosition: number | null,
): [number, number] | null => {
	if (anchorPosition === null || focusPosition === null) return null;
	return anchorPosition <= focusPosition
		? [anchorPosition, focusPosition]
		: [focusPosition, anchorPosition];
};
