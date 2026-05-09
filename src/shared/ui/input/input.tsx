import type { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";

import { Typography } from "@/shared/ui/typography";
export type InputProps = ComponentProps<"input">;

export const Input = ({ className, type = "text", ...props }: InputProps) => (
	<input
		data-slot="input"
		type={type}
		className={cn(
			"h-[34px] w-full px-[10px] bg-surf-2 border-hairline border-bd-2 rounded-base",
			"text-[13px] text-t-1 font-[inherit] outline-none",
			"transition-colors duration-100",
			"placeholder:text-t-3",
			"focus:border-acc",
			"disabled:opacity-40 disabled:cursor-not-allowed",
			className,
		)}
		{...props}
	/>
);

export type InputLabelProps = ComponentProps<"label">;

export const InputLabel = ({ className, ...props }: InputLabelProps) => (
	<Typography tag="label"
		data-slot="input-label"
		className={cn(
			"block mb-[5px] text-[11.5px] font-medium text-t-2",
			className,
		)}
		{...props}
	/>
);
