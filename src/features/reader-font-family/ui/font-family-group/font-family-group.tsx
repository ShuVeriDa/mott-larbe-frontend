"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useReaderFontFamily, type ReaderFontFamily } from "../../model";

const FAMILIES: Array<{ value: ReaderFontFamily; label: string; sampleClass: string }> = [
	{ value: "sans", label: "Sans", sampleClass: "font-sans" },
	{ value: "serif", label: "Serif", sampleClass: "font-serif" },
	{ value: "mono", label: "Mono", sampleClass: "font-mono" },
];

export interface FontFamilyGroupProps {
	className?: string;
	buttonClassName?: string;
}

export const FontFamilyGroup = ({ className, buttonClassName }: FontFamilyGroupProps) => {
	const { t } = useI18n();
	const family = useReaderFontFamily((s) => s.family);
	const setFamily = useReaderFontFamily((s) => s.setFamily);

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.settings.font")}
		>
			{FAMILIES.map((item) => {
				const active = item.value === family;
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
					setFamily(item.value);
				return (
					<Button
						key={item.value}
						variant="bare"
						size={null}
						onClick={handleClick}
						aria-pressed={active}
						className={cn(
							"h-[26px] flex-1 rounded-[5px] border-hairline border-bd-1 px-[9px]",
							"text-[13px] font-medium transition-colors duration-100",
							item.sampleClass,
							active
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							buttonClassName,
						)}
					>
						{item.label}
					</Button>
				);
			})}
		</div>
	);
};
