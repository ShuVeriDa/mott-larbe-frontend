"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { TextPageResponse } from "@/entities/text";
import { cn } from "@/shared/lib/cn";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReaderPager } from "./reader-pager";
import { useReaderTopbar } from "../model/use-reader-topbar";
import { getTopbarActions } from "../lib/topbar-actions";

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
	const {
		t,
		bookmarking,
		isPageBookmarked,
		togglePageBookmark,
		wordPanelTogglePressed,
		handleToggleWordPanel,
		handleBookmark,
		metaParts,
	} = useReaderTopbar(textId, currentPage, data);

	return (
		<header className="flex h-[46px] shrink-0 items-center gap-2 border-b border-hairline border-bd-1 bg-surf px-4 max-md:sticky max-md:top-0 max-md:z-80">
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
				{getTopbarActions({
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
					bookmarked: data.bookmarked,
					bookmarking,
					handleBookmark,
				}).map((action) => (
					<Button
						key={action.key}
						onClick={action.onClick}
						size="bare"
						aria-pressed={action.ariaPressed}
						aria-label={action.ariaLabel}
						disabled={action.disabled}
						className={iconBtnClass}
					>
						{action.renderIcon()}
					</Button>
				))}
			</div>
		</header>
	);
};
