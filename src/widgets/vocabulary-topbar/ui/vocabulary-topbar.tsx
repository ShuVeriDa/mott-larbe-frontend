"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { SearchInput } from "@/features/vocabulary-search";

export interface VocabularyTopbarProps {
	onAddWord: () => void;
	onOpenDrawer: () => void;
}

export const VocabularyTopbar = ({
	onAddWord,
	onOpenDrawer,
}: VocabularyTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className="flex shrink-0 items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
			<Typography
				tag="h1"
				className="text-[13.5px] font-semibold text-t-1 max-md:text-[15px]"
			>
				{t("vocabulary.title")}
			</Typography>

			<SearchInput className="ml-auto h-[30px] max-w-[240px] flex-1 max-md:max-w-none" />

			<Button
				onClick={onOpenDrawer}
				aria-label={t("vocabulary.openFilters")}
				className="hidden size-[30px] items-center justify-center rounded-base border-hairline border-bd-2 bg-surf-2 text-t-2 transition-colors hover:text-t-1 max-md:flex"
			>
				<SlidersHorizontal className="size-[15px]" strokeWidth={2} />
			</Button>

			<Button
				variant="action"
				size="default"
				onClick={onAddWord}
				className="shadow-[0_1px_4px_rgba(34,84,211,0.3)]"
			>
				<Plus className="size-[11px]" strokeWidth={2.4} />
				<Typography tag="span" className="max-md:hidden">
					{t("vocabulary.addWord")}
				</Typography>
			</Button>
		</header>
	);
};
