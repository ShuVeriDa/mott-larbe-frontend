"use client";

import { SearchInput } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";

export const PhrasebookMobileTopbar = () => {
	const { t } = useI18n();

	return (
		<header className="flex justify-between items-center gap-2.5 px-3.5 py-2.5 bg-surf border-b border-bd-1 shrink-0">
			<h1 className="text-[13.5px] font-semibold text-t-1 whitespace-nowrap">
				{t("phrasebook.title")}
			</h1>
			<SearchInput className="w-full h-[30px]" />
		</header>
	);
};
