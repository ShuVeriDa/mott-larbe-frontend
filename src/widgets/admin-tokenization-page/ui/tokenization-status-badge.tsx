"use client";

import type { ProcessingStatus } from "@/entities/token";
import { cn } from "@/shared/lib/cn";

const STATUS_STYLES: Record<ProcessingStatus, string> = {
	IDLE: "bg-surf-3 text-t-2",
	RUNNING: "bg-amb-bg text-amb-t",
	COMPLETED: "bg-grn-bg text-grn-t",
	ERROR: "bg-red-bg text-red-t",
};

interface TokenizationStatusBadgeProps {
	status: ProcessingStatus;
	label: string;
	progress?: number;
}

export const TokenizationStatusBadge = ({
	status,
	label,
	progress,
}: TokenizationStatusBadgeProps) => (
	<span
		className={cn(
			"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
			STATUS_STYLES[status],
		)}
	>
		{status === "RUNNING" && (
			<span className="relative flex size-[7px] shrink-0">
				<span className="absolute inline-flex size-full animate-ping rounded-full bg-amb opacity-50" />
				<span className="relative inline-flex size-[7px] rounded-full bg-amb" />
			</span>
		)}
		{label}
		{status === "RUNNING" && progress !== undefined && (
			<span className="ml-0.5 opacity-70">{progress}%</span>
		)}
	</span>
);
