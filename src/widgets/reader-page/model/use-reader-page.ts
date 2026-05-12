"use client";
import { useTextPage } from "@/entities/text";
import { useWordLookupStore } from "@/features/word-lookup";
import { useReaderFocusMode } from "@/features/reader-focus-mode";
import { useReaderSettingsSync } from "@/features/reader-settings-sync";
import { useI18n } from "@/shared/lib/i18n";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type RailPanel = "word" | "settings" | "notes" | "toc" | "bookmarks" | null;

export const useReaderPage = (textId: string, pageNumber: number) => {
	useReaderSettingsSync();
	const { t, lang } = useI18n();
	const router = useRouter();
	const { data, isLoading, isError } = useTextPage(textId, pageNumber);
	const clear = useWordLookupStore(s => s.clear);
	const closePanel = useWordLookupStore(s => s.closePanel);
	const closeSheet = useWordLookupStore(s => s.closeSheet);
	const panelOpen = useWordLookupStore(s => s.panelOpen);

	const [railPanel, setRailPanel] = useState<RailPanel>(null);
	const focusMode = useReaderFocusMode();

	useEffect(() => {
		clear();
	}, [textId, pageNumber, clear]);

	useEffect(() => {
		let prevPanelOpen = useWordLookupStore.getState().panelOpen;
		let prevSurface = useWordLookupStore.getState().surface;
		return useWordLookupStore.subscribe(state => {
			const nowPanelOpen = state.panelOpen;
			const nowSurface = state.surface;
			const panelJustOpened = nowPanelOpen && !prevPanelOpen;
			const sheetJustOpened = nowSurface === "sheet" && prevSurface !== "sheet";
			if (panelJustOpened || sheetJustOpened) {
				setRailPanel(null);
			}
			prevPanelOpen = nowPanelOpen;
			prevSurface = nowSurface;
		});
	}, []);

	const handleNavigate = useCallback(
		(page: number) => {
			router.push(`/${lang}/reader/${textId}/p/${page}`);
		},
		[router, lang, textId],
	);

	const handleTogglePanel = useCallback(
		(panel: "settings" | "notes" | "toc" | "bookmarks") => {
			setRailPanel(prev => {
				if (prev === panel) return null;
				closePanel();
				closeSheet();
				return panel;
			});
		},
		[closePanel, closeSheet],
	);

	const handleToggleSettings = useCallback(() => handleTogglePanel("settings"), [handleTogglePanel]);
	const handleToggleNotes = useCallback(() => handleTogglePanel("notes"), [handleTogglePanel]);
	const handleToggleToc = useCallback(() => handleTogglePanel("toc"), [handleTogglePanel]);
	const handleToggleBookmarks = useCallback(() => handleTogglePanel("bookmarks"), [handleTogglePanel]);
	const handleCloseRail = useCallback(() => setRailPanel(null), []);

	const settingsOpen = railPanel === "settings";
	const notesOpen = railPanel === "notes";
	const tocOpen = railPanel === "toc";
	const bookmarksOpen = railPanel === "bookmarks";
	const desktopRailExpanded = panelOpen || settingsOpen || notesOpen || tocOpen || bookmarksOpen;

	return {
		t,
		lang,
		data,
		isLoading,
		isError,
		focusMode,
		settingsOpen,
		notesOpen,
		tocOpen,
		bookmarksOpen,
		desktopRailExpanded,
		handleNavigate,
		handleToggleSettings,
		handleToggleNotes,
		handleToggleToc,
		handleToggleBookmarks,
		handleCloseRail,
	};
};
