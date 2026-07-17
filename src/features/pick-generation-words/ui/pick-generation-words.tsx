"use client";

import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { PickGenerationWordsState } from "../model/types";
import { DictionaryWordCheckboxList } from "./dictionary-word-checkbox-list";
import { CustomWordInput } from "./custom-word-input";

interface PickGenerationWordsProps {
	state: PickGenerationWordsState;
}

export const PickGenerationWords = ({ state }: PickGenerationWordsProps) => {
	const { t } = useI18n();
	const {
		dictionaryWords,
		selectedEntryIds,
		customWords,
		customWordInput,
		totalSelectedCount,
		isAtLimit,
		handleToggleDictionaryWord,
		handleRemoveCustomWord,
		handleCustomWordInputChange,
		handleCustomWordKeyDown,
	} = state;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Typography tag="h3" size="sm" className="font-semibold text-t-1">
					{t("myTexts.generate.wordsSection.title")}
				</Typography>
				<Typography tag="span" size="xs" className="text-t-3">
					{t("myTexts.generate.wordsSection.selectedCount", { count: totalSelectedCount })}
				</Typography>
			</div>

			<div>
				<Typography tag="p" size="xs" className="mb-1.5 font-medium text-t-2">
					{t("myTexts.generate.wordsSection.fromDictionary")}
				</Typography>
				<DictionaryWordCheckboxList
					dictionaryWords={dictionaryWords}
					selectedEntryIds={selectedEntryIds}
					isAtLimit={isAtLimit}
					onToggle={handleToggleDictionaryWord}
				/>
			</div>

			<CustomWordInput
				customWords={customWords}
				customWordInput={customWordInput}
				isAtLimit={isAtLimit}
				onInputChange={handleCustomWordInputChange}
				onKeyDown={handleCustomWordKeyDown}
				onRemove={handleRemoveCustomWord}
			/>

			{isAtLimit && (
				<Typography tag="p" size="xs" className="text-amb-t">
					{t("myTexts.generate.wordsSection.limitReached")}
				</Typography>
			)}
		</div>
	);
};
