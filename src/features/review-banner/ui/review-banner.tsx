"use client";

import { useDueWords } from "@/entities/dictionary";
import { useSettings } from "@/entities/settings";
import { formatReviewIn } from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

export interface ReviewBannerProps {
	lang: string;
}

export const ReviewBanner = ({ lang }: ReviewBannerProps) => {
	const { t } = useI18n();
	const { data, isLoading } = useDueWords();
	const { data: settings } = useSettings();

	const showReminder = settings?.preferences.showReviewReminder ?? true;

	if (isLoading || !data || data.count === 0 || !showReminder) return null;

	const subtitle = data.nextScheduledAt
		? t("vocabulary.review.nextIn", {
				time: formatReviewIn(data.nextScheduledAt, t),
			})
		: t("vocabulary.review.noNext");

	return (
		<section
			aria-label={t("vocabulary.review.title")}
			className="relative mx-[18px] mt-[14px] mb-[14px] flex shrink-0 items-center gap-[14px] overflow-hidden rounded-card border-[0.5px] border-bd-1 bg-surf p-3 max-md:mx-[14px] max-md:mt-3"
		>
			<Typography
				tag="span"
				aria-hidden="true"
				className="absolute inset-y-0 left-0 w-[3px] rounded-r-[2px] bg-amb"
			/>
			<Typography
				tag="span"
				className="shrink-0 font-display text-[26px] leading-none text-amb"
			>
				{data.count}
			</Typography>
			<div className="flex-1 min-w-0">
				<Typography tag="h2" className="text-[12.5px] font-semibold text-t-1">
					{t("vocabulary.review.title")}
				</Typography>
				<Typography className="text-[11.5px] text-t-2 truncate">
					{subtitle}
				</Typography>
			</div>
			<Link
				href={`/${lang}/review`}
				className="inline-flex h-7 shrink-0 items-center rounded-base bg-amb px-3.5 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-[0.88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amb focus-visible:ring-offset-2"
			>
				{t("vocabulary.review.button")}
			</Link>
		</section>
	);
};
