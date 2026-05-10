"use client";

import { usePageBookmarks, useRemovePageBookmark, type PageBookmark } from "@/entities/page-bookmark";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { Typography } from "@/shared/ui/typography";
import { Bookmark, Trash2, X } from "lucide-react";
import { type MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ReaderBookmarksPanelProps {
	textId: string;
	onNavigate: (page: number) => void;
	open: boolean;
	onClose: () => void;
}

const useEscapeToClose = (open: boolean, onClose: () => void) => {
	useEffect(() => {
		if (!open) return;
		const handle = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handle);
		return () => document.removeEventListener("keydown", handle);
	}, [open, onClose]);
};

const BookmarksPanelBody = ({
	textId,
	onNavigate,
	onClose,
}: {
	textId: string;
	onNavigate: (page: number) => void;
	onClose: () => void;
}) => {
	const { t } = useI18n();
	const { data: bookmarks = [], isLoading } = usePageBookmarks(textId);
	const { mutate: removeBookmark } = useRemovePageBookmark(textId);

	const makeHandleCardClick = (bookmark: PageBookmark) => () => {
		onNavigate(bookmark.pageNumber);
		onClose();
	};

	const makeHandleDelete = (bookmark: PageBookmark) => (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		removeBookmark(bookmark.id);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{isLoading && (
				<p className="text-[12px] text-t-4">{t("reader.bookmarks.loading")}</p>
			)}
			{!isLoading && bookmarks.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<Bookmark className="size-8 text-t-4" strokeWidth={1.2} />
					<p className="text-[13px] text-t-3">{t("reader.bookmarks.empty")}</p>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
				{bookmarks.map((bookmark) => (
					<div
						key={bookmark.id}
						className="group flex cursor-pointer items-start gap-2 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2.5 transition-colors hover:bg-surf-3"
						onClick={makeHandleCardClick(bookmark)}
					>
						<div className="min-w-0 flex-1">
							<p className="mb-0.5 text-[11px] font-semibold tabular-nums text-t-3">
								{t("reader.toc.page")} {bookmark.pageNumber}
							</p>
							{bookmark.snippet && (
								<p className="line-clamp-2 text-[12px] text-t-2">{bookmark.snippet}</p>
							)}
						</div>
						<button
							type="button"
							onClick={makeHandleDelete(bookmark)}
							aria-label={t("reader.panel.close")}
							className="mt-0.5 shrink-0 rounded-[4px] p-1 text-t-4 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surf hover:text-red"
						>
							<Trash2 className="size-3.5" strokeWidth={1.4} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

const BookmarksChromeHeader = ({ onClose }: { onClose: () => void }) => {
	const { t } = useI18n();
	const handleClose = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("reader.bookmarks.title")}
			</Typography>
			<Button
				onClick={handleClose}
				aria-label={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};

export const ReaderBookmarksAside = ({
	textId,
	onNavigate,
	open,
	onClose,
}: ReaderBookmarksPanelProps) => {
	useEscapeToClose(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-hairline transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<BookmarksChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<BookmarksPanelBody textId={textId} onNavigate={onNavigate} onClose={onClose} />
			</div>
		</aside>
	);
};

export const ReaderBookmarksSheet = ({
	textId,
	onNavigate,
	open,
	onClose,
}: ReaderBookmarksPanelProps) => {
	const { t } = useI18n();
	useEscapeToClose(open, onClose);

	const handleBackdropClick = () => onClose();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="presentation"
			className={READER_MOBILE_SHEET_OVERLAY_CLASSES}
			onClick={handleBackdropClick}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("reader.bookmarks.title")}
				className="flex max-h-[82vh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<ReaderMobileSheetHeader
					title={t("reader.bookmarks.title")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={onClose}
				/>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<BookmarksPanelBody textId={textId} onNavigate={onNavigate} onClose={onClose} />
				</div>
			</div>
		</div>,
		document.body,
	);
};
