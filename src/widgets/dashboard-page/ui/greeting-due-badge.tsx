"use client";

import type { DashboardDueToday } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { Clock } from "lucide-react";

interface GreetingDueBadgeProps {
	dueToday: DashboardDueToday;
}

export const GreetingDueBadge = ({ dueToday }: GreetingDueBadgeProps) => {
	const { t } = useI18n();

	if (dueToday.total === 0) return null;

	return (
		<div className="flex shrink-0 items-center gap-[5px] rounded-base border-hairline border border-bd-2 bg-surf px-[11px] py-[5px] text-[12px] text-t-2 shadow-sm max-sm:self-start">
			<Clock className="size-3 text-t-3" aria-hidden="true" />
			{t("dashboard.greeting.dueToday", { count: dueToday.total })}
		</div>
	);
};
