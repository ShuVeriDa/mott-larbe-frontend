"use client";

import type { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { spring, variants } from "@/shared/lib/animation";
import { Input, InputLabel } from "@/shared/ui/input";

interface TaipCustomInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const TaipCustomInput = ({ value, onChange }: TaipCustomInputProps) => {
	const { t } = useI18n();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.currentTarget.value);
	};

	return (
		<AnimatePresence>
			<motion.div
				key="taip-custom"
				variants={variants.fadeUp}
				initial="hidden"
				animate="visible"
				exit="exit"
				transition={spring.default}
				className="flex flex-col gap-2"
			>
				<div className="flex items-start gap-2 rounded-[8px] border border-amb-bg bg-amb-bg/30 px-3 py-2.5 text-[12px] text-amb-t">
					<InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
					<span>{t("heritage.custom_warning")}</span>
				</div>
				<div>
					<InputLabel htmlFor="taip-custom-input">
						{t("heritage.taip_custom_label")}
					</InputLabel>
					<Input
						id="taip-custom-input"
						name="taipCustom"
						value={value}
						onChange={handleChange}
						placeholder={t("heritage.taip_custom_placeholder")}
						maxLength={100}
						className="text-[13px]"
					/>
					<p className="mt-1 text-right text-[11px] text-t-4">
						{value.length}/100
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
