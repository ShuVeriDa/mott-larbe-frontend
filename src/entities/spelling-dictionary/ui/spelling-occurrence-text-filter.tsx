"use client";

import { useI18n } from "@/shared/lib/i18n";
import { MultiSelectCombobox } from "@/shared/ui/multi-select-combobox";
import type { SpellingOccurrenceTextOption } from "../api/types";

interface SpellingOccurrenceTextFilterProps {
	textIds: string[];
	options: SpellingOccurrenceTextOption[];
	search: string;
	isLoading: boolean;
	onChange: (textIds: string[]) => void;
	onSearchChange: (search: string) => void;
}

export const SpellingOccurrenceTextFilter = ({
	textIds,
	options,
	search,
	isLoading,
	onChange,
	onSearchChange,
}: SpellingOccurrenceTextFilterProps) => {
	const { t } = useI18n();

	return (
		<MultiSelectCombobox
			values={textIds}
			options={options.map((option) => ({ value: option.id, label: option.title }))}
			onChange={onChange}
			search={search}
			onSearchChange={onSearchChange}
			isLoading={isLoading}
			placeholder={t("admin.spellingDictionaryDetail.textFilter.placeholder")}
			searchPlaceholder={t("admin.spellingDictionaryDetail.textFilter.searchPlaceholder")}
			emptyLabel={t("admin.spellingDictionaryDetail.textFilter.empty")}
			aria-label={t("admin.spellingDictionaryDetail.textFilter.ariaLabel")}
		/>
	);
};
