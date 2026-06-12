"use client";

import { useReaderArabicSettings, ARABIC_FONT_SIZE_STEPS } from "@/features/reader-arabic-settings";
import { useReaderScript } from "@/features/reader-script";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps } from "react";
import { FONT_SIZE_STEPS, useReaderFontSize } from "../../model/font-size-store";

export interface FontSizeGroupProps {
	className?: string;
	buttonClassName?: string;
}

export const FontSizeGroup = ({
	className,
	buttonClassName,
}: FontSizeGroupProps) => {
	const { t } = useI18n();
	const { script } = useReaderScript();
	const isArabic = script === "ARABIC";

	const size = useReaderFontSize(s => s.size);
	const setSize = useReaderFontSize(s => s.setSize);
	const { arabicFontSize, setArabicFontSize } = useReaderArabicSettings();

	const steps = isArabic ? ARABIC_FONT_SIZE_STEPS : FONT_SIZE_STEPS;
	const activeSize = isArabic ? arabicFontSize : size;

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.footer.size")}
		>
			{(steps as readonly number[]).map(step => {
				const active = step === activeSize;
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
					if (isArabic) setArabicFontSize(step as typeof ARABIC_FONT_SIZE_STEPS[number]);
					else setSize(step as typeof FONT_SIZE_STEPS[number]);
				};
				return (
					<Button
						key={step}
						variant="bare"
						size={null}
						onClick={handleClick}
						aria-pressed={active}
						title={`${step}px`}
						className={cn(
							"h-[26px] rounded-[5px] border-[0.5px] border-bd-1 px-[7px]",
							"text-[10px] font-medium leading-none transition-colors duration-100",
							active
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							buttonClassName,
						)}
					>
						{step}
					</Button>
				);
			})}
		</div>
	);
};
