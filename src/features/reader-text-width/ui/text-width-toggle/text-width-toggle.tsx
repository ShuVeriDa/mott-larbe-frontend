"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useReaderTextWidth, type ReaderTextWidth } from "../../model";

const OPTIONS: Array<{ value: ReaderTextWidth; labelKey: string }> = [
	{ value: "small", labelKey: "reader.settings.widthSmall" },
	{ value: "full", labelKey: "reader.settings.widthFull" },
];

export interface TextWidthToggleProps {
	className?: string;
	buttonClassName?: string;
}

export const TextWidthToggle = ({ className, buttonClassName }: TextWidthToggleProps) => {
	const { t } = useI18n();
	const width = useReaderTextWidth((s) => s.width);
	const setWidth = useReaderTextWidth((s) => s.setWidth);

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.settings.width")}
		>
			{OPTIONS.map((item) => {
				const active = item.value === width;
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
					setWidth(item.value);
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
							active
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							buttonClassName,
						)}
					>
						{t(item.labelKey)}
					</Button>
				);
			})}
		</div>
	);
};
