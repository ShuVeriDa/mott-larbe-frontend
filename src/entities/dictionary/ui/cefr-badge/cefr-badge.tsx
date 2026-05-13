"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Badge } from "@/shared/ui/badge";
import type { CefrLevel } from "@/shared/types";

const VARIANT: Record<CefrLevel, "acc" | "grn" | "amb"> = {
	A: "grn",
	B: "acc",
	C: "amb",
};

export interface CefrBadgeProps {
	level: CefrLevel;
}

export const CefrBadge = ({ level }: CefrBadgeProps) => {
	const { t } = useI18n();

	return (
		<Badge variant={VARIANT[level]}>{t(`shared.cefrLevel.${level}`)}</Badge>
	);
};
