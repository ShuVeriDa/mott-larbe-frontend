"use client";

import type { PhraseDue } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";

interface PhraseBackProps {
	phrase: PhraseDue;
}

export const PhraseBack = ({ phrase }: PhraseBackProps) => {
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col items-center">
			<div className="mb-3 flex w-full flex-col items-center border-b border-bd-1 pb-3">
				<Typography tag="h2" className="mb-0.5 font-display text-[21px] font-normal text-t-1">
					{phrase.original}
				</Typography>
				{phrase.transliteration ? (
					<Typography className="mb-1 text-center text-[13px] italic text-t-3">
						{phrase.transliteration}
					</Typography>
				) : null}
				<Typography className="text-center text-[17px] font-medium text-acc">
					{phrase.translation}
				</Typography>
			</div>

			{phrase.words.length > 0 ? (
				<div className="w-full">
					<SectionLabel className="mb-1.5">
						{t("phrasebook.review.card.wordBreakdown")}
					</SectionLabel>
					<div className="flex flex-wrap gap-1">
						{phrase.words.map((w) => (
							<div
								key={w.id}
								className="rounded-[4px] border-[0.5px] border-bd-2 bg-surf-2 px-2 py-1"
							>
								<Typography tag="span" className="block text-[12px] font-medium text-t-1">
									{w.original}
								</Typography>
								<Typography tag="span" className="block text-[11px] text-t-3">
									{w.translation}
								</Typography>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};
