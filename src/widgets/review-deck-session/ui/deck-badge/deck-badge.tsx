"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { DeckType } from "@/entities/deck";

export interface DeckBadgeProps {
	type: DeckType;
	deckNumber?: number | null;
}

const styles: Record<DeckType, string> = {
	NEW: "bg-acc-bg text-acc-t",
	OLD: "bg-amb-bg text-amb-t",
	RETIRED: "bg-pur-bg text-pur-t",
	NUMBERED: "bg-grn-bg text-grn-t",
};

export const DeckBadge = ({ type, deckNumber }: DeckBadgeProps) => {
	const { t } = useI18n();
	const label = t(`review.deck.card.badge.${type}`, {
		n: deckNumber ?? 1,
	});

	return (
		<span
			className={`inline-flex h-[18px] items-center gap-1 rounded-[4px] px-1.5 text-[10px] font-bold tracking-[0.3px] ${styles[type]}`}
		>
			{label}
		</span>
	);
};
