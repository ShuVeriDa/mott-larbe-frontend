"use client";

import { Typography } from "@/shared/ui/typography";
import { type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";

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
	const handle = (e: MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		onSelect(word, e.currentTarget);
	};

		const handleKeyDown: NonNullable<ComponentProps<"span">["onKeyDown"]> = (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(word, e.currentTarget as HTMLElement);
				}
			};
return (
		<Typography tag="span"
			data-demo-token
			data-word={word}
			role="button"
			tabIndex={0}
			onClick={handle}
			onKeyDown={handleKeyDown}
			className={cn(
				"inline cursor-pointer rounded-[3px] px-[2px] py-[1px] transition-colors hover:bg-acc/10",
				status === "studied" &&
					!active &&
					"border-b-[1.5px] border-dotted border-grn pb-[1px]",
				status === "unknown" &&
					!active &&
					"bg-amb-bg font-medium text-amb-t",
				active &&
					"!bg-acc-bg !text-acc-t font-semibold outline outline-[0.5px] outline-acc/25",
			)}
		>
			{children}
		</Typography>
	);
};
