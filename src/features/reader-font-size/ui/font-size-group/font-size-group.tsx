"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import {
	useReaderFontSize,
	type ReaderFontSize,
} from "../../model/font-size-store";

const SIZES: Array<{ value: ReaderFontSize; label: string }> = [
	{ value: "sm", label: "A−" },
	{ value: "md", label: "A" },
	{ value: "lg", label: "A+" },
];

export interface FontSizeGroupProps {
	className?: string;
	buttonClassName?: string;
}

export const FontSizeGroup = ({
	className,
	buttonClassName,
}: FontSizeGroupProps) => {
	const { t } = useI18n();
	const size = useReaderFontSize((s) => s.size);
	const setSize = useReaderFontSize((s) => s.setSize);

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.footer.size")}
		>
			{SIZES.map((item) => {
				const active = item.value === size;
								const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setSize(item.value);
return (
					<Button
						key={item.value}
						onClick={handleClick}
						aria-pressed={active}
						className={cn(
							"h-[26px] rounded-[5px] border-hairline border-bd-1 px-[9px]",
							"text-[11px] font-medium transition-colors duration-100",
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
