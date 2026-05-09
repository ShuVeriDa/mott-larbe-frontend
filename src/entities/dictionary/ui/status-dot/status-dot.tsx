import { cn } from "@/shared/lib/cn";
import type { LearningLevel } from "@/shared/types";

import { Typography } from "@/shared/ui/typography";
const COLOR: Record<LearningLevel, string> = {
	NEW: "bg-surf-4",
	LEARNING: "bg-amb",
	KNOWN: "bg-grn",
};

export interface StatusDotProps {
	status: LearningLevel;
	className?: string;
}

export const StatusDot = ({ status, className }: StatusDotProps) => (
	<Typography tag="span"
		aria-hidden="true"
		className={cn(
			"inline-block size-[7px] shrink-0 rounded-full",
			COLOR[status],
			className,
		)}
	/>
);
