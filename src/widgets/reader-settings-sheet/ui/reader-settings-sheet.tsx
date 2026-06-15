"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useMediaQuery } from "@/shared/lib/media-query";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import type { ReaderSettingsSheetProps } from "../model/types";
import { ReaderSettingsBody } from "./reader-settings-body";

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
