"use client";

import { SearchInput } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";

export const PhrasebookTopbar = () => {
	const { t } = useI18n();

	return (
		<header className="flex justify-between items-center gap-3 px-[22px] py-3 border-b border-bd-1 bg-surf shrink-0">
			<h1 className="text-[13.5px] font-semibold text-t-1">
				{t("phrasebook.title")}
			</h1>
			<SearchInput className="hidden sm:flex w-[240px] max-w-[200px] focus-within:max-w-[240px] transition-[max-width] duration-150 motion-reduce:transition-none" />
		</header>
	);
};
