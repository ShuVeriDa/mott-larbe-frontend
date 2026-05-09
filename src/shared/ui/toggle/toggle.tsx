"use client";
import type { ComponentProps } from 'react';
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/shared/lib/cn";

export type ToggleProps = ComponentProps<typeof SwitchPrimitive.Root>;

export const Toggle = ({ className, ...props }: ToggleProps) => (
	<SwitchPrimitive.Root
		data-slot="toggle"
		className={cn(
			"relative inline-flex shrink-0 w-[34px] h-5 rounded-[10px] border-hairline outline-none cursor-pointer",
			"transition-[background-color,border-color] duration-200",
			"data-[state=unchecked]:bg-surf-3 data-[state=unchecked]:border-bd-2",
			"data-[state=checked]:bg-acc data-[state=checked]:border-acc",
			"focus-visible:ring-2 focus-visible:ring-acc/40",
			"disabled:opacity-40 disabled:cursor-not-allowed",
			className,
		)}
		{...props}
	>
		<SwitchPrimitive.Thumb
			className={cn(
				"absolute top-[3px] left-[3px] size-[14px] rounded-full bg-white pointer-events-none",
				"shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
				"transition-transform duration-200",
				"data-[state=checked]:translate-x-[14px]",
			)}
		/>
	</SwitchPrimitive.Root>
);
