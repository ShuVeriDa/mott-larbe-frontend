"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { formatReviewIn } from "@/shared/lib/format-relative-time";
import { useDueWords } from "@/entities/dictionary";

export interface ReviewBannerProps {
	lang: string;
}

export const ReviewBanner = ({ lang }: ReviewBannerProps) => {
	const { t } = useI18n();
	const { data, isLoading } = useDueWords();

	if (isLoading || !data || data.count === 0) return null;

	const subtitle = data.nextScheduledAt
		? t("vocabulary.review.nextIn", {
				time: formatReviewIn(data.nextScheduledAt, t),
			})
		: t("vocabulary.review.noNext");

	return (
		<section
			aria-label={t("vocabulary.review.title")}
			className="relative mx-[18px] mt-[14px] flex shrink-0 items-center gap-[14px] overflow-hidden rounded-card border-hairline border-bd-1 bg-surf p-3 max-md:mx-[14px] max-md:mt-3"
		>
			<span
				aria-hidden="true"
				className="absolute inset-y-0 left-0 w-[3px] rounded-r-[2px] bg-amb"
			/>
			<span className="shrink-0 font-display text-[26px] leading-none text-amb">
				{data.count}
			</span>
			<div className="flex-1 min-w-0">
				<h2 className="text-[12.5px] font-semibold text-t-1">
					{t("vocabulary.review.title")}
				</h2>
				<p className="text-[11.5px] text-t-2 truncate">{subtitle}</p>
			</div>
			<Link
				href={`/${lang}/review`}
				className="inline-flex h-7 shrink-0 items-center rounded-base bg-amb px-3.5 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
			>
				{t("vocabulary.review.button")}
			</Link>
		</section>
	);
};
