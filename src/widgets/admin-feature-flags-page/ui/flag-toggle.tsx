"use client";

import { cn } from "@/shared/lib/cn";

interface FlagToggleProps {
	enabled: boolean;
	disabled?: boolean;
	onChange: (v: boolean) => void;
}

export const FlagToggle = ({ enabled, disabled, onChange }: FlagToggleProps) => (
	<label
		className={cn(
			"relative inline-flex h-[19px] w-[34px] cursor-pointer items-center",
			disabled && "cursor-not-allowed opacity-50",
		)}
	>
		<input
			type="checkbox"
			className="absolute h-0 w-0 opacity-0"
			checked={enabled}
			disabled={disabled}
			onChange={(e) => onChange(e.target.checked)}
		/>
		<span
			className={cn(
				"relative block h-[19px] w-[34px] rounded-[10px] border transition-all duration-200",
				enabled
					? "border-grn bg-grn"
					: "border-bd-2 bg-surf-3",
			)}
		>
			<span
				className={cn(
					"absolute top-[2.5px] h-[13px] w-[13px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform duration-[180ms]",
					enabled ? "left-[2.5px] translate-x-[15px]" : "left-[2.5px]",
				)}
			/>
		</span>
	</label>
);
