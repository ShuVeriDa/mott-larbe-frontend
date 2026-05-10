"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { TextPageResponse } from "@/entities/text";
import { useToggleBookmark } from "@/features/bookmark-text";
import { usePageBookmarkToggle } from "@/features/page-bookmark-toggle";
import {
	SHEET_LAYOUT_MAX_WIDTH_PX,
	useWordLookupStore,
} from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import {
	Bookmark,
	BookMarked,
	ChevronLeft,
	List,
	Maximize2,
	Minimize2,
	NotebookPen,
	PanelRightOpen,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { ReaderPager } from "./reader-pager";

const iconBtnClass = cn(
	"inline-flex h-[30px] w-[30px] items-center justify-center rounded-base",
	"text-t-3 transition-colors duration-100",
	"hover:bg-surf-2 hover:text-t-2",
	"aria-pressed:bg-acc-bg aria-pressed:text-acc-t",
);

export interface ReaderTopbarProps {
	textId: string;
	lang: string;
	currentPage: number;
	data: TextPageResponse;
	settingsOpen: boolean;
	onToggleSettings: () => void;
	notesOpen: boolean;
	onToggleNotes: () => void;
	tocOpen?: boolean;
	onToggleToc?: () => void;
	bookmarksOpen?: boolean;
	onToggleBookmarks?: () => void;
	focusModeActive?: boolean;
	onToggleFocusMode?: () => void;
}

export const ReaderTopbar = ({
	textId,
	lang,
	currentPage,
	data,
	settingsOpen,
	onToggleSettings,
	notesOpen,
	onToggleNotes,
	tocOpen,
	onToggleToc,
	bookmarksOpen,
	onToggleBookmarks,
	focusModeActive,
	onToggleFocusMode,
}: ReaderTopbarProps) => {
	const { t } = useI18n();
	const { mutate: toggleBookmark, isPending: bookmarking } = useToggleBookmark();
	const { success, error } = useToast();

	const snippet = data.page.contentRaw.slice(0, 100);
	const { isBookmarked: isPageBookmarked, handleToggle: togglePageBookmark } =
		usePageBookmarkToggle(textId, currentPage, snippet);

	const panelOpen = useWordLookupStore(s => s.panelOpen);
	const surface = useWordLookupStore(s => s.surface);
	const activeToken = useWordLookupStore(s => s.activeToken);
	const togglePanel = useWordLookupStore(s => s.togglePanel);
	const openInSheet = useWordLookupStore(s => s.openInSheet);
	const openEmptyWordSheet = useWordLookupStore(s => s.openEmptyWordSheet);
	const closeSheet = useWordLookupStore(s => s.closeSheet);

	const handleToggleWordPanel = () => {
		if (
			typeof window !== "undefined" &&
			window.innerWidth <= SHEET_LAYOUT_MAX_WIDTH_PX
		) {
			if (surface === "sheet") {
				closeSheet();
				return;
			}
			if (activeToken) {
				openInSheet(activeToken);
				return;
			}
			openEmptyWordSheet();
			return;
		}
		togglePanel();
	};

	const wordPanelTogglePressed = panelOpen || surface === "sheet";

	const onBookmark = () => {
		toggleBookmark(textId, {
			onSuccess: ({ bookmarked }) =>
				success(
					bookmarked
						? t("reader.toasts.bookmarkAdded")
						: t("reader.toasts.bookmarkRemoved"),
				),
			onError: () => error(t("reader.toasts.bookmarkFailed")),
		});
	};

	const metaParts = [data.author, data.level, data.language].filter(Boolean);

	return (
		<header className="flex h-[46px] shrink-0 items-center gap-2 border-b border-hairline border-bd-1 bg-surf px-4">
			<Link
				href={`/${lang}/texts`}
				className="inline-flex shrink-0 items-center gap-1.5 rounded-base px-2 py-1 text-[12.5px] text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1"
			>
				<ChevronLeft className="size-3.5" strokeWidth={1.6} />
				<Typography tag="span" className="max-md:hidden">
					{t("reader.topbar.back")}
				</Typography>
			</Link>

			<Typography
				tag="span"
				aria-hidden="true"
				className="h-4 w-px shrink-0 bg-bd-2 max-md:hidden"
			/>

			<div className="min-w-0 flex-1">
				<div className="truncate text-[13px] font-semibold text-t-1">
					{data.title}
				</div>
				<div className="truncate text-[11px] text-t-3 max-md:hidden">
					{metaParts.join(" · ")}
				</div>
			</div>

			<ReaderPager
				textId={textId}
				lang={lang}
				currentPage={currentPage}
				totalPages={data.totalPages}
			/>

			<Typography
				tag="span"
				aria-hidden="true"
				className="h-4 w-px shrink-0 bg-bd-2"
			/>

			<div className="flex shrink-0 items-center gap-1">
				<Button
					onClick={handleToggleWordPanel}
					size="bare"
					aria-pressed={wordPanelTogglePressed}
					aria-label={t("reader.topbar.togglePanel")}
					className={iconBtnClass}
				>
					<PanelRightOpen className="size-[15px]" strokeWidth={1.4} />
				</Button>

				{onToggleToc && (
					<Button
						onClick={onToggleToc}
						size="bare"
						aria-pressed={tocOpen}
						aria-label={t("reader.topbar.toc")}
						className={iconBtnClass}
					>
						<List className="size-[15px]" strokeWidth={1.4} />
					</Button>
				)}

					<Button
					onClick={togglePageBookmark}
					size="bare"
					aria-pressed={isPageBookmarked}
					aria-label={t("reader.topbar.bookmarks")}
					className={iconBtnClass}
				>
					<BookMarked
						className="size-[15px]"
						strokeWidth={1.4}
						fill={isPageBookmarked ? "currentColor" : "none"}
					/>
				</Button>

				{onToggleBookmarks && (
					<Button
						onClick={onToggleBookmarks}
						size="bare"
						aria-pressed={bookmarksOpen}
						aria-label={t("reader.topbar.bookmarksList")}
						className={iconBtnClass}
					>
						<List className="size-[15px]" strokeWidth={1.4} />
					</Button>
				)}

				<Button
					onClick={onToggleNotes}
					size="bare"
					aria-pressed={notesOpen}
					aria-label={t("reader.topbar.notes")}
					className={iconBtnClass}
				>
					<NotebookPen className="size-[15px]" strokeWidth={1.4} />
				</Button>

				<Button
					onClick={onToggleSettings}
					size="bare"
					aria-pressed={settingsOpen}
					aria-label={t("reader.topbar.settings")}
					className={iconBtnClass}
				>
					<Settings className="size-[15px]" strokeWidth={1.4} />
				</Button>

				{onToggleFocusMode && (
					<Button
						onClick={onToggleFocusMode}
						size="bare"
						aria-pressed={focusModeActive}
						aria-label={t("reader.topbar.focusMode")}
						className={iconBtnClass}
					>
						{focusModeActive
							? <Minimize2 className="size-[15px]" strokeWidth={1.4} />
							: <Maximize2 className="size-[15px]" strokeWidth={1.4} />
						}
					</Button>
				)}

				<Button
					onClick={onBookmark}
					size="bare"
					disabled={bookmarking}
					aria-pressed={Boolean(data.bookmarked)}
					aria-label={t("reader.topbar.bookmark")}
					className={iconBtnClass}
				>
					<Bookmark
						className="size-[15px]"
						strokeWidth={1.4}
						fill={data.bookmarked ? "currentColor" : "none"}
					/>
				</Button>
			</div>
		</header>
	);
};
