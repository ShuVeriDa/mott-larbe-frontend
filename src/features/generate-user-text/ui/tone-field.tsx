"use client";

import type { ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";
import { TONE_OPTIONS } from "../lib/tone-options";
import type { GenerationTone } from "@/entities/text-generation";

interface ToneFieldProps {
	value: GenerationTone | undefined;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const ToneField = ({ value, onChange }: ToneFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-tone">{t("myTexts.generate.tone.label")}</InputLabel>
			<Select id="generation-tone" variant="lg" value={value ?? ""} onChange={onChange}>
				<option value="">{t("myTexts.generate.tone.any")}</option>
				{TONE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{t(option.labelKey)}
					</option>
				))}
			</Select>
		</div>
	);
};
