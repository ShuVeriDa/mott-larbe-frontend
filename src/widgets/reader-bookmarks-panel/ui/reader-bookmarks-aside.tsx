"use client";

import { cn } from "@/shared/lib/cn";
import { useEscapeToClose } from "@/shared/lib/escape-to-close";
import type { ReaderBookmarksPanelProps } from "../model/types";
import { BookmarksChromeHeader } from "./bookmarks-chrome-header";
import { BookmarksPanelBody } from "./bookmarks-panel-body";

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
				"border-l border-[0.5px] transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<BookmarksChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<BookmarksPanelBody
					textId={textId}
					onNavigate={onNavigate}
					onClose={onClose}
				/>
			</div>
		</aside>
	);
};
