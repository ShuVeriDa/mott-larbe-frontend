"use client";

import { cn } from "@/shared/lib/cn";

interface CountBadgeProps {
	count: number;
}

export const CountBadge = ({ count }: CountBadgeProps) => (
	<span
		className={cn(
			"inline-flex min-w-[24px] items-center justify-center rounded-[5px] px-1.5 py-px text-[11px] font-semibold",
			count >= 10
				? "bg-red-bg text-red-t"
				: count >= 3
					? "bg-amb-bg text-amb-t"
					: "bg-surf-2 text-t-3",
		)}
	>
		{count}
	</span>
);
