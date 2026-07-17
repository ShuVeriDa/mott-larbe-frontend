"use client";

import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { DictionaryEntry } from "@/entities/dictionary";
import { DictionaryWordCheckboxItem } from "./dictionary-word-checkbox-item";

interface DictionaryWordCheckboxListProps {
	dictionaryWords: DictionaryEntry[];
	selectedEntryIds: Set<string>;
	isAtLimit: boolean;
	onToggle: (entryId: string) => void;
}

export const DictionaryWordCheckboxList = ({
	dictionaryWords,
	selectedEntryIds,
	isAtLimit,
	onToggle,
}: DictionaryWordCheckboxListProps) => {
	const { t } = useI18n();

	if (dictionaryWords.length === 0) {
		return (
			<Typography tag="p" size="sm" className="px-2 py-3 text-t-3">
				{t("myTexts.generate.wordsSection.emptyDictionary")}
			</Typography>
		);
	}

	return (
		<div
			role="group"
			aria-label={t("myTexts.generate.wordsSection.fromDictionary")}
			className="max-h-56 space-y-0.5 overflow-y-auto rounded-base border-[0.5px] border-bd-2 bg-surf p-1"
		>
			{dictionaryWords.map((entry) => (
				<DictionaryWordCheckboxItem
					key={entry.id}
					entry={entry}
					checked={selectedEntryIds.has(entry.id)}
					disabled={isAtLimit}
					onToggle={onToggle}
				/>
			))}
		</div>
	);
};
