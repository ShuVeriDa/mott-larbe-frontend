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
		},
		onToggleToc
			? {
					key: "toc",
					renderIcon: () => <List className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.toc"),
					ariaPressed: tocOpen,
					onClick: onToggleToc,
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
		},
		onToggleBookmarks
			? {
					key: "bookmarks-list",
					renderIcon: () => <List className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.bookmarksList"),
					ariaPressed: bookmarksOpen,
					onClick: onToggleBookmarks,
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
		},
		{
			key: "settings",
			renderIcon: () => <Settings className="size-[15px]" strokeWidth={1.4} />,
			ariaLabel: t("reader.topbar.settings"),
			ariaPressed: settingsOpen,
			onClick: onToggleSettings,
		},
		onToggleAiHistory
			? {
					key: "ai-history",
					renderIcon: () => <Sparkles className="size-[15px]" strokeWidth={1.4} />,
					ariaLabel: t("reader.topbar.aiHistory"),
					ariaPressed: aiHistoryOpen,
					onClick: onToggleAiHistory,
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
			ariaPressed: isCompleted,
			disabled: completing || isCompleted,
			onClick: handleMarkComplete,
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
		},
	];

	return actions.filter((a): a is TopbarAction => a !== null);
};
