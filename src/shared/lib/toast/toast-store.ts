"use client";

import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
	id: number;
	message: string;
	variant: ToastVariant;
}

interface ToastStore {
	items: ToastItem[];
	push: (message: string, variant?: ToastVariant) => void;
	dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastStore>((set) => ({
	items: [],
	push: (message, variant = "default") => {
		counter += 1;
		const id = counter;
		set((s) => ({ items: [...s.items, { id, message, variant }] }));
		setTimeout(() => {
			set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
		}, 2400);
	},
	dismiss: (id) =>
		set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
