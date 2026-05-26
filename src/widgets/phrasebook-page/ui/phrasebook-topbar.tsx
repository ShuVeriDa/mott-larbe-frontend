"use client";

import { SearchInput } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";

export const PhrasebookTopbar = () => {
	const { t } = useI18n();

	return (
		<header className="flex justify-between items-center gap-3 px-[22px] py-3 border-b border-bd-1 bg-surf shrink-0">
			<span className="text-[13.5px] font-semibold text-t-1">
				{t("phrasebook.title")}
			</span>
			<SearchInput className="hidden sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150" />
		</header>
	);
};
