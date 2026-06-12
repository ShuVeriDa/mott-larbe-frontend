"use client";

import { useReaderArabicSettings, ARABIC_FONT_SIZE_STEPS } from "@/features/reader-arabic-settings";
import { useReaderScript } from "@/features/reader-script";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { ComponentProps } from "react";
import { FONT_SIZE_STEPS, useReaderFontSize } from "../../model/font-size-store";

export interface FontSizeSliderProps {
	className?: string;
}

export const FontSizeSlider = ({ className }: FontSizeSliderProps) => {
	const { script } = useReaderScript();
	const isArabic = script === "ARABIC";

	const size = useReaderFontSize(s => s.size);
	const setSize = useReaderFontSize(s => s.setSize);
	const { arabicFontSize, setArabicFontSize } = useReaderArabicSettings();

	const steps = isArabic ? ARABIC_FONT_SIZE_STEPS : FONT_SIZE_STEPS;
	const activeSize = isArabic ? arabicFontSize : size;
	const handleSet = isArabic
		? (v: number) => setArabicFontSize(v as typeof ARABIC_FONT_SIZE_STEPS[number])
		: (v: number) => setSize(v as typeof FONT_SIZE_STEPS[number]);

	const stepIndex = (steps as readonly number[]).indexOf(activeSize);
	const fillPercent = (stepIndex / (steps.length - 1)) * 100;

	const handleDecrease: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		if (stepIndex > 0) handleSet(steps[stepIndex - 1]);
	};
	const handleIncrease: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		if (stepIndex < steps.length - 1) handleSet(steps[stepIndex + 1]);
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Button
				variant="bare"
				size={null}
				onClick={handleDecrease}
				aria-label="-"
				disabled={stepIndex === 0}
				className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-[0.5px] border-bd-2 bg-surf-2 text-sm font-semibold text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3 disabled:opacity-35 disabled:pointer-events-none"
			>
				−
			</Button>
			<Typography
				tag="span"
				className="w-10 shrink-0 text-center text-[12px] font-semibold text-t-1 tabular-nums"
			>
				{activeSize}px
			</Typography>
			<div className="h-[3px] flex-1 overflow-hidden rounded-[2px] bg-surf-3">
				<div
					className="h-full rounded-[2px] bg-acc transition-[width] duration-150"
					style={{ width: `${fillPercent}%` }}
				/>
			</div>
			<Button
				variant="bare"
				size={null}
				onClick={handleIncrease}
				aria-label="+"
				disabled={stepIndex === steps.length - 1}
				className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-[0.5px] border-bd-2 bg-surf-2 text-sm font-semibold text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3 disabled:opacity-35 disabled:pointer-events-none"
			>
				+
			</Button>
		</div>
	);
};
