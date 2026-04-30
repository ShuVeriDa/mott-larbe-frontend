import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

export type ChipProps = ComponentProps<"button"> & {
	active?: boolean;
};

export const Chip = ({
	active = false,
	className,
	type = "button",
	...props
}: ChipProps) => (
	<button
		data-slot="chip"
		type={type}
		aria-pressed={active}
		className={cn(
			"shrink-0 px-[9px] py-[3.5px] rounded-md text-[11px] font-medium font-[inherit]",
			"border-hairline cursor-pointer transition-colors duration-100 whitespace-nowrap",
			"focus-visible:ring-2 focus-visible:ring-acc/40 outline-none",
			active
				? "bg-acc-bg border-acc/20 text-acc-t dark:border-acc/25"
				: "bg-surf-2 border-bd-1 text-t-2 hover:border-bd-2 hover:text-t-1",
			className,
		)}
		{...props}
	/>
);
