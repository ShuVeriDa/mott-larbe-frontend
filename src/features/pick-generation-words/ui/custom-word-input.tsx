"use client";

import { AnimatePresence } from "framer-motion";
import { Input, InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";
import { CustomWordChip } from "./custom-word-chip";
import type { ChangeEvent, KeyboardEvent } from "react";

interface CustomWordInputProps {
	customWords: string[];
	customWordInput: string;
	isAtLimit: boolean;
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	onRemove: (word: string) => void;
}

export const CustomWordInput = ({
	customWords,
	customWordInput,
	isAtLimit,
	onInputChange,
	onKeyDown,
	onRemove,
}: CustomWordInputProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-custom-word-input">
				{t("myTexts.generate.wordsSection.customWordsPlaceholder")}
			</InputLabel>
			<Input
				id="generation-custom-word-input"
				value={customWordInput}
				onChange={onInputChange}
				onKeyDown={onKeyDown}
				disabled={isAtLimit}
				placeholder={t("myTexts.generate.wordsSection.customWordsPlaceholder")}
			/>
			{customWords.length > 0 && (
				<ul className="mt-2 flex flex-wrap gap-1.5" aria-label={t("myTexts.generate.wordsSection.customWordsPlaceholder")}>
					<AnimatePresence mode="popLayout">
						{customWords.map((word) => (
							<CustomWordChip key={word} word={word} onRemove={onRemove} />
						))}
					</AnimatePresence>
				</ul>
			)}
		</div>
	);
};
