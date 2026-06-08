"use client";
import { readerContextQueryOptions, readerContextKeys, useReaderContext, type ReaderContextResponse } from "@/entities/reader-context";
import { useWordLookupStore } from "@/features/word-lookup";
import { useReaderFocusMode } from "@/features/reader-focus-mode";
import { useReaderSessionTracker } from "@/features/reader-session-tracker";
import { useReaderSettingsInit, useReaderSettingsSync } from "@/features/reader-settings-sync";
import { useI18n } from "@/shared/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReaderKeyboard } from "./use-reader-keyboard";
import { useShallow } from "zustand/react/shallow";

type RailPanel = "word" | "settings" | "notes" | "toc" | "bookmarks" | "aiHistory" | null;

export const useReaderPage = (
	textId: string,
	pageNumber: number,
	// Optional: override navigation route base (default "reader", pass "my-texts" for UserText)
	routeBase = "reader",
	// Optional: override API function — used by UserTextReaderPage to hit /user-text-reader-context
	apiFn?: (id: string, page: number) => Promise<ReaderContextResponse>,
) => {
	useReaderSettingsInit();
	useReaderSettingsSync();
	const { lang } = useI18n();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: ctx, isPending: isLoading, isError } = useReaderContext(textId, pageNumber, apiFn);
	const data = ctx?.page;

	useReaderSessionTracker(textId, pageNumber, data?.wordCount ?? 0);

	const totalPages = data?.totalPages ?? 0;

	useEffect(() => {
		if (!totalPages) return;
		const prefetchPage = (page: number) => {
			if (page < 1 || page > totalPages) return;
			// Use the same apiFn as the current page so UserText stays on /user-text-reader-context
			if (apiFn) {
				queryClient.prefetchQuery({
					queryKey: readerContextKeys.context(textId, page),
					queryFn: () => apiFn(textId, page),
					staleTime: 60_000,
				});
			} else {
				queryClient.prefetchQuery(readerContextQueryOptions(textId, page));
			}
			router.prefetch(`/${lang}/${routeBase}/${textId}/p/${page}`);
		};
		prefetchPage(pageNumber - 1);
		prefetchPage(pageNumber + 1);
	}, [textId, pageNumber, totalPages, lang, queryClient, router]);
	const { clear, closePanel, closeSheet, panelOpen } = useWordLookupStore(
		useShallow(s => ({
			clear: s.clear,
			closePanel: s.closePanel,
			closeSheet: s.closeSheet,
			panelOpen: s.panelOpen,
		})),
	);

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

	const handleNavigate = (page: number) => {
		router.push(`/${lang}/${routeBase}/${textId}/p/${page}`);
	};

	const handleTogglePanel = (panel: "settings" | "notes" | "toc" | "bookmarks" | "aiHistory") => {
		setRailPanel(prev => {
			if (prev === panel) return null;
			closePanel();
			closeSheet();
			return panel;
		});
	};

	const handleToggleSettings = () => handleTogglePanel("settings");
	const handleToggleNotes = () => handleTogglePanel("notes");
	const handleToggleToc = () => handleTogglePanel("toc");
	const handleToggleBookmarks = () => handleTogglePanel("bookmarks");
	const handleToggleAiHistory = () => handleTogglePanel("aiHistory");
	const handleCloseRail = () => setRailPanel(null);

	useReaderKeyboard(pageNumber, totalPages, {
		onNavigate: handleNavigate,
		onToggleNotes: handleToggleNotes,
		onToggleToc: handleToggleToc,
		onToggleBookmarks: handleToggleBookmarks,
		onToggleFocusMode: focusMode.toggle,
		onToggleAiHistory: handleToggleAiHistory,
	});

	const settingsOpen = railPanel === "settings";
	const notesOpen = railPanel === "notes";
	const tocOpen = railPanel === "toc";
	const bookmarksOpen = railPanel === "bookmarks";
	const aiHistoryOpen = railPanel === "aiHistory";
	const desktopRailExpanded = panelOpen || settingsOpen || notesOpen || tocOpen || bookmarksOpen || aiHistoryOpen;

	return {
		lang,
		data,
		isLoading,
		isError,
		focusMode,
		settingsOpen,
		notesOpen,
		tocOpen,
		bookmarksOpen,
		aiHistoryOpen,
		desktopRailExpanded,
		handleNavigate,
		handleToggleSettings,
		handleToggleNotes,
		handleToggleToc,
		handleToggleBookmarks,
		handleToggleAiHistory,
		handleCloseRail,
	};
};
