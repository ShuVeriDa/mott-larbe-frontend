"use client";

import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";
import { SearchBox } from "@/shared/ui/search-box";
import { ComponentProps } from "react";

export interface SearchInputProps {
	className?: string;
}

export const SearchInput = ({ className }: SearchInputProps) => {
	const { t } = useI18n();
	const search = usePhrasebookFilters(s => s.search);
	const setSearch = usePhrasebookFilters(s => s.setSearch);

	const handleChange: NonNullable<
		ComponentProps<typeof SearchBox>["onChange"]
	> = e => setSearch(e.currentTarget.value);

	return (
		<SearchBox
			value={search}
			onChange={handleChange}
			placeholder={t("vocabulary.searchPlaceholder")}
			wrapperClassName={className}
			aria-label={t("vocabulary.searchPlaceholder")}
			className="text-xs"
		/>
	);
};
