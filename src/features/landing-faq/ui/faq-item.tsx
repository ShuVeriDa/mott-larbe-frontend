"use client";

import { Button } from "@/shared/ui/button";

import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

interface FaqItemProps {
	question: string;
	answer: string;
	open: boolean;
	onToggle: () => void;
	id: string;
}

export const FaqItem = ({
	question,
	answer,
	open,
	onToggle,
	id,
}: FaqItemProps) => (
	<div
		className={cn(
			"mb-2.5 overflow-hidden rounded-[11px] border-hairline bg-surf transition-colors",
			open ? "border-bd-3" : "border-bd-2",
		)}
	>
		<Button
			variant="bare"
			size={null}
			onClick={onToggle}
			aria-expanded={open}
			aria-controls={`${id}-content`}
			id={`${id}-trigger`}
			className="flex w-full items-center justify-between border-0 bg-transparent px-5 py-[18px] text-left font-[inherit] text-[15px] font-medium text-t-1 transition-colors"
		>
			<Typography tag="span">{question}</Typography>
			<Typography
				tag="span"
				className={cn(
					"flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-[transform,background-color] duration-300",
					open ? "rotate-180 bg-acc-bg text-acc-t" : "bg-surf-2 text-t-2",
				)}
				aria-hidden="true"
			>
				<ChevronDown size={12} strokeWidth={2} />
			</Typography>
		</Button>
		<div
			id={`${id}-content`}
			role="region"
			aria-labelledby={`${id}-trigger`}
			className={cn(
				"grid overflow-hidden text-[14px] leading-[1.6] text-t-2 transition-[grid-template-rows,padding] duration-300 ease-in-out",
				open
					? "grid-rows-[1fr] px-5 pb-5"
					: "grid-rows-[0fr] px-5",
			)}
		>
			<div className="min-h-0 overflow-hidden">{answer}</div>
		</div>
	</div>
);
