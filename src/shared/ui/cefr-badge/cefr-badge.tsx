"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";

const CEFR_VARIANT: Record<CefrLevel, "grn" | "amb" | "red"> = {
	A: "grn",
	B: "amb",
	C: "red",
};

interface CefrBadgeProps {
	level: CefrLevel | null;
	className?: string;
}

export const CefrBadge = ({ level, className }: CefrBadgeProps) => {
	const { t } = useI18n();

	if (!level)
		return (
			<Typography tag="span" className="text-[11px] text-t-4">
				—
			</Typography>
		);

	return (
		<Badge variant={CEFR_VARIANT[level]} className={className}>
			{t(`shared.cefrLevel.${level}`)}
		</Badge>
	);
};
