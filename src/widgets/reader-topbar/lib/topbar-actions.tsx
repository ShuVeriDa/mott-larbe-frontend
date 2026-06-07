import {
	Bookmark,
	BookMarked,
	CheckCircle,
	Circle,
	List,
	Loader2,
	Maximize2,
	Minimize2,
	NotebookPen,
	PanelRightOpen,
	Settings,
	Sparkles,
	Zap,
} from "lucide-react";
import { type ReactNode } from "react";

export type TopbarAction = {
	key: string;
	renderIcon: () => ReactNode;
	ariaLabel: string;
	ariaPressed: boolean | undefined;
	disabled?: boolean;
	onClick: () => void;
	priority?: "primary" | "secondary";
	/** Keyboard shortcut hint shown in tooltip, e.g. ["N"] or ["⌘", "K"] */
	shortcut?: string[];
};

export interface GetTopbarActionsParams {
	t: (key: string) => string;
	wordPanelTogglePressed: boolean;
	handleToggleWordPanel: () => void;
	tocOpen?: boolean;
	onToggleToc?: () => void;
	isPageBookmarked: boolean;
	togglePageBookmark: () => void;
	bookmarksOpen?: boolean;
	onToggleBookmarks?: () => void;
	notesOpen: boolean;
	onToggleNotes: () => void;
	settingsOpen: boolean;
	onToggleSettings: () => void;
	focusModeActive?: boolean;
	onToggleFocusMode?: () => void;
	bookmarked?: boolean | null;
	bookmarking: boolean;
	handleBookmark: () => void;
	aiHistoryOpen?: boolean;
	onToggleAiHistory?: () => void;
	batchTranslateState?: "idle" | "loading" | "done" | "error";
	onBatchTranslate?: () => void;
	isCompleted: boolean;
	completing: boolean;
	handleMarkComplete: () => void;
}

export const getTopbarActions = ({
	t,
	wordPanelTogglePressed,
	handleToggleWordPanel,
	tocOpen,
	onToggleToc,
	isPageBookmarked,
	togglePageBookmark,
	bookmarksOpen,
	onToggleBookmarks,
	notesOpen,
	onToggleNotes,
	settingsOpen,
	onToggleSettings,
	focusModeActive,
	onToggleFocusMode,
	bookmarked,
	bookmarking,
	handleBookmark,
	aiHistoryOpen,
	onToggleAiHistory,
	batchTranslateState,
	onBatchTranslate,
	isCompleted,
	completing,
	handleMarkComplete,
}: GetTopbarActionsParams): TopbarAction[] => {
	const actions: (TopbarAction | null)[] = [
		{
			key: "word-panel",
			renderIcon: () => (
				<PanelRightOpen className="size-[15px]" strokeWidth={1.4} />
			),
			ariaLabel: t("reader.topbar.togglePanel"),
			ariaPressed: wordPanelTogglePressed,
			onClick: handleToggleWordPanel,
			priority: "primary",
			shortcut: ["Space"],
		},
		onToggleToc
			? {
					key: "toc",
					renderIcon: () => <List className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.toc"),
					ariaPressed: tocOpen,
					onClick: onToggleToc,
					priority: "primary",
					shortcut: ["T"],
				}
			: null,
		{
			key: "page-bookmark",
			renderIcon: () => (
				<BookMarked
					className="size-[15px]"
					strokeWidth={1.4}
					// fill={isPageBookmarked ? "currentColor" : "none"}
				/>
			),
			ariaLabel: t("reader.topbar.bookmarks"),
			ariaPressed: isPageBookmarked,
			onClick: togglePageBookmark,
			priority: "secondary",
		},
		onToggleBookmarks
			? {
					key: "bookmarks-list",
					renderIcon: () => <List className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.bookmarksList"),
					ariaPressed: bookmarksOpen,
					onClick: onToggleBookmarks,
					priority: "secondary",
					shortcut: ["B"],
				}
			: null,
		{
			key: "notes",
			renderIcon: () => (
				<NotebookPen className="size-[15px]" strokeWidth={1.4} />
			),
			ariaLabel: t("reader.topbar.notes"),
			ariaPressed: notesOpen,
			onClick: onToggleNotes,
			priority: "secondary",
			shortcut: ["N"],
		},
		{
			key: "settings",
			renderIcon: () => <Settings className="size-[15px]" strokeWidth={1.4} />,
			ariaLabel: t("reader.topbar.settings"),
			ariaPressed: settingsOpen,
			onClick: onToggleSettings,
			priority: "primary",
		},
		onToggleAiHistory
			? {
					key: "ai-history",
					renderIcon: () => <Sparkles className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.aiHistory"),
					ariaPressed: aiHistoryOpen,
					onClick: onToggleAiHistory,
					priority: "secondary",
					shortcut: ["H"],
				}
			: null,
		onBatchTranslate
			? {
					key: "batch-translate",
					renderIcon: () =>
						batchTranslateState === "loading"
							? <Loader2 className="size-[15px] animate-spin" strokeWidth={1.4} />
							: <Zap className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.batchTranslate"),
					ariaPressed: undefined,
					disabled: batchTranslateState === "loading",
					onClick: onBatchTranslate,
					priority: "secondary",
				}
			: null,
		onToggleFocusMode
			? {
					key: "focus-mode",
					renderIcon: () =>
						focusModeActive ? (
							<Minimize2 className="size-[15px]" strokeWidth={1.4} />
						) : (
							<Maximize2 className="size-[15px]" strokeWidth={1.4} />
						),
					ariaLabel: t("reader.topbar.focusMode"),
					ariaPressed: focusModeActive,
					onClick: onToggleFocusMode,
					priority: "primary",
					shortcut: ["F"],
				}
			: null,
		{
			key: "mark-complete",
			renderIcon: () =>
				completing ? (
					<Loader2 className="size-[15px] animate-spin" strokeWidth={1.4} />
				) : isCompleted ? (
					<CheckCircle className="size-[15px]" strokeWidth={1.4} />
				) : (
					<Circle className="size-[15px]" strokeWidth={1.4} />
				),
			ariaLabel: isCompleted
				? t("reader.topbar.completed")
				: t("reader.topbar.markComplete"),
			ariaPressed: undefined,
			disabled: completing || isCompleted,
			onClick: handleMarkComplete,
			priority: "secondary",
		},
		{
			key: "bookmark",
			renderIcon: () => (
				<Bookmark
					className="size-[15px]"
					strokeWidth={1.4}
					fill={bookmarked ? "currentColor" : "none"}
				/>
			),
			ariaLabel: t("reader.topbar.bookmark"),
			ariaPressed: Boolean(bookmarked),
			disabled: bookmarking,
			onClick: handleBookmark,
			priority: "secondary",
		},
	];

	return actions.filter((a): a is TopbarAction => a !== null);
};
