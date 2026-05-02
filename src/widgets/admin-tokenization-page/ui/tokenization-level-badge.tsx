"use client";

import type { CefrLevel } from "@/entities/token";
import { cn } from "@/shared/lib/cn";

const LEVEL_STYLES: Record<CefrLevel, string> = {
	A1: "bg-grn-bg text-grn-t",
	A2: "bg-grn-bg text-grn-t",
	B1: "bg-acc-bg text-acc-t",
	B2: "bg-pur-bg text-pur-t",
	C1: "bg-amb-bg text-amb-t",
	C2: "bg-red-bg text-red-t",
};

export const TokenizationLevelBadge = ({ level }: { level: CefrLevel | null }) => {
	if (!level) return <span className="text-t-4">—</span>;
	return (
		<span
			className={cn(
				"inline-flex h-[18px] w-[30px] items-center justify-center rounded-[5px] text-[10px] font-bold tracking-[0.3px]",
				LEVEL_STYLES[level],
			)}
		>
			{level}
		</span>
	);
};
