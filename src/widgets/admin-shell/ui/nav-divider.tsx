"use client";

import { cn } from "@/shared/lib/cn";

interface NavDividerProps {
	isCompactMode?: boolean;
}

export const NavDivider = ({ isCompactMode = false }: NavDividerProps) => (
	<div
		className={cn(
			"mx-3.5 my-1.5 h-px bg-bd-1 transition-[margin] duration-200",
			isCompactMode && "max-[899px]:mx-2",
		)}
	/>
);
