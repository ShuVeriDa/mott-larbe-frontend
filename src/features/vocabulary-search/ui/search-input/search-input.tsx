"use client";

import { SearchBox } from "@/shared/ui/search-box";
import { useI18n } from "@/shared/lib/i18n";
import { useVocabularyFilters } from "@/features/vocabulary-filters";

export interface SearchInputProps {
	className?: string;
}

export const SearchInput = ({ className }: SearchInputProps) => {
	const { t } = useI18n();
	const search = useVocabularyFilters((s) => s.search);
	const setSearch = useVocabularyFilters((s) => s.setSearch);

	return (
		<SearchBox
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			placeholder={t("vocabulary.searchPlaceholder")}
			wrapperClassName={className}
			aria-label={t("vocabulary.searchPlaceholder")}
		/>
	);
};
