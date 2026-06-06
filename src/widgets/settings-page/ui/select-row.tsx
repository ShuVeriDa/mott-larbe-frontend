"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps } from "react";

export interface SelectRowOption<T extends string> {
	value: T;
	label: string;
}

export interface SelectRowProps<T extends string> {
	label: string;
	description?: string;
	options: SelectRowOption<T>[];
	value: T;
	onChange: (value: T) => void;
}

export const SelectRow = <T extends string>({
	label,
	description,
	options,
	value,
	onChange,
}: SelectRowProps<T>) => (
	<div className="flex flex-col gap-2 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
		<div>
			<Typography tag="p" className="text-[13px] font-medium text-t-1">
				{label}
			</Typography>
			{description ? (
				<Typography tag="p" className="mt-0.5 text-[11.5px] leading-normal text-t-3">
					{description}
				</Typography>
			) : null}
		</div>
		<div className="flex flex-wrap gap-1" role="group" aria-label={label}>
			{options.map(opt => {
				const active = opt.value === value;
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> =
					() => onChange(opt.value);
				return (
					<Button
						key={opt.value}
						variant="bare"
						size={null}
						onClick={handleClick}
						aria-pressed={active}
						className={cn(
							"h-7 rounded-[5px] border-[0.5px] border-bd-1 px-2.5",
							"text-[11.5px] font-medium leading-none transition-colors duration-100",
							active
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
						)}
					>
						{opt.label}
					</Button>
				);
			})}
		</div>
	</div>
);
