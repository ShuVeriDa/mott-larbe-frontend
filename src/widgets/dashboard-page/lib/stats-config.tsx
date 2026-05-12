import type { DashboardStats } from "@/entities/dashboard";
import type { ReactNode } from "react";

export interface StatItemConfig {
	key: keyof DashboardStats | "dueToday";
	value: number;
	labelKey: string;
	iconBgClass: string;
	icon: ReactNode;
}

export const getStatsConfig = (stats: DashboardStats): StatItemConfig[] => [
	{
		key: "textsRead",
		value: stats.textsRead,
		labelKey: "dashboard.stats.textsRead",
		iconBgClass: "bg-acc-bg",
		icon: (
			<svg
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
				className="size-[13px] text-acc-t"
				aria-hidden="true"
			>
				<path d="M1 2.5h5v9H1z" />
				<path d="M8 2.5h5v9H8z" />
			</svg>
		),
	},
	{
		key: "wordsInDictionary",
		value: stats.wordsInDictionary,
		labelKey: "dashboard.stats.words",
		iconBgClass: "bg-grn-bg",
		icon: (
			<svg
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
				className="size-[13px] text-grn-t"
				aria-hidden="true"
			>
				<path d="M2 4h10M2 7h7M2 10h5" strokeLinecap="round" />
			</svg>
		),
	},
	{
		key: "streak",
		value: stats.streak,
		labelKey: "dashboard.stats.streak",
		iconBgClass: "bg-amb-bg",
		icon: (
			<svg
				viewBox="0 0 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
				className="size-[13px] text-amb-t"
				aria-hidden="true"
			>
				<polygon points="7,1.5 8.5,5 12,5.3 9.5,7.7 10.2,11.5 7,9.7 3.8,11.5 4.5,7.7 2,5.3 5.5,5" />
			</svg>
		),
	},
	{
		key: "dueToday",
		value: stats.dueToday.total,
		labelKey: "dashboard.stats.dueToday",
		iconBgClass: "bg-pur-bg",
		icon: (
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
		),
	},
];
