"use client";

import { useCallback, useEffect, useState } from "react";

export interface SelectionState {
	text: string;
	x: number;
	y: number;
}

export const useTextSelection = (containerRef: React.RefObject<HTMLElement | null>) => {
	const [selection, setSelection] = useState<SelectionState | null>(null);

	const clearSelection = useCallback(() => {
		setSelection(null);
		window.getSelection()?.removeAllRanges();
	}, []);

	useEffect(() => {
		const handleMouseUp = () => {
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed || !sel.rangeCount) {
				setSelection(null);
				return;
			}
			const text = sel.toString().trim();
			if (!text) {
				setSelection(null);
				return;
			}
			const range = sel.getRangeAt(0);
			if (!containerRef.current?.contains(range.commonAncestorContainer)) {
				setSelection(null);
				return;
			}
			const rect = range.getBoundingClientRect();
			setSelection({ text, x: rect.left + rect.width / 2, y: rect.top });
		};

		document.addEventListener("mouseup", handleMouseUp);
		return () => document.removeEventListener("mouseup", handleMouseUp);
	}, [containerRef]);

	return { selection, clearSelection };
};
