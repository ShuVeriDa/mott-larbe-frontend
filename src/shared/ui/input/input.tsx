import type { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";

import { Typography } from "@/shared/ui/typography";

export type InputVariant = "default" | "search-toolbar" | "search-panel";

export type InputProps = ComponentProps<"input"> & {
	variant?: InputVariant;
};

export const Input = ({ className, type = "text", variant = "default", ...props }: InputProps) => (
	<input
		data-slot="input"
		type={type}
		className={cn(
			"w-full rounded-base border outline-none transition-colors font-[inherit]",
			"text-t-1 placeholder:text-t-3",
			"disabled:opacity-40 disabled:cursor-not-allowed",
			variant === "default" && [
				"h-[34px] px-[10px] bg-surf-2 border-hairline border-bd-2",
				"text-[13px]",
				"focus:border-acc",
			],
			(variant === "search-toolbar" || variant === "search-panel") && [
				"h-full pl-[30px] pr-2.5 text-[12.5px]",
				"[&::-webkit-search-cancel-button]:appearance-none",
				"focus:border-acc",
			],
			variant === "search-toolbar" && "border-bd-2 bg-surf",
			variant === "search-panel" && "border-bd-1 bg-surf-2 focus:bg-surf",
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
