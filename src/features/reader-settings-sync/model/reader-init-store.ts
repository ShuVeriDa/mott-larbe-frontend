"use client";

import { create } from "zustand";

interface ReaderInitState {
	isInitializing: boolean;
	setInitializing: (v: boolean) => void;
}

export const useReaderInitStore = create<ReaderInitState>()((set) => ({
	isInitializing: true,
	setInitializing: (isInitializing) => set({ isInitializing }),
}));
