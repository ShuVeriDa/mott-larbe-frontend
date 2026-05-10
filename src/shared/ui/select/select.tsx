import type { ComponentProps } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SelectProps = Omit<ComponentProps<"select">, "size"> & {
	variant?: "sm" | "lg";
	wrapperClassName?: string;
};

export const Select = ({
	className,
	wrapperClassName,
	variant = "sm",
	children,
	...props
}: SelectProps) => (
	<div
		data-slot="select"
		className={cn("relative inline-flex w-full", wrapperClassName)}
	>
		<select
			data-slot="select-input"
			className={cn(
				"appearance-none w-full pl-[10px] pr-[28px]",
				"border-hairline border-bd-2 rounded-base",
				"text-t-1 font-[inherit] cursor-pointer outline-none",
				"transition-colors duration-150",
				"focus:border-acc",
				"disabled:opacity-40 disabled:cursor-not-allowed",
				variant === "sm" && "h-[30px] bg-surf-2 text-[12px]",
				variant === "lg" && "h-[34px] bg-surf-2 rounded-[8px] text-[13px]",
				className,
			)}
			{...props}
		>
			{children}
		</select>
		<ChevronDown
			className="absolute right-[9px] top-1/2 -translate-y-1/2 size-[10px] text-t-3 pointer-events-none"
			strokeWidth={2}
			aria-hidden="true"
		/>
	</div>
);
