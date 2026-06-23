"use client";

import type { DashboardDueToday } from "@/entities/dashboard";
import { spring, useHoverProps } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";

interface ReviewStatCardProps {
	dueToday: DashboardDueToday;
	lang: string;
}

export const ReviewStatCard = ({ dueToday, lang }: ReviewStatCardProps) => {
	const { t } = useI18n();
	const hoverProps = useHoverProps({ y: -4 }, { scale: 0.97 }, spring.default);

	return (
		<motion.div {...hoverProps}>
			<Link
				href={`/${lang}/review`}
				className="group flex h-full w-full flex-col cursor-pointer rounded-card border border-bd-1 bg-surf p-[13px_14px] outline-none transition-[border-color,box-shadow] duration-250 ease-out hover:border-bd-2 hover:shadow-md focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
			>
				<div className="mb-2.5 flex size-7 items-center justify-center rounded-base bg-pur-bg">
					<Clock className="size-[13px] text-pur-t" aria-hidden="true" />
				</div>
				<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-amb max-sm:text-[22px]">
					{dueToday.total.toLocaleString()}
				</div>
				<div className="flex justify-between">
					<div className="text-[11px] leading-[1.4] text-t-2">
						{t("dashboard.stats.dueToday")}
					</div>
					<div className="flex items-center gap-0.5 text-[11px] font-semibold text-acc">
						{t("dashboard.reviewBanner.start")}
						<span className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-1">
							→
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};
