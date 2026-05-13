import { cn } from "@/shared/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const textareaVariants = cva(
	"w-full resize-none outline-none transition-colors",
	{
		variants: {
			variant: {
				default: [
					"field-sizing-content min-h-16 rounded-md border border-input",
					"bg-transparent px-2.5 py-2 text-base shadow-xs",
					"placeholder:text-muted-foreground",
					"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
					"md:text-sm dark:bg-input/30",
				],
				reader: [
					"rounded-lg border border-bd-1 bg-surf",
					"px-3 py-2 text-[13px] text-t-1",
					"placeholder:text-t-4",
					"focus:border-acc/60",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type TextareaProps = ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>;

export const Textarea = ({ className, variant, ...props }: TextareaProps) => (
	<textarea
		data-slot="textarea"
		className={cn(textareaVariants({ variant }), className)}
		{...props}
	/>
);
