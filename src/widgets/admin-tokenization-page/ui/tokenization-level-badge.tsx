"use client";

import { Typography } from "@/shared/ui/typography";

import type { CefrLevel } from "@/entities/token";
import { cn } from "@/shared/lib/cn";
import { CEFR_LEVEL_BADGE_CLASS } from "@/shared/lib/cefr-colors";

export const TokenizationLevelBadge = ({ level }: { level: CefrLevel | null }) => {
	if (!level) return <Typography tag="span" className="text-t-4">—</Typography>;
	return (
		<Typography tag="span"
			className={cn(
				"inline-flex h-[18px] w-[30px] items-center justify-center rounded-[5px] text-[10px] font-bold tracking-[0.3px]",
				CEFR_LEVEL_BADGE_CLASS[level],
			)}
		>
			{level}
		</Typography>
	);
};
