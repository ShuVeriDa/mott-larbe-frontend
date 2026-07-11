"use client";

import { useEffect, useRef, useState } from "react";

export interface SelectionState {
	text: string;
	x: number;
	y: number;
	bottom: number;
}

const HIGHLIGHT_NAME = "reader-text-selection";

// CSS Custom Highlight API support (Chrome/Edge 105+, Safari 17.2+, Android
// Chrome). Falls back to leaving the native browser selection visible when
// unsupported — see registerOwnHighlight below.
const supportsCustomHighlight =
	typeof CSS !== "undefined" && "highlights" in CSS;

const registerOwnHighlight = (range: Range | null) => {
	if (!supportsCustomHighlight) return;
	if (!range) {
		CSS.highlights.delete(HIGHLIGHT_NAME);
		return;
	}
	CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(range));
};

const readSelection = (
	containerRef: React.RefObject<HTMLElement | null>,
): { state: SelectionState; range: Range } | null => {
	const sel = window.getSelection();
	if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
	const text = sel.toString().trim();
	if (!text) return null;
	const range = sel.getRangeAt(0);
	if (!containerRef.current?.contains(range.commonAncestorContainer)) return null;
	const rect = range.getBoundingClientRect();
	return {
		state: { text, x: rect.left + rect.width / 2, y: rect.top, bottom: rect.bottom },
		range: range.cloneRange(),
	};
};

// On touch devices, an active native Selection also triggers the browser's
// own action bar (Select all / Copy / Ask AI / Share), which renders above
// all page content — including our toolbar/popup — and swallows the user's
// first tap. Collapsing the native Selection immediately avoids that bar
// entirely, but the native blue selection highlight disappears with it, so
// we draw our own highlight via the CSS Custom Highlight API to keep the
// visual feedback the user relies on to see what they selected.
export const useTextSelection = (containerRef: React.RefObject<HTMLElement | null>) => {
	const [selection, setSelection] = useState<SelectionState | null>(null);
	const isTouchRef = useRef(false);

	const clearSelection = () => {
		setSelection(null);
		window.getSelection()?.removeAllRanges();
		registerOwnHighlight(null);
	};

	useEffect(() => {
		const commit = (result: { state: SelectionState; range: Range }, isTouch: boolean) => {
			if (isTouch) {
				registerOwnHighlight(result.range);
				window.getSelection()?.removeAllRanges();
			} else {
				registerOwnHighlight(null);
			}
			setSelection(result.state);
		};

		const handlePointerUp = () => {
			const result = readSelection(containerRef);
			if (result) commit(result, isTouchRef.current);
		};

		// selectionchange fires reliably on mobile after the browser commits the selection,
		// unlike touchend which fires before the selection is finalised on iOS/Android.
		let touchActive = false;
		const handleTouchStart = () => {
			touchActive = true;
			isTouchRef.current = true;
		};
		const handleTouchEnd = () => { touchActive = false; };
		const handleSelectionChange = () => {
			if (!touchActive) return;
			const result = readSelection(containerRef);
			if (result) commit(result, true);
		};

		document.addEventListener("mouseup", handlePointerUp);
		document.addEventListener("touchstart", handleTouchStart, { passive: true });
		document.addEventListener("touchend", handleTouchEnd);
		document.addEventListener("selectionchange", handleSelectionChange);
		return () => {
			document.removeEventListener("mouseup", handlePointerUp);
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchend", handleTouchEnd);
			document.removeEventListener("selectionchange", handleSelectionChange);
			registerOwnHighlight(null);
		};
	}, [containerRef]);

	return { selection, clearSelection };
};
