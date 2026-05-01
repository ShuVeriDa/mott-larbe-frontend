"use client";

import { useToastStore, type ToastVariant } from "./toast-store";

export const useToast = () => {
	const push = useToastStore((s) => s.push);
	return {
		toast: (message: string, variant: ToastVariant = "default") =>
			push(message, variant),
		success: (message: string) => push(message, "success"),
		error: (message: string) => push(message, "error"),
	};
};
