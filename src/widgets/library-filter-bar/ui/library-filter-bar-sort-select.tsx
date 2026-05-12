"use client";

import type { LibrarySortOption } from "@/entities/library-text";
import type { ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { useI18n } from "@/shared/lib/i18n";
import { LIBRARY_FILTER_SORT_OPTIONS } from "../lib/library-filter-sort-options";

export interface LibraryFilterBarSortSelectProps {
	sort: LibrarySortOption;
	onSortChange: (value: LibrarySortOption) => void;
}

export const LibraryFilterBarSortSelect = ({
	sort,
	onSortChange,
}: LibraryFilterBarSortSelectProps) => {
	const { t } = useI18n();

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onSortChange(e.currentTarget.value as LibrarySortOption);
	};

	return (
		<Select
			value={sort}
			onChange={handleChange}
			aria-label={t("library.sort.label")}
			wrapperClassName="w-auto shrink-0"
			className="h-[26px] bg-surf text-t-2 text-[11px]"
		>
			{LIBRARY_FILTER_SORT_OPTIONS.map(({ value, labelKey }) => (
				<option key={value} value={value}>
					{t(labelKey)}
				</option>
			))}
		</Select>
	);
};
