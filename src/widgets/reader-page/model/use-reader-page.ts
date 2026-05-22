"use client";
import { textApi, textKeys, useTextPage } from "@/entities/text";
import { useWordLookupStore } from "@/features/word-lookup";
import { useReaderFocusMode } from "@/features/reader-focus-mode";
import { useReaderSettingsSync } from "@/features/reader-settings-sync";
import { useI18n } from "@/shared/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RailPanel = "word" | "settings" | "notes" | "toc" | "bookmarks" | "aiHistory" | null;

export const useReaderPage = (textId: string, pageNumber: number) => {
	useReaderSettingsSync();
	const { t, lang } = useI18n();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useTextPage(textId, pageNumber);

	const totalPages = data?.totalPages ?? 0;

	useEffect(() => {
		if (!totalPages) return;
		const prefetchPage = (page: number) => {
			if (page < 1 || page > totalPages) return;
			queryClient.prefetchQuery({
				queryKey: textKeys.page(textId, page),
				queryFn: () => textApi.getPage(textId, page),
				staleTime: 60_000,
			});
			router.prefetch(`/${lang}/reader/${textId}/p/${page}`);
		};
		prefetchPage(pageNumber - 1);
		prefetchPage(pageNumber + 1);
	}, [textId, pageNumber, totalPages, lang, queryClient, router]);
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

	const handleNavigate = (page: number) => {
		router.push(`/${lang}/reader/${textId}/p/${page}`);
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

	const settingsOpen = railPanel === "settings";
	const notesOpen = railPanel === "notes";
	const tocOpen = railPanel === "toc";
	const bookmarksOpen = railPanel === "bookmarks";
	const aiHistoryOpen = railPanel === "aiHistory";
	const desktopRailExpanded = panelOpen || settingsOpen || notesOpen || tocOpen || bookmarksOpen || aiHistoryOpen;

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
