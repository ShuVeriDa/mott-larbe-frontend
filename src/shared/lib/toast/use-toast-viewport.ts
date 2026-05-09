"use client";

import { useMounted } from "@/shared/lib/mounted";
import { useToastStore } from "./toast-store";

export const useToastViewport = () => {
	const items = useToastStore((state) => state.items);
	const dismiss = useToastStore((state) => state.dismiss);
	const mounted = useMounted();

	const handleDismiss = (id: number) => {
		dismiss(id);
	};

	return {
		items,
		mounted,
		handleDismiss,
	};
};
