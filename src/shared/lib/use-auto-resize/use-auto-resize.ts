import { RefObject } from "react";

export const useAutoResize = (ref: RefObject<HTMLTextAreaElement | null>, maxHeight = 120) => {
	const autoResize = () => {
		const el = ref.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
	};

	const resetHeight = () => {
		const el = ref.current;
		if (el) el.style.height = "auto";
	};

	return { autoResize, resetHeight };
};
