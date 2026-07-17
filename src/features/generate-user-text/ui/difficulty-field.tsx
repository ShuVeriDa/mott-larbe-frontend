"use client";

import type { ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";
import type { GenerationDifficulty } from "@/entities/text-generation";
import { DIFFICULTY_OPTIONS } from "../lib/difficulty-options";

interface DifficultyFieldProps {
	value: GenerationDifficulty | undefined;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const DifficultyField = ({ value, onChange }: DifficultyFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-difficulty">{t("myTexts.generate.difficulty.label")}</InputLabel>
			<Select id="generation-difficulty" variant="lg" value={value ?? ""} onChange={onChange}>
				<option value="">{t("myTexts.generate.difficulty.any")}</option>
				{DIFFICULTY_OPTIONS.map((difficulty) => (
					<option key={difficulty} value={difficulty}>
						{difficulty}
					</option>
				))}
			</Select>
		</div>
	);
};
