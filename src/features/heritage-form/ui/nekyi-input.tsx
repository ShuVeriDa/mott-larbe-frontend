"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Textarea } from "@/shared/ui/textarea";
import { InputLabel } from "@/shared/ui/input";

interface NekyiInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const NekyiInput = ({ value, onChange }: NekyiInputProps) => {
	const { t } = useI18n();

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.currentTarget.value.slice(0, 200));
	};

	return (
		<div className="flex flex-col gap-1.5">
			<InputLabel htmlFor="nekyi-input">{t("heritage.nekyi")}</InputLabel>
			<Textarea
				id="nekyi-input"
				name="nekyi"
				variant="reader"
				value={value}
				onChange={handleChange}
				placeholder={t("heritage.nekyi_placeholder")}
				rows={3}
				maxLength={200}
				className="text-[13px] resize-none"
			/>
			<div className="flex items-start justify-between gap-2">
				<p className="text-[11px] text-t-3">{t("heritage.nekyi_hint")}</p>
				<p className="shrink-0 text-[11px] text-t-4">{value.length}/200</p>
			</div>
		</div>
	);
};
