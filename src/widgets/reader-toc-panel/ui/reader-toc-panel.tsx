"use client";

import { useTextToc, type TocEntry } from "@/entities/text-toc";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { Typography } from "@/shared/ui/typography";
import { List, X } from "lucide-react";
import { type MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ReaderTocPanelProps {
	textId: string;
	currentPage: number;
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

const TocPanelBody = ({
	textId,
	currentPage,
	onNavigate,
	onClose,
}: {
	textId: string;
	currentPage: number;
	onNavigate: (page: number) => void;
	onClose: () => void;
}) => {
	const { t } = useI18n();
	const { data: entries = [], isLoading } = useTextToc(textId);

	const hasContent = entries.length > 0 && entries.some((e) => e.title !== null || true);
	const isEmpty = !isLoading && entries.length === 0;

	const handleEntryClick = (entry: TocEntry) => {
		onNavigate(entry.pageNumber);
		onClose();
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{isLoading && (
				<p className="text-[12px] text-t-4">{t("reader.toc.loading")}</p>
			)}
			{isEmpty && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<List className="size-8 text-t-4" strokeWidth={1.2} />
					<p className="text-[13px] text-t-3">{t("reader.toc.empty")}</p>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
				{entries.map((entry) => {
					const isActive = entry.pageNumber === currentPage;
					const label = entry.title ?? `${t("reader.toc.page")} ${entry.pageNumber}`;

					const handleClick = () => handleEntryClick(entry);

					return (
						<button
							key={entry.pageNumber}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex w-full items-baseline gap-2 rounded-[6px] px-2.5 py-2 text-left text-[13px] transition-colors",
								isActive
									? "bg-acc-bg text-acc-t"
									: "text-t-2 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							<span className="shrink-0 text-[11px] tabular-nums text-t-4">
								{entry.pageNumber}
							</span>
							<span className="min-w-0 truncate">{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

const TocChromeHeader = ({ onClose }: { onClose: () => void }) => {
	const { t } = useI18n();
	const handleClose = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("reader.toc.title")}
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

export const ReaderTocAside = ({
	textId,
	currentPage,
	onNavigate,
	open,
	onClose,
}: ReaderTocPanelProps) => {
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
			<TocChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<TocPanelBody
					textId={textId}
					currentPage={currentPage}
					onNavigate={onNavigate}
					onClose={onClose}
				/>
			</div>
		</aside>
	);
};

export const ReaderTocSheet = ({
	textId,
	currentPage,
	onNavigate,
	open,
	onClose,
}: ReaderTocPanelProps) => {
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
				aria-label={t("reader.toc.title")}
				className="flex max-h-[82vh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<ReaderMobileSheetHeader
					title={t("reader.toc.title")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={onClose}
				/>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<TocPanelBody
						textId={textId}
						currentPage={currentPage}
						onNavigate={onNavigate}
						onClose={onClose}
					/>
				</div>
			</div>
		</div>,
		document.body,
	);
};
