import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";

export const badgeVariants = cva(
	"inline-flex items-center gap-1 px-[7px] py-[2px] rounded-[5px] text-[10.5px] font-semibold whitespace-nowrap",
	{
		variants: {
			variant: {
				grn: "bg-grn-bg text-grn-t",
				red: "bg-red-bg text-red-t",
				amb: "bg-amb-bg text-amb-t",
				acc: "bg-acc-bg text-acc-t",
				pur: "bg-pur-bg text-pur-t",
				neu: "bg-surf-3 text-t-2",
			},
		},
		defaultVariants: {
			variant: "neu",
		},
	},
);

export type BadgeProps = ComponentProps<"span"> &
	VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
	<span
		data-slot="badge"
		className={cn(badgeVariants({ variant }), className)}
		{...props}
	/>
);
