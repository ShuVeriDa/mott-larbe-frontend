"use client";

import type { PhraseDue } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface PhraseFrontProps {
	phrase: PhraseDue;
	cardNumber: number;
}

const LANG_DOT_COLOR: Record<string, string> = {
	che: "#e53935",
	ru: "#3b82f6",
	ar: "#f59e0b",
	en: "#22c55e",
};

export const PhraseFront = ({ phrase, cardNumber }: PhraseFrontProps) => {
	const { t } = useI18n();
	const dotColor = LANG_DOT_COLOR[phrase.lang] ?? LANG_DOT_COLOR.che;

	return (
		<>
			<Typography
				tag="span"
				className="absolute right-3.5 top-3 text-[10.5px] text-t-3"
			>
				#{cardNumber}
			</Typography>
			<div className="flex flex-col items-center gap-1">
				<span
					className="mb-1 h-1.5 w-1.5 rounded-full"
					style={{ backgroundColor: dotColor }}
					aria-label={phrase.lang.toUpperCase()}
				/>
				<Typography
					tag="h2"
					className="mb-0.5 text-center font-display text-[30px] font-normal leading-[1.25] tracking-[-0.3px] text-t-1 max-md:text-[26px]"
				>
					{phrase.original}
				</Typography>
				{phrase.transliteration ? (
					<Typography className="text-center text-[13px] italic text-t-3">
						{phrase.transliteration}
					</Typography>
				) : null}
			</div>
			<Typography className="mt-3.5 flex items-center gap-1 text-[12px] text-t-3">
				<svg viewBox="0 0 13 13" fill="none" className="size-3">
					<circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" />
					<path d="M6.5 5v1.5l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
				</svg>
				{t("review.sm2.card.flipHint")}
			</Typography>
		</>
	);
};
