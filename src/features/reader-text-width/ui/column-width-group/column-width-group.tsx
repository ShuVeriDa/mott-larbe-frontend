"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { useReaderTextLayout, type ReaderColumnWidth } from "../../model";

const OPTIONS: Array<{ value: ReaderColumnWidth; label: string }> = [
	{ value: "xs", label: "XS" },
	{ value: "sm", label: "S" },
	{ value: "md", label: "M" },
	{ value: "lg", label: "L" },
	{ value: "full", label: "∞" },
];

export interface ColumnWidthGroupProps {
	className?: string;
	buttonClassName?: string;
}

export const ColumnWidthGroup = ({
	className,
	buttonClassName,
}: ColumnWidthGroupProps) => {
	const { t } = useI18n();
	const columnWidth = useReaderTextLayout(s => s.columnWidth);
	const setColumnWidth = useReaderTextLayout(s => s.setColumnWidth);

	return (
		<div
			className={cn("flex gap-1", className)}
			role="group"
			aria-label={t("reader.settings.columnWidth")}
		>
			{OPTIONS.map(item => {
				const active = item.value === columnWidth;
				const handleClick: NonNullable<
					ComponentProps<"button">["onClick"]
				> = () => setColumnWidth(item.value);
				return (
					<Button
						key={item.value}
						variant="bare"
						size={null}
						title={item.label}
						onClick={handleClick}
						aria-pressed={active}
						className={cn(
							"h-[26px] flex-1 rounded-[5px] border-[0.5px] border-bd-1 px-[6px]",
							"text-[11px] font-medium leading-none transition-colors duration-100",
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
