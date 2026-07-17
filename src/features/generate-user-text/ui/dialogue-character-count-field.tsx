"use client";

import type { ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";

const CHARACTER_COUNT_OPTIONS = [2, 3, 4] as const;

interface DialogueCharacterCountFieldProps {
	value: number;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const DialogueCharacterCountField = ({ value, onChange }: DialogueCharacterCountFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-dialogue-character-count">
				{t("myTexts.generate.dialogueCharacterCount.label")}
			</InputLabel>
			<Select id="generation-dialogue-character-count" variant="lg" value={value} onChange={onChange}>
				{CHARACTER_COUNT_OPTIONS.map((count) => (
					<option key={count} value={count}>
						{count}
					</option>
				))}
			</Select>
		</div>
	);
};
