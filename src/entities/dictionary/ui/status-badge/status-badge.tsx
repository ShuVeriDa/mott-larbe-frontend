"use client";

import { Badge } from "@/shared/ui/badge";
import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";

const VARIANT: Record<LearningLevel, "neu" | "amb" | "grn"> = {
	NEW: "neu",
	LEARNING: "amb",
	KNOWN: "grn",
};

const LABEL_KEY: Record<LearningLevel, string> = {
	NEW: "vocabulary.statusCard.new",
	LEARNING: "vocabulary.statusCard.learning",
	KNOWN: "vocabulary.statusCard.known",
};

export interface StatusBadgeProps {
	status: LearningLevel;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
	const { t } = useI18n();
	return <Badge variant={VARIANT[status]}>{t(LABEL_KEY[status])}</Badge>;
};
