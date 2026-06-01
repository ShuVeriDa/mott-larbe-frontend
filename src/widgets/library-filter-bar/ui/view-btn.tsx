"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import type { ReactNode } from "react";

interface ViewBtnProps {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	"aria-label": string;
}

export const ViewBtn = ({
	children,
	active,
	onClick,
	"aria-label": ariaLabel,
}: ViewBtnProps) => (
	<Button
		onClick={onClick}
		size={"bare"}
		aria-label={ariaLabel}
		title={ariaLabel}
		aria-pressed={active}
		className={cn(
			"flex h-[26px] w-[26px] items-center justify-center transition-all duration-100",
			active ? "bg-surf-2 text-acc-t" : "bg-transparent text-t-3",
		)}
	>
		{children}
	</Button>
);
