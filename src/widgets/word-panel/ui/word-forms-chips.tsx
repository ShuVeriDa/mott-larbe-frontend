"use client";

import { Typography } from "@/shared/ui/typography";

import { cn } from "@/shared/lib/cn";

export interface WordFormsChipsProps {
	forms: readonly string[];
	current: string | null;
}

export const WordFormsChips = ({ forms, current }: WordFormsChipsProps) => {
	if (!forms.length) return null;
	return (
		<div className="flex flex-wrap gap-1">
			{forms.map((form) => {
				const isCurrent = form === current;
				return (
					<Typography tag="span"
						key={form}
						className={cn(
							"rounded-[5px] border-hairline px-2 py-[2.5px] text-[11px]",
							isCurrent
								? "border-acc/20 bg-acc-bg font-semibold text-acc-t"
								: "border-bd-1 bg-surf-2 text-t-2",
						)}
					>
						{form}
					</Typography>
				);
			})}
		</div>
	);
};
