"use client";

import { type ChangeEvent } from "react";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";
import { getMatchTypeOptions } from "../lib/match-type-options";

interface SpellingFindReplaceFormProps {
	wrongForm: string;
	matchType: SpellingMatchType;
	correctForm: string;
	onWrongFormChange: (value: string) => void;
	onMatchTypeChange: (value: SpellingMatchType) => void;
	onCorrectFormChange: (value: string) => void;
}

export const SpellingFindReplaceForm = ({
	wrongForm,
	matchType,
	correctForm,
	onWrongFormChange,
	onMatchTypeChange,
	onCorrectFormChange,
}: SpellingFindReplaceFormProps) => {
	const { t } = useI18n();
	const matchTypeOptions = getMatchTypeOptions(t);

	const handleWrongFormInputChange = (e: ChangeEvent<HTMLInputElement>) =>
		onWrongFormChange(e.currentTarget.value);
	const handleMatchTypeSelectChange = (e: ChangeEvent<HTMLSelectElement>) =>
		onMatchTypeChange(e.currentTarget.value as SpellingMatchType);
	const handleCorrectFormInputChange = (e: ChangeEvent<HTMLInputElement>) =>
		onCorrectFormChange(e.currentTarget.value);

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr]">
			<div>
				<Typography tag="label" className="mb-[5px] block text-[11.5px] font-medium text-t-2">
					{t("admin.spellingDictionaryFindReplace.wrongFormLabel")}
				</Typography>
				<Input
					value={wrongForm}
					onChange={handleWrongFormInputChange}
					placeholder={t("admin.spellingDictionaryFindReplace.wrongFormPlaceholder")}
				/>
			</div>

			<div>
				<Typography tag="label" className="mb-[5px] block text-[11.5px] font-medium text-t-2">
					{t("admin.spellingDictionaryFindReplace.matchTypeLabel")}
				</Typography>
				<Select value={matchType} onChange={handleMatchTypeSelectChange} variant="lg" className="w-auto">
					{matchTypeOptions.map((option) => (
						<option key={option.value} value={option.value}>{option.label}</option>
					))}
				</Select>
			</div>

			<div>
				<Typography tag="label" className="mb-[5px] block text-[11.5px] font-medium text-t-2">
					{t("admin.spellingDictionaryFindReplace.correctFormLabel")}
				</Typography>
				<Input
					value={correctForm}
					onChange={handleCorrectFormInputChange}
					placeholder={t("admin.spellingDictionaryFindReplace.correctFormPlaceholder")}
				/>
			</div>
		</div>
	);
};
