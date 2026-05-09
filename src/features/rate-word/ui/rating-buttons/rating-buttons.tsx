"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { ReviewQuality } from "@/entities/review";

type RatingKey = "again" | "hard" | "good" | "easy";

interface RatingOption {
	key: RatingKey;
	quality: ReviewQuality;
	icon: string;
	hoverClass: string;
}

const RATINGS: RatingOption[] = [
	{
		key: "again",
		quality: 0,
		icon: "😶",
		hoverClass: "hover:border-red/40 hover:bg-red-bg/60 hover:text-red-t",
	},
	{
		key: "hard",
		quality: 2,
		icon: "😕",
		hoverClass: "hover:border-amb/40 hover:bg-amb-bg hover:text-amb-t",
	},
	{
		key: "good",
		quality: 4,
		icon: "🙂",
		hoverClass: "hover:border-acc/40 hover:bg-acc-bg hover:text-acc-t",
	},
	{
		key: "easy",
		quality: 5,
		icon: "😄",
		hoverClass: "hover:border-grn/40 hover:bg-grn-bg hover:text-grn-t",
	},
];

export interface RatingButtonsProps {
	visible: boolean;
	disabled?: boolean;
	onRate: (quality: ReviewQuality) => void;
}

export const RatingButtons = ({
	visible,
	disabled,
	onRate,
}: RatingButtonsProps) => {
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
				{t("review.sm2.card.ratingLabel")}
			</Typography>

			<div className="grid grid-cols-4 gap-1.5 max-md:grid-cols-2 max-md:gap-2">
				{RATINGS.map((rating) => {
				  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onRate(rating.quality);
				  return (
					<button
						key={rating.key}
						type="button"
						disabled={disabled || !visible}
						onClick={handleClick}
						className={cn(
							"flex flex-col items-center gap-1 rounded-card border-hairline border-bd-2 bg-surf py-2.5 px-1.5",
							"shadow-sm transition-[background-color,border-color,color,transform,box-shadow] duration-150",
							"cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:opacity-80",
							"disabled:cursor-default disabled:opacity-40",
							rating.hoverClass,
						)}
					>
						<span className="text-[17px] leading-none">{rating.icon}</span>
						<span className="text-[11.5px] font-semibold text-t-1">
							{t(`review.sm2.card.rate.${rating.key}.label`)}
						</span>
						<span className="text-[10px] text-t-3 max-md:hidden">
							{t(`review.sm2.card.rate.${rating.key}.sub`)}
						</span>
					</button>
				);
				})}
			</div>

			<div className="mt-2 flex items-center justify-center gap-3.5 max-md:hidden">
				{RATINGS.map((rating, idx) => (
					<div
						key={rating.key}
						className="flex items-center gap-1 text-[11px] text-t-3"
					>
						<kbd className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[3px] border-hairline border-bd-3 bg-surf-2 px-1 text-[10px] font-semibold text-t-2">
							{idx + 1}
						</kbd>
						{t(`review.sm2.card.kbd.${rating.key}`)}
					</div>
				))}
			</div>
		</div>
	);
};
