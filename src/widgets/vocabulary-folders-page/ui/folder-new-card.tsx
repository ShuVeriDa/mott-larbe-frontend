"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

export interface FolderNewCardProps {
	onClick: () => void;
	disabled?: boolean;
}

export const FolderNewCard = ({ onClick, disabled }: FolderNewCardProps) => {
	const { t } = useI18n();

	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"group flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-card",
				"border-hairline border-dashed border-bd-2 bg-transparent px-4 py-7 text-center",
				"transition-[border-color,background-color] duration-150",
				"hover:border-acc hover:bg-acc-bg",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"max-md:min-h-[80px] max-md:flex-row max-md:justify-start max-md:gap-2.5 max-md:p-4",
			)}
		>
			<Typography tag="span" className="text-t-4 transition-colors group-hover:text-acc max-md:flex max-md:items-center max-md:justify-center">
				<Plus className="size-6" strokeWidth={1.6} />
			</Typography>
			<div className="flex flex-col gap-1 max-md:items-start">
				<Typography tag="span" className="text-[13px] font-semibold text-t-3 transition-colors group-hover:text-acc-t">
					{t("vocabulary.foldersPage.newCard.title")}
				</Typography>
				<Typography tag="span" className="text-[11.5px] text-t-3 max-md:hidden">
					{t("vocabulary.foldersPage.newCard.description")}
				</Typography>
			</div>
		</Button>
	);
};
