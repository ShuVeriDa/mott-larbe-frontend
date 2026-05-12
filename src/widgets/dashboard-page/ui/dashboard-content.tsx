"use client";

import type { DashboardResponse } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";
import { ContinueReading } from "./continue-reading";
import { GreetingSection } from "./greeting-section";
import { LibraryPreview } from "./library-preview";
import { ReviewBanner } from "./review-banner";
import { StatsGrid } from "./stats-grid";

interface DashboardContentProps {
	data: DashboardResponse;
	user: UserProfile | undefined;
	lang: string;
}

export const DashboardContent = ({ data, user, lang }: DashboardContentProps) => (
	<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pb-5 max-sm:pt-3.5">
		<GreetingSection user={user} stats={data.stats} lang={lang} />

		<StatsGrid stats={data.stats} />

		<ReviewBanner dueToday={data.stats.dueToday} lang={lang} />

		{data.continueReading.length > 0 ? (
			<ContinueReading items={data.continueReading} lang={lang} />
		) : null}

		<LibraryPreview lang={lang} />
	</div>
);
