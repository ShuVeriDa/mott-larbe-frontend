"use client";

import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { type ComponentProps, type MouseEvent, type ReactNode } from "react";

export type DemoTokenStatus = "default" | "studied" | "unknown";

interface DemoTokenProps {
	word: string;
	status?: DemoTokenStatus;
	active: boolean;
	onSelect: (word: string, el: HTMLElement) => void;
	children: ReactNode;
}

export const DemoToken = ({
	word,
	status = "default",
	active,
	onSelect,
	children,
}: DemoTokenProps) => {
	const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		onSelect(word, e.currentTarget);
	};

	const handleKeyDown: NonNullable<ComponentProps<"span">["onKeyDown"]> = e => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect(word, e.currentTarget as HTMLElement);
		}
	};

	return (
		<Typography
			tag="span"
			data-demo-token
			data-word={word}
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"inline cursor-pointer rounded-[3px] px-[2px] py-px transition-colors hover:bg-acc/10",
				status === "studied" &&
					!active &&
					"border-b-[1.5px] border-dotted border-grn pb-px",
				status === "unknown" && !active && "bg-amb-bg font-medium text-amb-t",
				active &&
					"bg-acc-bg! text-acc-t! font-semibold outline-[0.5px] outline-acc/25",
			)}
		>
			{children}
		</Typography>
	);
};
