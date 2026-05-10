"use client";

import { Button } from "@/shared/ui/button";
import type { ReactNode } from "react";

interface AdminTextMobileActionBarProps {
	isSaving: boolean;
	secondaryLabel: string;
	primaryLabel: string;
	secondaryIcon: ReactNode;
	primaryIcon: ReactNode;
	onSecondaryClick: () => void;
	onPrimaryClick: () => void;
}

export const AdminTextMobileActionBar = ({
	isSaving,
	secondaryLabel,
	primaryLabel,
	secondaryIcon,
	primaryIcon,
	onSecondaryClick,
	onPrimaryClick,
}: AdminTextMobileActionBarProps) => {
	return (
		<div className="sticky bottom-0 z-20 hidden border-t border-bd-1 bg-bg px-4 py-3 max-[767px]:flex max-[767px]:items-center max-[767px]:gap-2">
			<Button
				onClick={onSecondaryClick}
				disabled={isSaving}
				className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-sm text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{secondaryIcon}
				{secondaryLabel}
			</Button>

			<Button
				onClick={onPrimaryClick}
				disabled={isSaving}
				className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-acc text-sm font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{primaryIcon}
				{primaryLabel}
			</Button>
		</div>
	);
};
