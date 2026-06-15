import { AdminStatCard } from "@/shared/ui/admin-stat-card";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export interface KpiCardProps {
	label: string;
	value: string;
	sub: ReactNode;
	hidden?: boolean;
}

export const KpiCard = ({ label, value, sub, hidden }: KpiCardProps) => (
	<AdminStatCard
		label={label}
		value={value}
		sub={sub}
		className={cn(hidden && "max-md:hidden")}
	/>
);
