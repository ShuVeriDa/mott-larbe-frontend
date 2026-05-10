"use client";

import { Button } from "@/shared/ui/button";
import type { ReactNode } from "react";

interface AdminTextMetaPrimaryActionsSectionProps {
	isSaving: boolean;
	primaryLabel: string;
	secondaryLabel: string;
	primaryIcon: ReactNode;
	secondaryIcon: ReactNode;
	onPrimaryAction: () => void;
	onSecondaryAction: () => void;
}

export const AdminTextMetaPrimaryActionsSection = ({
	isSaving,
	primaryLabel,
	secondaryLabel,
	primaryIcon,
	secondaryIcon,
	onPrimaryAction,
	onSecondaryAction,
}: AdminTextMetaPrimaryActionsSectionProps) => {
	return (
		<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[767px]:bg-surf">
			<Button
				onClick={onPrimaryAction}
				disabled={isSaving}
				className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{primaryIcon}
				{primaryLabel}
			</Button>
			<Button
				onClick={onSecondaryAction}
				disabled={isSaving}
				className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{secondaryIcon}
				{secondaryLabel}
			</Button>
		</div>
	);
};
