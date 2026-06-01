"use client";

import type { DashboardDueToday } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";

interface ReviewStatCardProps {
	dueToday: DashboardDueToday;
	lang: string;
}

export const ReviewStatCard = ({ dueToday, lang }: ReviewStatCardProps) => {
	const { t } = useI18n();

	return (
		<Link
			href={`/${lang}/review`}
			className="group relative flex w-full flex-col cursor-pointer rounded-card border border-bd-1 bg-surf p-[13px_14px] outline-none transition-[border-color,box-shadow] duration-150 hover:border-bd-2 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
		>
			<div className="mb-2.5 flex size-7 items-center justify-center rounded-base bg-pur-bg">
				<svg
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.4"
					className="size-[13px] text-pur-t"
					aria-hidden="true"
				>
					<circle cx="7" cy="7" r="5" />
					<path d="M7 4.5v3l1.5 1.5" strokeLinecap="round" />
				</svg>
			</div>
			<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-amb max-sm:text-[22px]">
				{dueToday.total.toLocaleString()}
			</div>
			<div className="flex justify-between">
				<div className="text-[11px] leading-[1.4] text-t-2">
					{t("dashboard.stats.dueToday")}
				</div>
				<div className="text-[11px] font-semibold text-acc group-hover:underline">
					{t("dashboard.reviewBanner.start")} →
				</div>
			</div>
		</Link>
	);
};
