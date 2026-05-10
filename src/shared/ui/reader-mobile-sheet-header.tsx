"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react";

/** Same overlay as `AdminTextMetaPanelShell` mobile settings sheet (<768px). */
export const READER_MOBILE_SHEET_OVERLAY_CLASSES =
	"fixed inset-0 z-210 hidden bg-black/35 backdrop-blur-[2px] max-[767px]:flex max-[767px]:items-end";

/** Same chrome as `AdminTextMetaPanelShell` mobile sheet (admin/texts/create). */
export interface ReaderMobileSheetHeaderProps {
	title: string;
	closeAriaLabel: string;
	onClose: () => void;
}

export const ReaderMobileSheetHeader = ({
	title,
	closeAriaLabel,
	onClose,
}: ReaderMobileSheetHeaderProps) => {
	const handleCloseClick = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-4 py-3">
			<Typography tag="span" className="text-[13px] font-semibold text-t-1">
				{title}
			</Typography>
			<Button
				variant="bare"
				size={null}
				onClick={handleCloseClick}
				aria-label={closeAriaLabel}
				className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-4" />
			</Button>
		</div>
	);
};
