"use client";
import { ReaderFooter } from "@/widgets/reader-footer";
import { ReaderNotesSheet } from "@/widgets/reader-notes-panel";
import { ReaderSettingsSheet } from "@/widgets/reader-settings-sheet";
import { ReaderTocSheet } from "@/widgets/reader-toc-panel";
import { ReaderBookmarksSheet } from "@/widgets/reader-bookmarks-panel";
import { ReaderTopbar } from "@/widgets/reader-topbar";
import { WordBottomSheet } from "@/widgets/word-bottom-sheet";
import { WordPopup } from "@/widgets/word-popup";
import { useReaderPage } from "../model/use-reader-page";
import { ReaderLoading } from "./reader-loading";
import { ReaderError } from "./reader-error";
import { ReaderLayout } from "./reader-layout";
import { ReaderFocusExitButton } from "./reader-focus-exit-button";

export interface ReaderPageProps {
	textId: string;
	pageNumber: number;
}

export const ReaderPage = ({ textId, pageNumber }: ReaderPageProps) => {
	const {
		data,
		isLoading,
		isError,
		lang,
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
	} = useReaderPage(textId, pageNumber);

	if (isLoading) return <ReaderLoading />;
	if (isError || !data) return <ReaderError />;

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
			<ReaderLayout
				textId={textId}
				pageNumber={pageNumber}
				data={data}
				desktopRailExpanded={desktopRailExpanded}
				settingsOpen={settingsOpen}
				notesOpen={notesOpen}
				tocOpen={tocOpen}
				bookmarksOpen={bookmarksOpen}
				onCloseRail={handleCloseRail}
				onNavigate={handleNavigate}
			/>
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
			{focusMode.active && <ReaderFocusExitButton onExit={focusMode.toggle} />}
		</>
	);
};
