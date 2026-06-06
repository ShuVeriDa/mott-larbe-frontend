"use client";

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
	const size = useReaderFontSize(s => s.size);
	const setSize = useReaderFontSize(s => s.setSize);

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.footer.size")}
		>
			{FONT_SIZE_STEPS.map(step => {
				const active = step === size;
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> =
					() => setSize(step);
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
