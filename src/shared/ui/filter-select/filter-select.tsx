"use client";

import { cn } from "@/shared/lib/cn";
import { ease, duration } from "@/shared/lib/animation";
import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { motion } from "framer-motion";

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

const EMPTY_SENTINEL = "__empty__";

const toRadix = (v: string) => (v === "" ? EMPTY_SENTINEL : v);
const fromRadix = (v: string) => (v === EMPTY_SENTINEL ? "" : v);

const itemVariants = {
	hidden: { opacity: 0, x: -3 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: duration.fast,
			ease: ease.enter,
			delay: i * 0.025,
		},
	}),
} as const;

export const FilterSelect = ({
	value,
	options,
	onChange,
	placeholder,
	"aria-label": ariaLabel,
}: FilterSelectProps) => {
	const selectedLabel =
		options.find(o => o.value === value)?.label ?? placeholder ?? "";
	const handleChange = (v: string) => onChange(fromRadix(v));

	return (
		<Select.Root value={toRadix(value)} onValueChange={handleChange}>
			<Select.Trigger
				aria-label={ariaLabel}
				className={cn(
					"group inline-flex items-center gap-1.5 h-[26px] pl-2.5 pr-2 rounded-[6px]",
					"border border-bd-2 bg-surf-1 text-[11px] text-t-1 font-[inherit]",
					"cursor-pointer outline-none whitespace-nowrap shrink-0",
					"transition-[border-color,background-color] duration-150 ease-out",
					"hover:border-bd-3 hover:bg-surf-2",
					"focus-visible:border-acc focus-visible:ring-2 focus-visible:ring-acc/20",
					"data-[state=open]:border-acc data-[state=open]:bg-surf-2",
				)}
			>
				<Select.Value aria-label={selectedLabel}>
					{selectedLabel}
				</Select.Value>
				<ChevronDownIcon
					className={cn(
						"size-[10px] text-t-3 shrink-0 pointer-events-none",
						"transition-[transform,color] duration-200 ease-out",
						"group-data-[state=open]:rotate-180 group-data-[state=open]:text-acc",
					)}
					strokeWidth={2.5}
					aria-hidden="true"
				/>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					position="popper"
					sideOffset={5}
					align="start"
					avoidCollisions
					asChild
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: -6 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						className={cn(
							"z-50 min-w-(--radix-select-trigger-width) overflow-hidden",
							"rounded-[8px] border border-bd-2 bg-surf p-1",
							"shadow-lg shadow-black/10 dark:shadow-black/25",
							"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
							"data-[state=closed]:duration-150",
						)}
						transition={{ duration: duration.base, ease: ease.enter }}
					>
						<Select.Viewport>
							{options.map((option, i) => (
								<Select.Item
									key={option.value}
									value={toRadix(option.value)}
									className={cn(
										"relative flex items-center gap-2 px-2.5 py-[5px] pr-8",
										"rounded-[5px] text-[11px] text-t-1 cursor-pointer select-none outline-none",
										"transition-colors duration-100 ease-out",
										"data-highlighted:bg-surf-2 data-highlighted:text-t-1",
										"data-[state=checked]:text-acc data-[state=checked]:font-medium",
									)}
								>
									<motion.span
										custom={i}
										variants={itemVariants}
										initial="hidden"
										animate="visible"
										className="contents"
									>
										<Select.ItemText>{option.label}</Select.ItemText>
										<Select.ItemIndicator className="absolute right-2 flex items-center">
											<CheckIcon className="size-[11px] text-acc" strokeWidth={2.5} />
										</Select.ItemIndicator>
									</motion.span>
								</Select.Item>
							))}
						</Select.Viewport>
					</motion.div>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};
