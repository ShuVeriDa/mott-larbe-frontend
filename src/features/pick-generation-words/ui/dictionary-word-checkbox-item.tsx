"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { DictionaryEntry } from "@/entities/dictionary";
import { LANGUAGE_BADGE_CODE, wordLanguage } from "../lib/word-language";

interface DictionaryWordCheckboxItemProps {
	entry: DictionaryEntry;
	checked: boolean;
	disabled: boolean;
	onToggle: (entryId: string) => void;
}

export const DictionaryWordCheckboxItem = ({
	entry,
	checked,
	disabled,
	onToggle,
}: DictionaryWordCheckboxItemProps) => {
	const { t } = useI18n();
	const language = wordLanguage(entry);

	const handleCheckedChange = () => onToggle(entry.id);

	return (
		<label
			htmlFor={`generation-word-${entry.id}`}
			className="group flex min-h-11 items-center gap-2.5 rounded-base px-2 py-2 transition-colors duration-150 ease-out hover:bg-surf-2 has-disabled:opacity-50 has-disabled:pointer-events-none"
		>
			<Checkbox
				id={`generation-word-${entry.id}`}
				checked={checked}
				disabled={disabled && !checked}
				onCheckedChange={handleCheckedChange}
				aria-label={entry.word}
			/>
			<Typography tag="span" size="sm" className="flex-1 truncate text-t-1">
				{entry.word}
			</Typography>
			{language ? (
				<Badge variant="acc">{LANGUAGE_BADGE_CODE[language]}</Badge>
			) : (
				<Badge variant="neu">{t("myTexts.generate.wordsSection.unknownLanguage")}</Badge>
			)}
		</label>
	);
};
