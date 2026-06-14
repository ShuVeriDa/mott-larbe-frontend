"use client";
import type { TextPageResponse } from "@/entities/text";
import { ReaderFooter } from "@/widgets/reader-footer";
import { ReaderTopbar } from "@/widgets/reader-topbar";
import { WordPopup } from "@/widgets/word-popup";
import dynamic from "next/dynamic";
import { useReaderPage } from "../model/use-reader-page";
import { ReaderLoading } from "./reader-loading";
import { ReaderError } from "./reader-error";
import { ReaderLayout } from "./reader-layout";
import { ReaderFocusExitButton } from "./reader-focus-exit-button";
import { ContentDisclaimerBanner } from "./content-disclaimer-banner";

const WordBottomSheet = dynamic(() =>
	import("@/widgets/word-bottom-sheet").then(m => ({ default: m.WordBottomSheet })),
);
const ReaderSettingsSheet = dynamic(() =>
	import("@/widgets/reader-settings-sheet").then(m => ({ default: m.ReaderSettingsSheet })),
);
const ReaderNotesSheet = dynamic(() =>
	import("@/widgets/reader-notes-panel").then(m => ({ default: m.ReaderNotesSheet })),
);
const ReaderTocSheet = dynamic(() =>
	import("@/widgets/reader-toc-panel").then(m => ({ default: m.ReaderTocSheet })),
);
const ReaderBookmarksSheet = dynamic(() =>
	import("@/widgets/reader-bookmarks-panel").then(m => ({ default: m.ReaderBookmarksSheet })),
);
const ReaderAiHistorySheet = dynamic(() =>
	import("@/widgets/reader-ai-history-panel").then(m => ({ default: m.ReaderAiHistorySheet })),
);

export interface ReaderPageProps {
	textId: string;
	pageNumber: number;
	/** Route base for navigation. Default "reader". Pass "my-texts" for UserText. */
	routeBase?: string;
	/** Override API function for fetching reader context. Default: /reader-context. */
	apiFn?: (textId: string, pageNumber: number) => Promise<import("@/entities/reader-context").ReaderContextResponse>;
	/** Override back button href. Default: /{lang}/texts */
	backHref?: string;
	/** Override back button label. */
	backLabel?: string;
}

interface ReaderPageInnerProps {
	textId: string;
	pageNumber: number;
	data: TextPageResponse;
	lang: string;
	focusMode: { active: boolean; toggle: () => void };
	settingsOpen: boolean;
	notesOpen: boolean;
	tocOpen: boolean;
	bookmarksOpen: boolean;
	aiHistoryOpen: boolean;
	desktopRailExpanded: boolean;
	handleNavigate: (page: number) => void;
	handleToggleSettings: () => void;
	handleToggleNotes: () => void;
	handleToggleToc: () => void;
	handleToggleBookmarks: () => void;
	handleToggleAiHistory: () => void;
	handleCloseRail: () => void;
	backHref?: string;
	backLabel?: string;
}

const ReaderPageInner = ({
	textId,
	pageNumber,
	data,
	lang,
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
	backHref,
	backLabel,
}: ReaderPageInnerProps) => (
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
				aiHistoryOpen={aiHistoryOpen}
				onToggleAiHistory={handleToggleAiHistory}
				backHref={backHref}
				backLabel={backLabel}
			/>
		)}
		{!focusMode.active && <ContentDisclaimerBanner />}
			<ReaderLayout
				textId={textId}
				pageNumber={pageNumber}
				data={data}
				desktopRailExpanded={desktopRailExpanded}
				settingsOpen={settingsOpen}
				notesOpen={notesOpen}
				tocOpen={tocOpen}
				bookmarksOpen={bookmarksOpen}
				aiHistoryOpen={aiHistoryOpen}
				onCloseRail={handleCloseRail}
				onNavigate={handleNavigate}
			/>
			{!focusMode.active && <ReaderFooter textId={textId} />}
			<WordPopup />
			<WordBottomSheet textId={textId} />
			<ReaderSettingsSheet open={settingsOpen} onClose={handleCloseRail} textId={textId} pageNumber={pageNumber} />
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
			<ReaderAiHistorySheet open={aiHistoryOpen} onClose={handleCloseRail} />
			{focusMode.active && (
				<ReaderFocusExitButton
					onExit={focusMode.toggle}
					textId={textId}
					lang={lang}
					currentPage={pageNumber}
					totalPages={data.totalPages}
				/>
			)}
		</>
);

export const ReaderPage = ({ textId, pageNumber, routeBase = "reader", apiFn, backHref, backLabel }: ReaderPageProps) => {
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
		aiHistoryOpen,
		desktopRailExpanded,
		handleNavigate,
		handleToggleSettings,
		handleToggleNotes,
		handleToggleToc,
		handleToggleBookmarks,
		handleToggleAiHistory,
		handleCloseRail,
	} = useReaderPage(textId, pageNumber, routeBase, apiFn);

	if (isLoading) return <ReaderLoading />;
	if (isError || !data) return <ReaderError />;

	return (
		<ReaderPageInner
			textId={textId}
			pageNumber={pageNumber}
			data={data}
			lang={lang}
			focusMode={focusMode}
			settingsOpen={settingsOpen}
			notesOpen={notesOpen}
			tocOpen={tocOpen}
			bookmarksOpen={bookmarksOpen}
			aiHistoryOpen={aiHistoryOpen}
			desktopRailExpanded={desktopRailExpanded}
			handleNavigate={handleNavigate}
			handleToggleSettings={handleToggleSettings}
			handleToggleNotes={handleToggleNotes}
			handleToggleToc={handleToggleToc}
			handleToggleBookmarks={handleToggleBookmarks}
			handleToggleAiHistory={handleToggleAiHistory}
			handleCloseRail={handleCloseRail}
			backHref={backHref}
			backLabel={backLabel}
		/>
	);
};
