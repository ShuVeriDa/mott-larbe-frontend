"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type {
	ReviewLatestContext,
	ReviewMorphForm,
} from "@/entities/review";

export interface FlashcardBackProps {
	word: string;
	translation: string;
	pos: string | null;
	context: ReviewLatestContext | null;
	morphForms: ReviewMorphForm[];
	contextLabel?: string;
}

export const FlashcardBack = ({
	word,
	translation,
	pos,
	context,
	morphForms,
	contextLabel,
}: FlashcardBackProps) => {
	const { t } = useI18n();
	const label = contextLabel ?? t("review.sm2.card.contextLabel");

	return (
		<div className="flex w-full flex-col items-center">
			<div className="flex w-full flex-col items-center border-b border-bd-1 pb-3 mb-3">
				<Typography
					tag="h2"
					className="font-display text-[21px] font-normal text-t-1 mb-0.5"
				>
					{word}
				</Typography>
				<Typography className="text-[17px] font-medium text-acc mb-1 text-center">
					{translation}
				</Typography>
				{pos ? (
					<Typography className="text-[11.5px] text-t-3">{pos}</Typography>
				) : null}
			</div>

			{context ? (
				<div className="w-full rounded-base border-hairline border-bd-1 bg-surf-2 px-3 py-2 mb-2">
					<Typography className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{label}
					</Typography>
					<Typography className="text-[13px] italic leading-[1.55] text-t-1 mb-0.5">
						«{context.snippet}»
					</Typography>
				</div>
			) : null}

			{morphForms.length > 0 ? (
				<div className="flex w-full flex-wrap gap-1 mb-1">
					{morphForms.slice(0, 8).map((form) => (
						<Typography tag="span"
							key={`${form.form}-${form.grammarTag ?? ""}`}
							className="rounded-[4px] border-hairline border-bd-2 bg-surf-3 px-1.5 py-0.5 text-[11px] text-t-2"
							title={form.grammarTag ?? undefined}
						>
							{form.form}
						</Typography>
					))}
				</div>
			) : null}

			{context?.sourceTitle ? (
				<Typography className="mt-1 text-center text-[11px] text-t-3 w-full">
					{t("review.sm2.card.fromSource", { title: context.sourceTitle })}
				</Typography>
			) : null}
		</div>
	);
};
