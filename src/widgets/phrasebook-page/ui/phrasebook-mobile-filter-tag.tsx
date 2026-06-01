import { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface PhrasebookMobileFilterTagProps {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}

export const PhrasebookMobileFilterTag = ({
	active,
	onClick,
	children,
}: PhrasebookMobileFilterTagProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"h-9 px-2.5 rounded-base text-[12px] font-medium font-[inherit]",
			"shrink-0 border-[0.5px] cursor-pointer transition-all duration-150 motion-reduce:transition-none",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1",
			active
				? "bg-acc-bg text-acc-t border-transparent"
				: "bg-surf-2 border-bd-2 text-t-2",
		)}
	>
		{children}
	</button>
);
