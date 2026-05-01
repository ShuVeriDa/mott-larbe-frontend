"use client";

import { Switch } from "@/shared/ui/switch";
import { Typography } from "@/shared/ui/typography";

export interface ToggleRowProps {
	label: string;
	description?: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (next: boolean) => void;
}

export const ToggleRow = ({
	label,
	description,
	checked,
	disabled,
	onChange,
}: ToggleRowProps) => (
	<div className="flex items-start justify-between gap-4 border-hairline border-b border-bd-1 px-4 py-3 last:border-b-0">
		<div className="min-w-0 flex-1">
			<Typography tag="p" className="text-[13px] font-medium text-t-1">
				{label}
			</Typography>
			{description ? (
				<Typography
					tag="p"
					className="mt-0.5 text-[11.5px] leading-normal text-t-3"
				>
					{description}
				</Typography>
			) : null}
		</div>
		<Switch
			checked={checked}
			disabled={disabled}
			onCheckedChange={onChange}
			className="mt-0.5"
		/>
	</div>
);
