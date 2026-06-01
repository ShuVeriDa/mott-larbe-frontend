import { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface PhrasebookFilterTagProps {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}

export const PhrasebookFilterTag = ({
	active,
	onClick,
	children,
}: PhrasebookFilterTagProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"h-6 px-2.5 rounded-base text-[11.5px] font-medium font-[inherit] cursor-pointer",
			"border-[0.5px] transition-all duration-150 motion-reduce:transition-none",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1",
			active
				? "bg-acc-bg text-acc-t border-transparent"
				: "bg-surf-2 border-bd-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
		)}
	>
		{children}
	</button>
);
