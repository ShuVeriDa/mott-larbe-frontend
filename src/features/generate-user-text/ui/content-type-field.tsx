"use client";

import type { ChangeEvent } from "react";
import { Select } from "@/shared/ui/select";
import { InputLabel } from "@/shared/ui/input";
import { useI18n } from "@/shared/lib/i18n";
import { CONTENT_TYPE_OPTIONS } from "../lib/content-type-options";
import type { GeneratedContentType } from "@/entities/text-generation";

interface ContentTypeFieldProps {
	value: GeneratedContentType;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const ContentTypeField = ({ value, onChange }: ContentTypeFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-content-type">{t("myTexts.generate.contentType.label")}</InputLabel>
			<Select id="generation-content-type" variant="lg" value={value} onChange={onChange}>
				{CONTENT_TYPE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{t(option.labelKey)}
					</option>
				))}
			</Select>
		</div>
	);
};
