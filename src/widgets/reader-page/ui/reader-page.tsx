"use client";
import { useTextPage } from "@/entities/text";
import { useWordLookupStore } from "@/features/word-lookup";
import { useReaderFocusMode } from "@/features/reader-focus-mode";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { ReaderBody } from "@/widgets/reader-body";
import { ReaderFooter } from "@/widgets/reader-footer";
import { ReaderNotesAside, ReaderNotesSheet } from "@/widgets/reader-notes-panel";
import { ReaderSettingsAside, ReaderSettingsSheet } from "@/widgets/reader-settings-sheet";
import { ReaderTocAside, ReaderTocSheet } from "@/widgets/reader-toc-panel";
import { ReaderBookmarksAside, ReaderBookmarksSheet } from "@/widgets/reader-bookmarks-panel";
import { ReaderTopbar } from "@/widgets/reader-topbar";
import { WordBottomSheet } from "@/widgets/word-bottom-sheet";
import { WordPanel } from "@/widgets/word-panel";
import { WordPopup } from "@/widgets/word-popup";
import { useReaderSettingsSync } from "@/features/reader-settings-sync";
import { useRouter } from "next/navigation";
import { ComponentProps, useCallback, useEffect, useState } from "react";

export interface ReaderPageProps {
	textId: string;
	pageNumber: number;
}

type RailPanel = "word" | "settings" | "notes" | "toc" | "bookmarks" | null;

export const ReaderPage = ({ textId, pageNumber }: ReaderPageProps) => {
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

	// Close settings/notes/toc/bookmarks when word panel/sheet opens
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

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-t-3">
				{t("reader.states.loading")}
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-red">
				{t("reader.states.error")}
			</div>
		);
	}

	const settingsOpen = railPanel === "settings";
	const notesOpen = railPanel === "notes";
	const tocOpen = railPanel === "toc";
	const bookmarksOpen = railPanel === "bookmarks";
	const desktopRailExpanded = panelOpen || settingsOpen || notesOpen || tocOpen || bookmarksOpen;

	const handleTogglePanel = (panel: "settings" | "notes" | "toc" | "bookmarks") => {
		setRailPanel(prev => {
			if (prev === panel) return null;
			closePanel();
			closeSheet();
			return panel;
		});
	};

	const handleToggleSettings: NonNullable<ComponentProps<typeof ReaderTopbar>["onToggleSettings"]> =
		() => handleTogglePanel("settings");

	const handleToggleNotes: NonNullable<ComponentProps<typeof ReaderTopbar>["onToggleNotes"]> =
		() => handleTogglePanel("notes");

	const handleToggleToc = () => handleTogglePanel("toc");
	const handleToggleBookmarks = () => handleTogglePanel("bookmarks");

	const handleCloseRail = () => setRailPanel(null);

	return (
		<>
			{!focusMode.active && (
				<ReaderTopbar
					textId={textId}
					lang={lang}
					currentPage={pageNumber}
					data={data}
					settingsOpen={settingsOpen}
					onToggleSettings={handleToggleSettings}
					notesOpen={notesOpen}
					onToggleNotes={handleToggleNotes}
					tocOpen={tocOpen}
					onToggleToc={handleToggleToc}
					bookmarksOpen={bookmarksOpen}
					onToggleBookmarks={handleToggleBookmarks}
					focusModeActive={focusMode.active}
					onToggleFocusMode={focusMode.toggle}
				/>
			)}
			<div
				className={cn(
					"grid min-h-0 flex-1 overflow-hidden bg-surf transition-[grid-template-columns] duration-300 ease-out",
					"max-[767px]:grid-cols-1 max-[767px]:overflow-visible",
					desktopRailExpanded
						? "min-[768px]:grid-cols-[1fr_296px]"
						: "min-[768px]:grid-cols-[1fr_0px]",
				)}
			>
				<div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
					<ReaderBody data={data} currentPage={pageNumber} />
				</div>
				<div
					className={cn(
						"flex min-h-0 min-w-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out",
						"max-[767px]:contents",
						desktopRailExpanded
							? "min-[768px]:translate-x-0 min-[768px]:opacity-100"
							: "min-[768px]:pointer-events-none min-[768px]:translate-x-3 min-[768px]:opacity-0",
					)}
				>
					<WordPanel textId={textId} />
					<ReaderSettingsAside open={settingsOpen} onClose={handleCloseRail} />
					<ReaderNotesAside
						textId={textId}
						pageNumber={pageNumber}
						open={notesOpen}
						onClose={handleCloseRail}
					/>
					<ReaderTocAside
						textId={textId}
						currentPage={pageNumber}
						onNavigate={handleNavigate}
						open={tocOpen}
						onClose={handleCloseRail}
					/>
					<ReaderBookmarksAside
						textId={textId}
						onNavigate={handleNavigate}
						open={bookmarksOpen}
						onClose={handleCloseRail}
					/>
				</div>
			</div>
			{!focusMode.active && <ReaderFooter />}
			<WordPopup />
			<WordBottomSheet textId={textId} />
			<ReaderSettingsSheet open={settingsOpen} onClose={handleCloseRail} />
			<ReaderNotesSheet
				textId={textId}
				pageNumber={pageNumber}
				open={notesOpen}
				onClose={handleCloseRail}
			/>
			<ReaderTocSheet
				textId={textId}
				currentPage={pageNumber}
				onNavigate={handleNavigate}
				open={tocOpen}
				onClose={handleCloseRail}
			/>
			<ReaderBookmarksSheet
				textId={textId}
				onNavigate={handleNavigate}
				open={bookmarksOpen}
				onClose={handleCloseRail}
			/>
			{focusMode.active && (
				<button
					onClick={focusMode.toggle}
					aria-label={t("reader.topbar.focusMode")}
					className="fixed bottom-4 right-4 z-50 inline-flex size-9 items-center justify-center rounded-full bg-surf shadow-md text-t-3 hover:text-t-1 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
						<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
					</svg>
				</button>
			)}
		</>
	);
};
