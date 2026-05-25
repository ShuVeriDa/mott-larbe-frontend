"use client";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { ReviewQuality } from "@/entities/review";

export interface ChoiceCardSm2Props {
	word: string;
	pos: string | null;
	cardNumber: number;
	options: string[];
	correctIndex: number;
	onRate: (quality: ReviewQuality) => void;
}

type Selection = { index: number; correct: boolean } | null;

export const ChoiceCardSm2 = ({
	word,
	pos,
	cardNumber,
	options,
	correctIndex,
	onRate,
}: ChoiceCardSm2Props) => {
	const { t } = useI18n();
	const [selection, setSelection] = useState<Selection>(null);

	const handleSelect = (idx: number) => {
		if (selection !== null) return;
		const correct = idx === correctIndex;
		setSelection({ index: idx, correct });
		// auto-advance after short delay so user sees feedback
		setTimeout(() => {
			onRate(correct ? 4 : 0);
		}, 700);
	};

	return (
		<div className="w-full max-w-[520px] mb-3.5">
			<div className="relative w-full min-h-[205px] flex flex-col items-center justify-center rounded-hero border-hairline border-bd-2 bg-surf p-7 shadow-md max-md:p-5 max-md:min-h-[185px]">
				<Typography tag="span" className="absolute right-3.5 top-3 text-[10.5px] text-t-3">
					#{cardNumber}
				</Typography>
				<Typography tag="span" className="absolute left-3.5 top-3 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
					{t("review.mode.choice.label")}
				</Typography>

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

				<Typography className="mt-3 text-[12px] text-t-3">
					{t("review.mode.choice.prompt")}
				</Typography>
			</div>

			<div className="mt-2 grid grid-cols-2 gap-2">
				{options.map((opt, idx) => {
					const isSelected = selection?.index === idx;
					const isCorrect = idx === correctIndex;
					const revealed = selection !== null;

					return (
						<button
							key={idx}
							type="button"
							onClick={() => handleSelect(idx)}
							disabled={selection !== null}
							className={cn(
								"rounded-card border px-3.5 py-3 text-left text-[13px] font-medium transition-colors",
								!revealed && "border-bd-3 bg-surf-2 text-t-1 hover:border-bd-4 hover:bg-surf-3",
								revealed && isCorrect && "border-grn/50 bg-grn-bg text-grn-t",
								revealed && isSelected && !isCorrect && "border-red/50 bg-red-bg text-red-t",
								revealed && !isSelected && !isCorrect && "border-bd-2 bg-surf-2 text-t-3 opacity-40",
							)}
						>
							{opt}
						</button>
					);
				})}
			</div>
		</div>
	);
};
