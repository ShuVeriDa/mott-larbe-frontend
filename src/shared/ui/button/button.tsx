import { cn } from "@/shared/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
	[
		"inline-flex items-center justify-center gap-[5px] whitespace-nowrap",
		"rounded-base font-[inherit] cursor-pointer outline-none",
		"transition-[background-color,border-color,color,opacity] duration-150",
		"disabled:opacity-40 disabled:cursor-default disabled:pointer-events-none",
		"focus-visible:ring-2 focus-visible:ring-acc/40",
	],
	{
		variants: {
			variant: {
				action: "bg-acc text-white font-semibold border-0 hover:opacity-[0.88]",
				ghost:
					"bg-transparent border-hairline border-bd-2 text-t-2 hover:bg-surf-2 hover:border-bd-3 hover:text-t-1",
				outline:
					"bg-surf border-hairline border-bd-2 text-t-2 hover:bg-surf-2 hover:border-bd-3 hover:text-t-1",
				save: "bg-grn text-white font-semibold border-0 hover:opacity-[0.88]",
				danger:
					"bg-transparent border-hairline border-red/30 text-red font-medium hover:bg-red-bg",
				bare: "",
			},
			size: {
				default: "h-[30px] px-3 text-[12px]",
				lg: "h-[38px] px-5 text-[13px] rounded-[8px]",
				"icon-sm": "size-7 p-0 [&_svg]:size-3.5",
			},
		},
		defaultVariants: {
			variant: "action",
			size: "default",
		},
	},
);

export type ButtonProps = ComponentProps<"button"> &
	VariantProps<typeof buttonVariants>;

export const Button = ({
	className,
	variant,
	size,
	type = "button",
	...props
}: ButtonProps) => {
	const resolvedVariant = variant ?? (className ? "bare" : undefined);

	return (
		<button
			data-slot="button"
			type={type}
			className={cn(buttonVariants({ variant: resolvedVariant, size }), className)}
			{...props}
		/>
	);
};
