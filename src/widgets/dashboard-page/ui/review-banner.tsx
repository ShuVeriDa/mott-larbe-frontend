"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import type { DashboardDueToday } from "@/entities/dashboard";

interface ReviewBannerProps {
	dueToday: DashboardDueToday;
	lang: string;
}

export const ReviewBanner = ({ dueToday, lang }: ReviewBannerProps) => {
	const { t } = useI18n();

	if (dueToday.total === 0) return null;

	return (
		<div className="relative flex items-center gap-4 overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf p-[14px_16px] max-sm:gap-3 max-sm:p-[13px_14px]">
			<Typography tag="span"
				aria-hidden="true"
				className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[2px] bg-amb"
			/>

			<div className="min-w-[34px] font-display text-[30px] font-normal leading-none text-amb max-sm:text-[26px]">
				{dueToday.total}
			</div>

			<div className="flex-1 min-w-0">
				<div className="mb-0.5 text-[13px] font-semibold text-t-1 max-sm:text-[12.5px]">
					{t("dashboard.reviewBanner.title")}
				</div>
				<div className="mb-1.5 text-[12px] text-t-2 max-sm:text-[11.5px]">
					{t("dashboard.reviewBanner.subtitle")}
				</div>
				<div className="flex flex-wrap gap-[5px]">
					{dueToday.new > 0 ? (
						<Typography tag="span" className="rounded-[5px] bg-acc-bg px-2 py-[2.5px] text-[11px] font-medium text-acc-t">
							{t("dashboard.reviewBanner.newWords", { count: dueToday.new })}
						</Typography>
					) : null}
					{dueToday.learning > 0 ? (
						<Typography tag="span" className="rounded-[5px] bg-amb-bg px-2 py-[2.5px] text-[11px] font-medium text-amb-t">
							{t("dashboard.reviewBanner.learning", { count: dueToday.learning })}
						</Typography>
					) : null}
				</div>
			</div>

			<Link
				href={`/${lang}/review`}
				className="shrink-0 h-[30px] rounded-base bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[0.88] flex items-center shadow-sm max-sm:px-3 max-sm:text-[12px]"
			>
				{t("dashboard.reviewBanner.start")}
			</Link>
		</div>
	);
};
