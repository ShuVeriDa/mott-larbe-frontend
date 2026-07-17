"use client";

import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Select } from "@/shared/ui/select";
import { Input, InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { springs } from "@/shared/lib/animations";
import { TOPIC_OPTIONS } from "../lib/topic-options";
import type { GenerationTopic } from "@/entities/text-generation";

interface TopicFieldProps {
	value: GenerationTopic;
	customValue: string;
	fieldError?: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onCustomChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TopicField = ({ value, customValue, fieldError, onChange, onCustomChange }: TopicFieldProps) => {
	const { t } = useI18n();

	return (
		<div>
			<InputLabel htmlFor="generation-topic">{t("myTexts.generate.topic.label")}</InputLabel>
			<Select id="generation-topic" variant="lg" value={value} onChange={onChange}>
				{TOPIC_OPTIONS.map((option) => (
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
							<InputLabel htmlFor="generation-custom-topic">{t("myTexts.generate.topic.custom")}</InputLabel>
							<Input
								id="generation-custom-topic"
								value={customValue}
								onChange={onCustomChange}
								placeholder={t("myTexts.generate.topic.customPlaceholder")}
								aria-invalid={Boolean(fieldError)}
							/>
							{fieldError && (
								<Typography tag="p" size="xs" className="mt-1 text-red-t">
									{t("myTexts.generate.topic.customRequired")}
								</Typography>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
