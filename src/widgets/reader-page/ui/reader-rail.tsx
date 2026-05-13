import { cn } from "@/shared/lib/cn";
import { ReaderBookmarksAside } from "@/widgets/reader-bookmarks-panel";
import { ReaderNotesAside } from "@/widgets/reader-notes-panel";
import { ReaderSettingsAside } from "@/widgets/reader-settings-sheet";
import { ReaderTocAside } from "@/widgets/reader-toc-panel";
import { WordPanel } from "@/widgets/word-panel";

interface ReaderRailProps {
	textId: string;
	pageNumber: number;
	desktopRailExpanded: boolean;
	settingsOpen: boolean;
	notesOpen: boolean;
	tocOpen: boolean;
	bookmarksOpen: boolean;
	onClose: () => void;
	onNavigate: (page: number) => void;
}

export const ReaderRail = ({
	textId,
	pageNumber,
	desktopRailExpanded,
	settingsOpen,
	notesOpen,
	tocOpen,
	bookmarksOpen,
	onClose,
	onNavigate,
}: ReaderRailProps) => (
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
		<ReaderSettingsAside open={settingsOpen} onClose={onClose} textId={textId} pageNumber={pageNumber} />
		<ReaderNotesAside
			textId={textId}
			pageNumber={pageNumber}
			open={notesOpen}
			onClose={onClose}
		/>
		<ReaderTocAside
			textId={textId}
			currentPage={pageNumber}
			onNavigate={onNavigate}
			open={tocOpen}
			onClose={onClose}
		/>
		<ReaderBookmarksAside
			textId={textId}
			onNavigate={onNavigate}
			open={bookmarksOpen}
			onClose={onClose}
		/>
	</div>
);
