"use client";

import type { TextPageResponse } from "@/entities/text";
import { useAiBatchTranslate } from "@/features/ai-batch-translate";
import { cn } from "@/shared/lib/cn";
import { MotionButton } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { getTopbarActions } from "../lib/topbar-actions";
import { useReaderTopbar } from "../model/use-reader-topbar";
import { ReaderPager } from "./reader-pager";

const iconBtnClass = cn(
	"inline-flex p-[7px] items-center justify-center rounded-base",
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
	aiHistoryOpen?: boolean;
	onToggleAiHistory?: () => void;
	/** Override back link href. Default: /{lang}/texts */
	backHref?: string;
	/** Override back link label. Default: reader.topbar.back */
	backLabel?: string;
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
	aiHistoryOpen,
	onToggleAiHistory,
	backHref,
	backLabel,
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
		submittedByName,
		isCompleted,
		completing,
		handleMarkComplete,
	} = useReaderTopbar(textId, currentPage, data);

	const { state: batchTranslateState, translate: onBatchTranslate } = useAiBatchTranslate(data.tokens);

	const actions = getTopbarActions({
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
		aiHistoryOpen,
		onToggleAiHistory,
		batchTranslateState,
		onBatchTranslate,
		isCompleted,
		completing,
		handleMarkComplete,
	});

	const primaryActions = actions.filter(a => a.priority === "primary");
	const secondaryActions = actions.filter(a => a.priority === "secondary");

	return (
		<header className="flex h-[46px] shrink-0 items-center gap-2 border-b-[0.5px] border-bd-1 bg-surf px-4 max-md:sticky max-md:top-0 max-md:z-80">
			<Link
				href={backHref ?? `/${lang}/texts`}
				className="inline-flex shrink-0 items-center gap-1.5 rounded-base px-2 py-1 max-md:p-3 max-md:min-h-[44px] text-[12.5px] text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1"
			>
				<ChevronLeft className="size-3.5" strokeWidth={1.6} />
				<Typography tag="span" className="max-md:hidden">
					{backLabel ?? t("reader.topbar.back")}
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
					{[
						...metaParts,
						...(submittedByName ? [t("reader.topbar.submittedBy", { name: submittedByName })] : []),
					].join(" · ")}
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
				{actions.map(action => (
					<MotionButton
						key={action.key}
						onClick={action.onClick}
						size="bare"
						aria-pressed={action.ariaPressed}
						aria-label={action.ariaLabel}
						title={action.ariaLabel}
						disabled={action.disabled}
						whileTap={action.disabled ? {} : { scale: 0.92 }}
						className={cn(iconBtnClass, "hidden md:flex")}
					>
						{action.renderIcon()}
					</MotionButton>
				))}

				{primaryActions.map(action => (
					<MotionButton
						key={action.key}
						onClick={action.onClick}
						size="bare"
						aria-pressed={action.ariaPressed}
						aria-label={action.ariaLabel}
						title={action.ariaLabel}
						disabled={action.disabled}
						whileTap={action.disabled ? {} : { scale: 0.92 }}
						className={cn(iconBtnClass, "md:hidden")}
					>
						{action.renderIcon()}
					</MotionButton>
				))}

				{secondaryActions.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<MotionButton
								size="bare"
								aria-label={t("reader.topbar.more")}
								title={t("reader.topbar.more")}
								whileTap={{ scale: 0.92 }}
								className={cn(iconBtnClass, "md:hidden")}
							>
								<MoreHorizontal className="size-[15px]" strokeWidth={1.4} />
							</MotionButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[180px]">
							{secondaryActions.map(action => (
								<DropdownMenuItem
									key={action.key}
									onSelect={action.onClick}
									disabled={action.disabled}
									aria-pressed={action.ariaPressed}
									data-active={action.ariaPressed === true}
									className="data-[active=true]:text-acc-t"
								>
									{action.renderIcon()}
									{action.ariaLabel}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
};
