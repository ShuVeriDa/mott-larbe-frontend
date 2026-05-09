"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { useI18n } from "@/shared/lib/i18n";

interface UseFolderPickerPopoverParams {
	open: boolean;
	onClose: () => void;
	onPick: (folderId: string) => void;
}

export const useFolderPickerPopover = ({
	open,
	onClose,
	onPick,
}: UseFolderPickerPopoverParams) => {
	const { t } = useI18n();
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!open) return;
		const handleDocumentClick = (event: globalThis.MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClose();
			}
		};
		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleDocumentClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, onClose]);

	const handleFolderPickClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = (event) => {
		const folderId = event.currentTarget.dataset.folderId;
		if (!folderId) return;
		onPick(folderId);
	};

	return {
		t,
		ref,
		handleFolderPickClick,
	};
};
