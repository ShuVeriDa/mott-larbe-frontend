"use client";

import { MouseEvent, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface PhraseActionButtonProps {
	onClick: (e: MouseEvent) => void;
	active?: boolean;
	title?: string;
	children: ReactNode;
}

export const PhraseActionButton = ({
	onClick,
	active,
	title,
	children,
}: PhraseActionButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		title={title}
		className={cn(
			"relative w-[26px] h-[26px] rounded-base flex items-center justify-center",
			"bg-transparent border-[0.5px] border-transparent cursor-pointer",
			"transition-colors duration-150 motion-reduce:transition-none",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1",
			"before:absolute before:inset-[-9px] before:content-['']",
			active
				? "text-acc-t bg-acc-bg"
				: "text-t-3 hover:bg-surf-2 hover:border-bd-1 hover:text-t-2",
		)}
	>
		{children}
	</button>
);
