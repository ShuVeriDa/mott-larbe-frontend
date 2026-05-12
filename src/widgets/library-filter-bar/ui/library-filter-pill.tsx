"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export interface LibraryFilterPillProps {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	className: string;
}

export const LibraryFilterPill = ({
	children,
	active,
	onClick,
	className,
}: LibraryFilterPillProps) => (
	<Button
		onClick={onClick}
		aria-pressed={active}
		className={cn(
			"h-[26px] shrink-0 cursor-pointer rounded-full border px-2.5 text-[11px] font-medium transition-all duration-100 [-webkit-tap-highlight-color:transparent]",
			className,
		)}
	>
		{children}
	</Button>
);
