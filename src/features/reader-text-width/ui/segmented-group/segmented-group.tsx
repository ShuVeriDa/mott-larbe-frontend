"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";

export interface SegmentedOption<T extends string> {
	value: T;
	label: string;
	shortLabel?: string;
}

export interface SegmentedGroupProps<T extends string> {
	options: SegmentedOption<T>[];
	value: T;
	onChange: (value: T) => void;
	ariaLabel: string;
	className?: string;
	buttonClassName?: string;
}

export const SegmentedGroup = <T extends string>({
	options,
	value,
	onChange,
	ariaLabel,
	className,
	buttonClassName,
}: SegmentedGroupProps<T>) => (
	<div
		className={cn("flex gap-1", className)}
		role="group"
		aria-label={ariaLabel}
	>
		{options.map(item => {
			const active = item.value === value;
			const handleClick: NonNullable<
				ComponentProps<"button">["onClick"]
			> = () => onChange(item.value);
			return (
				<Button
					key={item.value}
					variant="bare"
					size={null}
					onClick={handleClick}
					aria-pressed={active}
					title={item.label}
					className={cn(
						"h-[26px] flex-1 rounded-[5px] border-[0.5px] border-bd-1 px-[9px]",
						"text-[11px] font-medium leading-none transition-colors duration-100",
						active
							? "border-acc/20 bg-acc-bg text-acc-t"
							: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
						buttonClassName,
					)}
				>
					{item.shortLabel ? (
						<>
							<span className="md:hidden">{item.label}</span>
							<span className="hidden md:inline">{item.shortLabel}</span>
						</>
					) : (
						item.label
					)}
				</Button>
			);
		})}
	</div>
);
