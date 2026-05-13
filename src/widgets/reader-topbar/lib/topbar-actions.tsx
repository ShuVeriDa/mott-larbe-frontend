import {
	Bookmark,
	BookMarked,
	List,
	Maximize2,
	Minimize2,
	NotebookPen,
	PanelRightOpen,
	Settings,
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
