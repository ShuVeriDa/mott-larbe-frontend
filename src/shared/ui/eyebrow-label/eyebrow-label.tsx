import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

interface EyebrowLabelProps {
	children: ReactNode;
	className?: string;
}

export const EyebrowLabel = ({ children, className }: EyebrowLabelProps) => (
	<span
		className={cn(
			"mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t",
			className,
		)}
	>
		{children}
	</span>
);
