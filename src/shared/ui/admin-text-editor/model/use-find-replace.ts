"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { Editor } from "@/shared/ui/notion-editor";
import { searchPluginKey } from "@/shared/ui/notion-editor/search-extension";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

export interface FindReplaceState {
	isOpen: boolean;
	query: string;
	replacement: string;
	matchCount: number;
	activeIndex: number;
	hasMatches: boolean;
	hasQuery: boolean;
	matchLabel: string | null;
	replacePanelOpen: boolean;
	matchCase: boolean;
	wholeWord: boolean;
	open: () => void;
	close: () => void;
	handleQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleReplacementChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleFindNext: () => void;
	handleFindPrev: () => void;
	handleReplaceActive: () => void;
	handleReplaceAll: () => void;
	handleKeyDown: (e: KeyboardEvent) => void;
	handleToggleReplacePanel: () => void;
	handleToggleMatchCase: () => void;
	handleToggleWholeWord: () => void;
	handleSearchFocus: () => void;
	handleReplaceFocus: () => void;
	tryInsertChar: (char: string) => boolean;
	searchInputRef: React.RefObject<HTMLInputElement | null>;
	replacementInputRef: React.RefObject<HTMLInputElement | null>;
}

export const useFindReplace = (editor: Editor | null): FindReplaceState => {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQueryState] = useState("");
	const [replacement, setReplacement] = useState("");
	const [matchCount, setMatchCount] = useState(0);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [replacePanelOpen, setReplacePanelOpen] = useState(false);
	const [matchCase, setMatchCase] = useState(false);
	const [wholeWord, setWholeWord] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const replacementInputRef = useRef<HTMLInputElement>(null);
	const lastFocusedFieldRef = useRef<"find" | "replace">("find");

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

	// Focus search input when opened
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => searchInputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const open = () => setIsOpen(true);

	const close = () => {
		setIsOpen(false);
		setQueryState("");
		setReplacement("");
		setReplacePanelOpen(false);
		setMatchCase(false);
		setWholeWord(false);
		lastFocusedFieldRef.current = "find";
		editor?.commands.clearSearch();
	};

	const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
		const q = e.currentTarget.value;
		setQueryState(q);
		if (editor) editor.commands.setSearchQuery(q);
	};

	const handleReplacementChange = (e: ChangeEvent<HTMLInputElement>) => {
		setReplacement(e.currentTarget.value);
	};

	const handleFindNext = () => {
		editor?.commands.findNext();
	};

	const handleFindPrev = () => {
		editor?.commands.findPrev();
	};

	const handleReplaceActive = () => {
		editor?.commands.replaceActive(replacement);
	};

	const handleReplaceAll = () => {
		editor?.commands.replaceAll(replacement);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
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
	};

	const handleToggleReplacePanel = () => {
		setReplacePanelOpen(prev => !prev);
	};

	const handleToggleMatchCase = () => {
		if (!editor) return;
		setMatchCase(prev => {
			const next = !prev;
			editor.commands.setSearchMatchCase(next);
			return next;
		});
	};

	const handleToggleWholeWord = () => {
		if (!editor) return;
		setWholeWord(prev => {
			const next = !prev;
			editor.commands.setSearchWholeWord(next);
			return next;
		});
	};

	const handleSearchFocus = () => {
		lastFocusedFieldRef.current = "find";
	};

	const handleReplaceFocus = () => {
		lastFocusedFieldRef.current = "replace";
	};

	const focusInputCaret = (input: HTMLInputElement, pos: number) => {
		const run = () => {
			input.focus();
			input.setSelectionRange(pos, pos);
		};
		window.setTimeout(run, 0);
	};

	const tryInsertChar = (char: string): boolean => {
		if (!isOpen) return false;

		let targetField = lastFocusedFieldRef.current;
		if (targetField === "replace" && !replacePanelOpen) {
			targetField = "find";
		}

		if (targetField === "replace") {
			const input = replacementInputRef.current;
			if (!input) return false;
			const start =
				input.selectionStart ?? replacement.length;
			const end =
				input.selectionEnd ?? replacement.length;
			const next =
				replacement.slice(0, start) +
				char +
				replacement.slice(end);
			setReplacement(next);
			focusInputCaret(input, start + char.length);
			return true;
		}

		const input = searchInputRef.current;
		if (!input) return false;
		const start =
			input.selectionStart ?? query.length;
		const end = input.selectionEnd ?? query.length;
		const next = query.slice(0, start) + char + query.slice(end);
		setQueryState(next);
		if (editor) editor.commands.setSearchQuery(next);
		focusInputCaret(input, start + char.length);
		return true;
	};

	return {
		isOpen,
		query,
		replacement,
		matchCount,
		activeIndex,
		hasMatches,
		hasQuery,
		matchLabel,
		replacePanelOpen,
		matchCase,
		wholeWord,
		open,
		close,
		handleQueryChange,
		handleReplacementChange,
		handleFindNext,
		handleFindPrev,
		handleReplaceActive,
		handleReplaceAll,
		handleKeyDown,
		handleToggleReplacePanel,
		handleToggleMatchCase,
		handleToggleWholeWord,
		handleSearchFocus,
		handleReplaceFocus,
		tryInsertChar,
		searchInputRef,
		replacementInputRef,
	};
};
