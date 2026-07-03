"use client";

import { ChangeEvent, type KeyboardEvent, MouseEvent, useState } from "react";
import { Popover } from "radix-ui";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn";
import { duration, ease } from "@/shared/lib/animation";
import { Checkbox } from "@/shared/ui/checkbox";

export interface MultiSelectComboboxOption {
	value: string;
	label: string;
}

interface MultiSelectComboboxProps {
	values: string[];
	options: MultiSelectComboboxOption[];
	onChange: (values: string[]) => void;
	search: string;
	onSearchChange: (search: string) => void;
	isLoading?: boolean;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyLabel?: string;
	"aria-label"?: string;
}

export const MultiSelectCombobox = ({
	values,
	options,
	onChange,
	search,
	onSearchChange,
	isLoading = false,
	placeholder,
	searchPlaceholder,
	emptyLabel,
	"aria-label": ariaLabel,
}: MultiSelectComboboxProps) => {
	const [open, setOpen] = useState(false);

	const selectedLabels = options
		.filter(o => values.includes(o.value))
		.map(o => o.label);

	const triggerLabel =
		values.length === 0
			? placeholder ?? ""
			: values.length === 1
				? selectedLabels[0] ?? placeholder ?? ""
				: `${selectedLabels[0] ?? ""} +${values.length - 1}`;

	const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.currentTarget.value);

	const handleToggleOption = (value: string) => () => {
		onChange(
			values.includes(value)
				? values.filter(v => v !== value)
				: [...values, value],
		);
	};

	const handleOptionKeyDown = (value: string) => (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key !== "Enter" && e.key !== " ") return;
		e.preventDefault();
		handleToggleOption(value)();
	};

	const handleClear = (e: MouseEvent<HTMLOrSVGElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onChange([]);
	};

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger
				aria-label={ariaLabel}
				className={cn(
					"group inline-flex h-[30px] min-w-[160px] items-center gap-1.5 rounded-[6px] pl-2.5 pr-2",
					"border border-bd-2 bg-surf-1 text-[12px] text-t-1 font-[inherit]",
					"cursor-pointer outline-none whitespace-nowrap",
					"transition-[border-color,background-color] duration-150 ease-out",
					"hover:border-bd-3 hover:bg-surf-2",
					"focus-visible:border-acc focus-visible:ring-2 focus-visible:ring-acc/20",
					"data-[state=open]:border-acc data-[state=open]:bg-surf-2",
				)}
			>
				<span className={cn("flex-1 truncate text-left", values.length === 0 && "text-t-3")}>
					{triggerLabel}
				</span>
				{values.length > 0 && (
					<XIcon
						className="size-3 shrink-0 text-t-3 transition-colors hover:text-t-1"
						strokeWidth={2.5}
						onClick={handleClear}
						role="button"
						aria-label="clear"
					/>
				)}
				<ChevronDownIcon
					className={cn(
						"size-[10px] shrink-0 text-t-3 transition-[transform,color] duration-200 ease-out",
						"group-data-[state=open]:rotate-180 group-data-[state=open]:text-acc",
					)}
					strokeWidth={2.5}
					aria-hidden="true"
				/>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					sideOffset={5}
					align="start"
					avoidCollisions
					asChild
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: -6 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: duration.base, ease: ease.enter }}
						className={cn(
							"z-50 w-[min(280px,var(--radix-popover-trigger-width))] overflow-hidden",
							"rounded-[8px] border border-bd-2 bg-surf shadow-lg shadow-black/10 dark:shadow-black/25",
						)}
					>
						<div className="relative border-b border-bd-1 p-1.5">
							<SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-t-3" />
							<input
								value={search}
								onChange={handleSearchInputChange}
								placeholder={searchPlaceholder}
								className={cn(
									"h-8 w-full rounded-[6px] border-[0.5px] border-bd-2 bg-surf-2 pl-8 pr-2.5 text-[12px] text-t-1",
									"outline-none placeholder:text-t-3 focus:border-acc",
								)}
							/>
						</div>

						<div className="max-h-[220px] overflow-y-auto p-1">
							{isLoading ? (
								<div className="flex flex-col gap-1 p-1.5">
									{Array.from({ length: 3 }).map((_, i) => (
										<div key={i} className="h-6 w-full animate-pulse rounded-[5px] bg-surf-3" />
									))}
								</div>
							) : options.length === 0 ? (
								<p className="px-2.5 py-3 text-center text-[11.5px] text-t-3">
									{emptyLabel}
								</p>
							) : (
								options.map(option => {
									const checked = values.includes(option.value);
									return (
										<div
											key={option.value}
											role="option"
											aria-selected={checked}
											tabIndex={0}
											onClick={handleToggleOption(option.value)}
											onKeyDown={handleOptionKeyDown(option.value)}
											className={cn(
												"flex w-full items-center gap-2 rounded-[5px] px-2 py-[6px] text-left text-[12px] text-t-1",
												"cursor-pointer outline-none transition-colors duration-100 ease-out",
												"hover:bg-surf-2 focus-visible:bg-surf-2",
											)}
										>
											<Checkbox checked={checked} className="pointer-events-none" />
											<span className="min-w-0 flex-1 truncate">{option.label}</span>
											{checked && <CheckIcon className="size-3 shrink-0 text-acc" strokeWidth={2.5} />}
										</div>
									);
								})
							)}
						</div>
					</motion.div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};
