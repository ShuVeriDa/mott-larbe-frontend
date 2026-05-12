"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export interface LibraryPreviewFilterButtonProps {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}

export const LibraryPreviewFilterButton = ({
	active,
	onClick,
	children,
}: LibraryPreviewFilterButtonProps) => (
	<Button
		onClick={onClick}
		className={cn(
			"h-[22px] rounded-[5px] px-2 text-[10.5px] font-medium transition-colors",
			active
				? "bg-acc-bg text-acc-t"
				: "text-t-3 hover:bg-surf-2 hover:text-t-2",
		)}
	>
		{children}
	</Button>
);
