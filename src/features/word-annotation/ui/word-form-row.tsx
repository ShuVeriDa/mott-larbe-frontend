"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Input } from "@/shared/ui/input";
import type { ChangeEvent } from "react";

interface WordFormRowProps {
	wordForm: string;
	formTranslation: string;
	onFormTranslationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const WordFormRow = ({
	wordForm,
	formTranslation,
	onFormTranslationChange,
}: WordFormRowProps) => {
	const { t } = useI18n();

	return (
		<div className="flex gap-2 border-t border-hairline border-bd-1 px-5 py-3">
			<Input
				value={wordForm}
				disabled
				placeholder={t("admin.texts.editPage.wordAnnotation.wordFormPlaceholder")}
				className="flex-1"
				variant="readonly"
			/>
			<Input
				value={formTranslation}
				onChange={onFormTranslationChange}
				placeholder={t("admin.texts.editPage.wordAnnotation.formTranslationPlaceholder")}
				className="flex-1 bg-white"
			/>
		</div>
	);
};
