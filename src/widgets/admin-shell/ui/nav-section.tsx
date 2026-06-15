"use client";

import { cn } from "@/shared/lib/cn";
import { SectionLabel } from "@/shared/ui/section-label";

interface NavSectionProps {
	label: string;
	isCompactMode?: boolean;
}

export const NavSection = ({ label, isCompactMode = false }: NavSectionProps) => (
	<SectionLabel
		className={cn(
			"px-3.5 pb-0.5 pt-3 mb-0 transition-opacity duration-200",
			isCompactMode && "max-[899px]:px-0 max-[899px]:py-0 max-[899px]:opacity-0",
		)}
	>
		{label}
	</SectionLabel>
);
