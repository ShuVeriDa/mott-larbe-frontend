"use client";

import { cn } from "@/shared/lib/cn";

interface NavSectionProps {
	label: string;
	isCompactMode?: boolean;
}

export const NavSection = ({ label, isCompactMode = false }: NavSectionProps) => (
	<div
		className={cn(
			"px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3 transition-opacity duration-200",
			isCompactMode && "max-[899px]:px-0 max-[899px]:py-0 max-[899px]:opacity-0",
		)}
	>
		{label}
	</div>
);
