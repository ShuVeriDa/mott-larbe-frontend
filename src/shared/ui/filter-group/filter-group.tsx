"use client";

import { cn } from "@/shared/lib/cn";
import { Chip } from "@/shared/ui/chip";

export interface FilterGroupOption<T> {
	value: T;
	label: string;
	activeClassName?: string;
}

export interface FilterGroupProps<T> {
	label?: string;
	options: FilterGroupOption<T>[];
	value: T;
	onValueChange: (value: T) => void;
	className?: string;
	chipClassName?: string;
}

export const FilterGroup = <T,>({
	label,
	options,
	value,
	onValueChange,
	className,
	chipClassName,
}: FilterGroupProps<T>) => (
	<div className={cn("flex items-center gap-1.5", className)}>
		{label && (
			<span className="shrink-0 text-[11px] font-medium text-t-3">{label}</span>
		)}
		{options.map((option, index) => {
			const isActive = option.value === value;
			const handleClick = () => onValueChange(option.value);
			return (
				<Chip
					key={index}
					active={isActive}
					onClick={handleClick}
					className={cn(chipClassName, isActive && option.activeClassName)}
				>
					{option.label}
				</Chip>
			);
		})}
	</div>
);
