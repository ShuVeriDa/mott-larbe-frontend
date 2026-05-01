"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export interface FlashcardFrontProps {
	word: string;
	pos: string | null;
	cardNumber: number;
	badge?: ReactNode;
	modeLabel?: string;
}

export const FlashcardFront = ({
	word,
	pos,
	cardNumber,
	badge,
	modeLabel,
}: FlashcardFrontProps) => {
	const { t } = useI18n();

	return (
		<>
			{badge ? <div className="absolute left-3.5 top-3">{badge}</div> : null}
			{modeLabel ? (
				<span className="absolute left-3.5 top-3 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
					{modeLabel}
				</span>
			) : null}
			<span className="absolute right-3.5 top-3 text-[10.5px] text-t-3">
				#{cardNumber}
			</span>

			<Typography
				tag="h2"
				className="mb-1 text-center font-display text-[34px] font-normal leading-[1.2] tracking-[-0.3px] text-t-1 max-md:text-[30px] max-[375px]:text-[26px]"
			>
				{word}
			</Typography>
			{pos ? (
				<Typography className="text-center text-[11.5px] text-t-3">
					{pos}
				</Typography>
			) : null}

			<Typography className="mt-3.5 flex items-center gap-1 text-[12px] text-t-3 opacity-60">
				<svg viewBox="0 0 13 13" fill="none" className="size-3">
					<circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" />
					<path
						d="M6.5 5v1.5l1 1"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
					/>
				</svg>
				{t("review.sm2.card.flipHint")}
			</Typography>
		</>
	);
};
