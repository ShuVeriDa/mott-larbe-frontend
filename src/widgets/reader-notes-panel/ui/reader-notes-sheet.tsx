"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useMediaQuery } from "@/shared/lib/media-query";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import type { ReaderNotesPanelProps } from "../model/types";
import { NotesPanelBody } from "./notes-panel-body";

export const ReaderNotesSheet = ({
	textId,
	pageNumber,
	open,
	onClose,
}: ReaderNotesPanelProps) => {
	const { t } = useI18n();
	const isMobile = !useMediaQuery("(min-width: 768px)");
	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) onClose();
	};

	return (
		<Drawer open={open && isMobile} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">{t("reader.notes.title")}</DrawerTitle>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<NotesPanelBody textId={textId} pageNumber={pageNumber} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};
