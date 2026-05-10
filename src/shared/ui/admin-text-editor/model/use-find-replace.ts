"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { Editor } from "@/shared/ui/notion-editor";
import { searchPluginKey } from "@/shared/ui/notion-editor/search-extension";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface FindReplaceState {
	isOpen: boolean;
	query: string;
	replacement: string;
	matchCount: number;
	activeIndex: number;
	hasMatches: boolean;
	hasQuery: boolean;
	matchLabel: string | null;
	open: () => void;
	close: () => void;
	handleQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleReplacementChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleFindNext: () => void;
	handleFindPrev: () => void;
	handleReplaceActive: () => void;
	handleReplaceAll: () => void;
	handleKeyDown: (e: KeyboardEvent) => void;
	searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const useFindReplace = (editor: Editor | null): FindReplaceState => {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQueryState] = useState("");
	const [replacement, setReplacement] = useState("");
	const [matchCount, setMatchCount] = useState(0);
	const [activeIndex, setActiveIndex] = useState(-1);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const hasMatches = matchCount > 0;
	const hasQuery = query.length > 0;
	const matchLabel = hasMatches
		? t("admin.texts.createPage.findReplace.matchCount", {
				current: String(activeIndex + 1),
				total: String(matchCount),
			})
		: hasQuery
			? t("admin.texts.createPage.findReplace.noMatches")
			: null;

	// Sync match state from plugin
	useEffect(() => {
		if (!editor) return;

		const syncMatches = () => {
			const pluginState = searchPluginKey.getState(editor.state);
			if (pluginState) {
				setMatchCount(pluginState.matches.length);
				setActiveIndex(pluginState.activeIndex);
			}
		};

		editor.on("transaction", syncMatches);
		return () => {
			editor.off("transaction", syncMatches);
		};
	}, [editor]);

	// Clear search decorations when closed
	useEffect(() => {
		if (!isOpen && editor) {
			editor.commands.clearSearch();
			setQueryState("");
			setReplacement("");
		}
	}, [isOpen, editor]);

	// Focus search input when opened
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => searchInputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const setQuery = useCallback(
		(q: string) => {
			setQueryState(q);
			if (editor) editor.commands.setSearchQuery(q);
		},
		[editor],
	);

	const handleQueryChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value),
		[setQuery],
	);

	const handleReplacementChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setReplacement(e.currentTarget.value),
		[setReplacement],
	);

	const handleFindNext = useCallback(() => {
		editor?.commands.findNext();
	}, [editor]);

	const handleFindPrev = useCallback(() => {
		editor?.commands.findPrev();
	}, [editor]);

	const handleReplaceActive = useCallback(() => {
		editor?.commands.replaceActive(replacement);
	}, [editor, replacement]);

	const handleReplaceAll = useCallback(() => {
		editor?.commands.replaceAll(replacement);
	}, [editor, replacement]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
				return;
			}
			if (e.key === "Enter") {
				if (e.shiftKey) {
					handleFindPrev();
				} else {
					handleFindNext();
				}
			}
		},
		[close, handleFindNext, handleFindPrev],
	);

	return {
		isOpen,
		query,
		replacement,
		matchCount,
		activeIndex,
		hasMatches,
		hasQuery,
		matchLabel,
		open,
		close,
		handleQueryChange,
		handleReplacementChange,
		handleFindNext,
		handleFindPrev,
		handleReplaceActive,
		handleReplaceAll,
		handleKeyDown,
		searchInputRef,
	};
};
