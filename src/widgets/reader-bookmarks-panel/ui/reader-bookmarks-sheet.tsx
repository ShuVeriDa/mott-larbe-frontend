"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useMediaQuery } from "@/shared/lib/media-query";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import type { ReaderBookmarksPanelProps } from "../model/types";
import { BookmarksPanelBody } from "./bookmarks-panel-body";

export const ReaderBookmarksSheet = ({
	textId,
	onNavigate,
	open,
	onClose,
}: ReaderBookmarksPanelProps) => {
	const { t } = useI18n();
	const isMobile = !useMediaQuery("(min-width: 768px)");
	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) onClose();
	};

	return (
		<Drawer open={open && isMobile} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">{t("reader.bookmarks.title")}</DrawerTitle>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<BookmarksPanelBody
						textId={textId}
						onNavigate={onNavigate}
						onClose={onClose}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
