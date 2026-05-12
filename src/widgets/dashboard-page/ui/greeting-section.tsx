"use client";

import type { DashboardStats } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";
import { GreetingDueBadge } from "./greeting-due-badge";
import { GreetingIntro } from "./greeting-intro";

interface GreetingSectionProps {
	user: UserProfile | undefined;
	stats: DashboardStats;
	lang: string;
}

export const GreetingSection = ({ user, stats, lang }: GreetingSectionProps) => (
	<div className="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-2.5">
		<GreetingIntro user={user} lang={lang} />
		<GreetingDueBadge dueToday={stats.dueToday} />
	</div>
);
