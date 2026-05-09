"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { DeckRateResult } from "@/entities/deck";

interface DeckRatingOption {
	key: DeckRateResult;
	icon: string;
	hoverClass: string;
}

const OPTIONS: DeckRatingOption[] = [
	{
		key: "again",
		icon: "🔁",
		hoverClass: "hover:border-amb/40 hover:bg-amb-bg",
	},
	{
		key: "know",
		icon: "✓",
		hoverClass: "hover:border-grn/40 hover:bg-grn-bg",
	},
];

export interface DeckRatingButtonsProps {
	visible: boolean;
	disabled?: boolean;
	onRate: (result: DeckRateResult) => void;
}

export const DeckRatingButtons = ({
	visible,
	disabled,
	onRate,
}: DeckRatingButtonsProps) => {
	const { t } = useI18n();

	return (
		<div
			className={cn(
				"w-full max-w-[520px] transition-[opacity,transform] duration-300",
				visible
					? "opacity-100 translate-y-0 pointer-events-auto"
					: "opacity-0 translate-y-2 pointer-events-none",
			)}
			aria-hidden={!visible}
		>
			<Typography className="mb-2 text-center text-[11.5px] text-t-3">
				{t("review.deck.card.ratingLabel")}
			</Typography>

			<div className="grid grid-cols-2 gap-2">
				{OPTIONS.map((option) => {
				  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onRate(option.key);
				  return (
					<button
						key={option.key}
						type="button"
						disabled={disabled || !visible}
						onClick={handleClick}
						className={cn(
							"flex flex-col items-center gap-1 rounded-card border-hairline border-bd-2 bg-surf py-3.5 px-2.5",
							"shadow-sm transition-[background-color,border-color,transform,box-shadow] duration-150",
							"cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:opacity-80",
							"disabled:cursor-default disabled:opacity-40",
							option.hoverClass,
						)}
					>
						<span className="text-[20px] leading-none">{option.icon}</span>
						<span className="text-[12.5px] font-semibold text-t-1">
							{t(`review.deck.card.rate.${option.key}.label`)}
						</span>
						<span className="text-[11px] text-t-3 max-md:hidden">
							{t(`review.deck.card.rate.${option.key}.sub`)}
						</span>
					</button>
				);
				})}
			</div>

			<div className="mt-2 flex items-center justify-center gap-3.5 max-md:hidden">
				<div className="flex items-center gap-1 text-[11px] text-t-3">
					<kbd className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[3px] border-hairline border-bd-3 bg-surf-2 px-1 text-[10px] font-semibold text-t-2">
						←
					</kbd>
					{t("review.deck.card.kbd.again")}
				</div>
				<div className="flex items-center gap-1 text-[11px] text-t-3">
					<kbd className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[3px] border-hairline border-bd-3 bg-surf-2 px-1 text-[10px] font-semibold text-t-2">
						→
					</kbd>
					{t("review.deck.card.kbd.know")}
				</div>
				<div className="flex items-center gap-1 text-[11px] text-t-3">
					<kbd className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[3px] border-hairline border-bd-3 bg-surf-2 px-1 text-[10px] font-semibold text-t-2">
						Space
					</kbd>
					{t("review.deck.card.kbd.flip")}
				</div>
			</div>
		</div>
	);
};
