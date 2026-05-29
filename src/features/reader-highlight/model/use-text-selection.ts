"use client";

import { useEffect, useState } from "react";

export interface SelectionState {
	text: string;
	x: number;
	y: number;
}

const readSelection = (containerRef: React.RefObject<HTMLElement | null>): SelectionState | null => {
	const sel = window.getSelection();
	if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
	const text = sel.toString().trim();
	if (!text) return null;
	const range = sel.getRangeAt(0);
	if (!containerRef.current?.contains(range.commonAncestorContainer)) return null;
	const rect = range.getBoundingClientRect();
	return { text, x: rect.left + rect.width / 2, y: rect.top };
};

export const useTextSelection = (containerRef: React.RefObject<HTMLElement | null>) => {
	const [selection, setSelection] = useState<SelectionState | null>(null);

	const clearSelection = () => {
		setSelection(null);
		window.getSelection()?.removeAllRanges();
	};

	useEffect(() => {
		const handlePointerUp = () => {
			const result = readSelection(containerRef);
			if (result) setSelection(result);
		};

		// Small delay on touchend so the browser has time to commit the selection
		const handleTouchEnd = () => {
			setTimeout(() => {
				const result = readSelection(containerRef);
				if (result) setSelection(result);
			}, 50);
		};

		document.addEventListener("mouseup", handlePointerUp);
		document.addEventListener("touchend", handleTouchEnd);
		return () => {
			document.removeEventListener("mouseup", handlePointerUp);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [containerRef]);

	return { selection, clearSelection };
};
