import { BookOpen, Flame } from "lucide-react";
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
		icon: <BookOpen className="size-[13px] text-acc-t" aria-hidden="true" />,
	},
{
		key: "streak",
		value: stats.streak,
		labelKey: "dashboard.stats.streak",
		iconBgClass: "bg-amb-bg",
		icon: <Flame className="size-[13px] text-amb-t" aria-hidden="true" />,
	},
];
