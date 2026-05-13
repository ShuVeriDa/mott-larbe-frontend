"use client";

import { Typography } from "@/shared/ui/typography";

import type { CefrLevel } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { CEFR_LEVEL_BADGE_CLASS } from "@/shared/lib/cefr-colors";

export const TokenizationLevelBadge = ({ level }: { level: CefrLevel | null }) => {
	const { t } = useI18n();

	if (!level) return <Typography tag="span" className="text-t-4">—</Typography>;
	return (
		<Typography tag="span"
			className={cn(
				"inline-flex h-[18px] items-center justify-center rounded-[5px] px-1.5 text-[10px] font-bold tracking-[0.3px]",
				CEFR_LEVEL_BADGE_CLASS[level],
			)}
		>
			{t(`shared.cefrLevel.${level}`)}
		</Typography>
	);
};
