import { cn } from "@/shared/lib/cn";
import { WordPanel } from "@/widgets/word-panel";
import dynamic from "next/dynamic";

const ReaderSettingsAside = dynamic(() =>
	import("@/widgets/reader-settings-sheet").then(m => ({
		default: m.ReaderSettingsAside,
	})),
);
const ReaderNotesAside = dynamic(() =>
	import("@/widgets/reader-notes-panel").then(m => ({
		default: m.ReaderNotesAside,
	})),
);
const ReaderTocAside = dynamic(() =>
	import("@/widgets/reader-toc-panel").then(m => ({
		default: m.ReaderTocAside,
	})),
);
const ReaderBookmarksAside = dynamic(() =>
	import("@/widgets/reader-bookmarks-panel").then(m => ({
		default: m.ReaderBookmarksAside,
	})),
);
const ReaderAiHistoryAside = dynamic(() =>
	import("@/widgets/reader-ai-history-panel").then(m => ({
		default: m.ReaderAiHistoryAside,
	})),
);

interface ReaderRailProps {
	textId: string;
	pageNumber: number;
	desktopRailExpanded: boolean;
	settingsOpen: boolean;
	notesOpen: boolean;
	tocOpen: boolean;
	bookmarksOpen: boolean;
	aiHistoryOpen: boolean;
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
	aiHistoryOpen,
	onClose,
	onNavigate,
}: ReaderRailProps) => (
	<div
		className={cn(
			"flex min-h-0 min-w-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
			"max-[767px]:contents",
			desktopRailExpanded
				? "min-[768px]:translate-x-0 min-[768px]:opacity-100"
				: "min-[768px]:pointer-events-none min-[768px]:translate-x-3 min-[768px]:opacity-0",
		)}
	>
		<WordPanel textId={textId} />
		<ReaderSettingsAside
			open={settingsOpen}
			onClose={onClose}
			textId={textId}
			pageNumber={pageNumber}
		/>
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
		<ReaderAiHistoryAside open={aiHistoryOpen} onClose={onClose} />
	</div>
);
