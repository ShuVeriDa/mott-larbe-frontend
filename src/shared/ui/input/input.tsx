import type { ComponentProps } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

import { Typography } from "@/shared/ui/typography";

export const inputVariants = cva(
	[
		"w-full rounded-base border outline-none transition-colors font-[inherit]",
		"text-t-1 placeholder:text-t-3",
	],
	{
		variants: {
			variant: {
				default: [
					"h-[34px] px-[10px] bg-surf-2 border-hairline border-bd-2",
					"text-[13px]",
					"focus:border-acc",
					"disabled:opacity-40 disabled:cursor-not-allowed",
				],
				"search-toolbar": [
					"h-full pl-[30px] pr-2.5 text-[12.5px]",
					"[&::-webkit-search-cancel-button]:appearance-none",
					"focus:border-acc",
					"border-bd-2 bg-surf",
					"disabled:opacity-40 disabled:cursor-not-allowed",
				],
				"search-panel": [
					"h-full pl-[30px] pr-2.5 text-[12.5px]",
					"[&::-webkit-search-cancel-button]:appearance-none",
					"focus:border-acc",
					"border-bd-1 bg-surf-2 focus:bg-surf",
					"disabled:opacity-40 disabled:cursor-not-allowed",
				],
				readonly: [
					"h-[34px] px-[10px] bg-surf-2 border-hairline border-bd-1",
					"text-[13px] text-t-2 pointer-events-none select-none caret-transparent",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type InputProps = ComponentProps<"input"> & VariantProps<typeof inputVariants>;

export const Input = ({ className, type = "text", variant, ...props }: InputProps) => (
	<input
		data-slot="input"
		type={type}
		className={cn(inputVariants({ variant }), className)}
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
