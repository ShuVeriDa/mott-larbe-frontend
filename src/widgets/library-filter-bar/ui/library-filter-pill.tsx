"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export interface LibraryFilterPillProps {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	className: string;
	title?: string;
}

export const LibraryFilterPill = ({
	children,
	active,
	onClick,
	className,
	title,
}: LibraryFilterPillProps) => (
	<Button
		onClick={onClick}
		aria-pressed={active}
		title={title}
		className={cn(
			"h-[22px] shrink-0 cursor-pointer rounded-full border px-2 text-[10px] font-medium transition-all duration-100 [-webkit-tap-highlight-color:transparent] @[900px]:h-[26px] @[900px]:px-2.5 @[900px]:text-[11px]",
			className,
		)}
	>
		{children}
	</Button>
);
