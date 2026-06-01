"use client";

import { Select } from "@/shared/ui/select";

export interface FilterSelectOption {
	value: string;
	label: string;
}

interface FilterSelectProps {
	value: string;
	options: FilterSelectOption[];
	onChange: (value: string) => void;
	placeholder?: string;
	"aria-label"?: string;
}

export const FilterSelect = ({
	value,
	options,
	onChange,
	placeholder,
	"aria-label": ariaLabel,
}: FilterSelectProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onChange(e.currentTarget.value);

	return (
		<Select
			value={value}
			onChange={handleChange}
			aria-label={ariaLabel}
			wrapperClassName="w-auto shrink-0"
			className="h-[26px] text-[11px] pl-2 pr-6 rounded-[5px] bg-surf-1"
		>
			{placeholder && (
				<option value="" disabled>
					{placeholder}
				</option>
			)}
			{options.map(option => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</Select>
	);
};
