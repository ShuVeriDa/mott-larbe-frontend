"use client";

import { SearchInput } from "@/features/vocabulary-search";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Plus, SlidersHorizontal } from "lucide-react";

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
		<header>
			<div className="flex justify-between shrink-0 items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
				<Typography
					tag="h1"
					className="text-[13.5px] font-semibold text-t-1 max-md:text-[15px]"
				>
					{t("vocabulary.title")}
				</Typography>

				<div className="flex items-center gap-2">
					<SearchInput className=" hidden sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150" />

					<Button
						size={"bare"}
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
				</div>
			</div>
			<div className="flex shrink-0 border-b border-bd-1 bg-surf px-3 py-2 sm:hidden">
				<SearchInput className=" w-full h-9" />
			</div>
		</header>
	);
};
