"use client";

import {
	usePageBookmarks,
	useRemovePageBookmark,
	type PageBookmark,
} from "@/entities/page-bookmark";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Bookmark, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

export const BookmarksPanelBody = ({
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

	const makeHandleDelete =
		(bookmark: PageBookmark) => (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			removeBookmark(bookmark.id);
		};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{isLoading && (
				<Typography className="text-[12px] text-t-4">
					{t("reader.bookmarks.loading")}
				</Typography>
			)}
			{!isLoading && bookmarks.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<Bookmark className="size-8 text-t-4" strokeWidth={1.2} />
					<Typography className="text-[13px] text-t-3">
						{t("reader.bookmarks.empty")}
					</Typography>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
				{bookmarks.map(bookmark => (
					<div
						key={bookmark.id}
						className="group flex cursor-pointer items-start gap-2 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2.5 transition-colors hover:bg-surf-3"
						onClick={makeHandleCardClick(bookmark)}
					>
						<div className="min-w-0 flex-1">
							<Typography className="mb-0.5 text-[11px] font-semibold tabular-nums text-t-3">
								{t("reader.toc.page")} {bookmark.pageNumber}
							</Typography>
							{bookmark.snippet && (
								<Typography className="line-clamp-2 text-[12px] text-t-2">
									{bookmark.snippet}
								</Typography>
							)}
						</div>
						<Button
							onClick={makeHandleDelete(bookmark)}
							title={t("reader.bookmarks.removeSuccess")}
							aria-label={t("reader.bookmarks.removeSuccess")}
							className="mt-0.5 shrink-0 rounded-[4px] p-1 text-t-4 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surf hover:text-red"
						>
							<Trash2 className="size-3.5" strokeWidth={1.4} />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
