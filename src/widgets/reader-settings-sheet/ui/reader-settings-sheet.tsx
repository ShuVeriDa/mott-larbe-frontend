"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useMediaQuery } from "@/shared/lib/media-query";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
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
				"border-l border-[0.5px] transition-[border-color] duration-200",
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

/** Small screens — bottom drawer; on `md+` the aside panel in the rail is used instead. */
export const ReaderSettingsSheet = ({
	open,
	onClose,
	textId,
	pageNumber,
}: ReaderSettingsSheetProps) => {
	const { t } = useI18n();
	const isMobile = !useMediaQuery("(min-width: 768px)");
	const handleOpenChange = (isOpen: boolean) => { if (!isOpen) onClose(); };

	return (
		<Drawer open={open && isMobile} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">{t("reader.settings.title")}</DrawerTitle>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<ReaderSettingsBody textId={textId} pageNumber={pageNumber} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};
