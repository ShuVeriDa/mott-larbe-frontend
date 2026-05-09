import { cn } from "@/shared/lib/cn";

import { Typography } from "@/shared/ui/typography";
const getDurClass = (ms: number | null) => {
	if (ms === null) return "text-t-3";
	if (ms <= 100) return "text-grn-t";
	if (ms <= 500) return "text-t-2";
	if (ms <= 2000) return "text-amb-t";
	return "text-red-t";
};

const formatDur = (ms: number | null) => {
	if (ms === null) return "—";
	if (ms < 1000) return `${ms} ms`;
	return `${(ms / 1000).toFixed(1)} s`;
};

interface DurationBadgeProps {
	durationMs: number | null;
}

export const DurationBadge = ({ durationMs }: DurationBadgeProps) => (
	<Typography tag="span" className={cn("tabular-nums text-[11.5px] whitespace-nowrap", getDurClass(durationMs))}>
		{formatDur(durationMs)}
	</Typography>
);
