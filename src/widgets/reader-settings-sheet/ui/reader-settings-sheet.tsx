"use client";

import { useI18n } from "@/shared/lib/i18n";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { cn } from "@/shared/lib/cn";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useReaderSettingsEscape } from "../model/use-reader-settings-escape";
import { ReaderSettingsBody } from "./reader-settings-body";
import { ReaderSettingsChromeHeader } from "./reader-settings-chrome-header";

export interface ReaderSettingsSheetProps {
	open: boolean;
	onClose: () => void;
	textId?: string;
	pageNumber?: number;
}

/** Desktop / tablet — same sliding rail styling as `WordPanel`. */
export const ReaderSettingsAside = ({
	open,
	onClose,
	textId,
	pageNumber,
}: ReaderSettingsSheetProps) => {
	useReaderSettingsEscape(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-hairline transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<ReaderSettingsChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
				<ReaderSettingsBody compact textId={textId} pageNumber={pageNumber} />
			</div>
		</aside>
	);
};

/** Small screens — bottom sheet (+ backdrop); hidden from `md` up via CSS where aside is shown. */
export const ReaderSettingsSheet = ({
	open,
	onClose,
	textId,
	pageNumber,
}: ReaderSettingsSheetProps) => {
	const { t } = useI18n();
	useReaderSettingsEscape(open, onClose);

	const handleBackdropClick = () => onClose();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

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
				aria-label={t("reader.settings.title")}
				className="flex max-h-[82vh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<ReaderMobileSheetHeader
					title={t("reader.settings.title")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={onClose}
				/>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<ReaderSettingsBody textId={textId} pageNumber={pageNumber} />
				</div>
			</div>
		</div>,
		document.body,
	);
};
