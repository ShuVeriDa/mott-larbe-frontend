"use client";

import type { LibrarySortOption } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { LIBRARY_FILTER_SORT_OPTIONS } from "../lib/library-filter-sort-options";
import { FilterSelect } from "@/shared/ui/filter-select";

export interface LibraryFilterBarSortSelectProps {
	sort: LibrarySortOption;
	onSortChange: (value: LibrarySortOption) => void;
}

export const LibraryFilterBarSortSelect = ({ sort, onSortChange }: LibraryFilterBarSortSelectProps) => {
	const { t } = useI18n();
	const options = LIBRARY_FILTER_SORT_OPTIONS.map(({ value, labelKey }) => ({
		value,
		label: t(labelKey),
	}));
	const handleChange = (v: string) => onSortChange(v as LibrarySortOption);
	return (
		<FilterSelect
			value={sort}
			options={options}
			onChange={handleChange}
			aria-label={t("library.sort.label")}
		/>
	);
};
