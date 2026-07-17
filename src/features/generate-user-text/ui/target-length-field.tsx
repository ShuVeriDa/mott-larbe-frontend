"use client";

import type { ChangeEvent } from "react";
import { Input, InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";

interface TargetLengthFieldProps {
	value: number;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TargetLengthField = ({ value, onChange }: TargetLengthFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-target-length">{t("myTexts.generate.length.label")}</InputLabel>
			<Input
				id="generation-target-length"
				type="number"
				min={30}
				max={600}
				step={10}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};
