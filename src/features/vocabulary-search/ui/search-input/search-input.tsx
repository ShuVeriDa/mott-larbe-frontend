"use client";

import { useVocabularyFilters } from "@/features/vocabulary-filters";
import { useI18n } from "@/shared/lib/i18n";
import { SearchBox } from "@/shared/ui/search-box";
import { ComponentProps } from "react";

export interface SearchInputProps {
	className?: string;
}

export const SearchInput = ({ className }: SearchInputProps) => {
	const { t } = useI18n();
	const search = useVocabularyFilters(s => s.search);
	const setSearch = useVocabularyFilters(s => s.setSearch);

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
