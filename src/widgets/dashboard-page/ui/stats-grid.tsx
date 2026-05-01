"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { DashboardStats } from "@/entities/dashboard";

interface StatsGridProps {
	stats: DashboardStats;
}

interface StatCardProps {
	value: number;
	label: string;
	iconBgClass: string;
	icon: ReactNode;
}

const StatCard = ({ value, label, iconBgClass, icon }: StatCardProps) => (
	<div className="cursor-default rounded-card border-hairline border border-bd-1 bg-surf p-[13px_14px] transition-all hover:border-bd-2 hover:shadow-sm">
		<div className={`mb-2.5 flex size-7 items-center justify-center rounded-base ${iconBgClass}`}>
			{icon}
		</div>
		<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-t-1 max-sm:text-[22px]">
			{value.toLocaleString()}
		</div>
		<div className="text-[11px] leading-[1.4] text-t-3">{label}</div>
	</div>
);

export const StatsGrid = ({ stats }: StatsGridProps) => {
	const { t } = useI18n();

	return (
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2 max-sm:gap-[7px]">
			<StatCard
				value={stats.textsRead}
				label={t("dashboard.stats.textsRead")}
				iconBgClass="bg-acc-bg"
				icon={
					<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] text-acc-t" aria-hidden="true">
						<path d="M1 2.5h5v9H1z" /><path d="M8 2.5h5v9H8z" />
					</svg>
				}
			/>
			<StatCard
				value={stats.wordsInDictionary}
				label={t("dashboard.stats.words")}
				iconBgClass="bg-grn-bg"
				icon={
					<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] text-grn-t" aria-hidden="true">
						<path d="M2 4h10M2 7h7M2 10h5" strokeLinecap="round" />
					</svg>
				}
			/>
			<StatCard
				value={stats.streak}
				label={t("dashboard.stats.streak")}
				iconBgClass="bg-amb-bg"
				icon={
					<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] text-amb-t" aria-hidden="true">
						<polygon points="7,1.5 8.5,5 12,5.3 9.5,7.7 10.2,11.5 7,9.7 3.8,11.5 4.5,7.7 2,5.3 5.5,5" />
					</svg>
				}
			/>
			<StatCard
				value={stats.dueToday.total}
				label={t("dashboard.stats.dueToday")}
				iconBgClass="bg-pur-bg"
				icon={
					<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] text-pur-t" aria-hidden="true">
						<circle cx="7" cy="7" r="5" />
						<path d="M7 4.5v3l1.5 1.5" strokeLinecap="round" />
					</svg>
				}
			/>
		</div>
	);
};
