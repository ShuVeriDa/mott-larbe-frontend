"use client";

import { BookMarked, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

interface PhrasebookTopbarProps {
	categoriesCount: number;
	phrasesCount: number;
	suggestionsCount: number;
	onAddCategory: () => void;
	onAddPhrase: () => void;
	t: (key: string) => string;
}

export const PhrasebookTopbar = ({
	categoriesCount,
	phrasesCount,
	suggestionsCount,
	onAddCategory,
	onAddPhrase,
	t,
}: PhrasebookTopbarProps) => (
	<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-[14px] transition-colors max-sm:px-3.5 max-sm:py-[11px]">
		<div className="min-w-0">
			<Typography tag="h1" className="font-display text-[16px] text-t-1 max-sm:text-[15px]">
				{t("adminPhrasebook.title")}
			</Typography>
			<Typography tag="p" className="mt-px text-[12px] text-t-3 max-sm:hidden">
				{t("adminPhrasebook.subtitle")
					.replace("{categories}", String(categoriesCount))
					.replace("{phrases}", String(phrasesCount))
					.replace("{suggestions}", String(suggestionsCount))}
			</Typography>
		</div>

		<div className="ml-auto flex items-center gap-2 shrink-0">
			<Button
				onClick={onAddCategory}
				title={t("adminPhrasebook.addCategory")}
				className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-sm:px-2"
			>
				<BookMarked className="size-[13px]" />
				<Typography tag="span" className="max-sm:hidden">
					{t("adminPhrasebook.addCategory")}
				</Typography>
			</Button>
			<Button
				onClick={onAddPhrase}
				title={t("adminPhrasebook.addPhrase")}
				className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 max-sm:px-2"
			>
				<Plus className="size-[13px]" />
				<Typography tag="span" className="max-sm:hidden">
					{t("adminPhrasebook.addPhrase")}
				</Typography>
			</Button>
		</div>
	</header>
);
