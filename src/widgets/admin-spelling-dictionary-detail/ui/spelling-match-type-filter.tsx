"use client";

import { type ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { useI18n } from "@/shared/lib/i18n";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";
import {
	fromMatchTypeFilterValue,
	getMatchTypeFilterOptions,
	toMatchTypeFilterValue,
} from "../lib/match-type-filter-options";

interface SpellingMatchTypeFilterProps {
	value: SpellingMatchType | null;
	onChange: (value: SpellingMatchType | null) => void;
}

export const SpellingMatchTypeFilter = ({ value, onChange }: SpellingMatchTypeFilterProps) => {
	const { t } = useI18n();
	const options = getMatchTypeFilterOptions(t);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
		onChange(fromMatchTypeFilterValue(e.currentTarget.value));

	return (
		<Select
			value={toMatchTypeFilterValue(value)}
			onChange={handleChange}
			variant="sm"
			wrapperClassName="w-auto"
			aria-label={t("admin.spellingDictionaryDetail.matchTypeFilter.ariaLabel")}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>{option.label}</option>
			))}
		</Select>
	);
};
