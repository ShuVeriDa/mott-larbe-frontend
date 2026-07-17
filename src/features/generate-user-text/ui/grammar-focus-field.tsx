"use client";

import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Select } from "@/shared/ui/select";
import { Input, InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { springs } from "@/shared/lib/animations";
import { GRAMMAR_FOCUS_OPTIONS } from "../lib/grammar-focus-options";
import type { GenerationGrammarFocus } from "@/entities/text-generation";

interface GrammarFocusFieldProps {
	value: GenerationGrammarFocus | undefined;
	customValue: string;
	fieldError?: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onCustomChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const GrammarFocusField = ({
	value,
	customValue,
	fieldError,
	onChange,
	onCustomChange,
}: GrammarFocusFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-grammar-focus">{t("myTexts.generate.grammarFocus.label")}</InputLabel>
			<Select id="generation-grammar-focus" variant="lg" value={value ?? "NONE"} onChange={onChange}>
				{GRAMMAR_FOCUS_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{t(option.labelKey)}
					</option>
				))}
			</Select>
			<AnimatePresence>
				{value === "CUSTOM" && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={springs.snappy}
						className="overflow-hidden"
					>
						<div className="mt-2">
							<InputLabel htmlFor="generation-custom-grammar-focus">{t("myTexts.generate.grammarFocus.custom")}</InputLabel>
							<Input
								id="generation-custom-grammar-focus"
								value={customValue}
								onChange={onCustomChange}
								placeholder={t("myTexts.generate.grammarFocus.customPlaceholder")}
								aria-invalid={Boolean(fieldError)}
							/>
							{fieldError && (
								<Typography tag="p" size="xs" className="mt-1 text-red-t">
									{t("myTexts.generate.grammarFocus.customRequired")}
								</Typography>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
