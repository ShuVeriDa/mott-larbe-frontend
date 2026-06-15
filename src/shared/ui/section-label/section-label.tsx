import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

interface SectionLabelProps {
	children: ReactNode;
	className?: string;
}

export const SectionLabel = ({ children, className }: SectionLabelProps) => (
	<div
		className={cn(
			"mb-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3",
			className,
		)}
	>
		{children}
	</div>
);
