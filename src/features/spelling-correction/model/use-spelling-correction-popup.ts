"use client";

import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { SPELLING_CORRECTION_CLASS } from "@/shared/ui/notion-editor";

interface UseSpellingCorrectionPopupOptions {
	onOpen: (wrongForm: string, correctForm: string) => void;
}

export const useSpellingCorrectionPopup = (
	editor: Editor | null,
	{ onOpen }: UseSpellingCorrectionPopupOptions,
) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !editor) return;

		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const span = target.closest(`.${SPELLING_CORRECTION_CLASS}`) as HTMLElement | null;
			if (!span) return;

			const wrongForm = span.dataset.wrongForm ?? "";
			const correctForm = span.dataset.correctForm ?? "";

			if (wrongForm && correctForm) {
				onOpen(wrongForm, correctForm);
			}
		};

		container.addEventListener("click", handleClick);
		return () => container.removeEventListener("click", handleClick);
	}, [editor, onOpen]);

	return { containerRef };
};
