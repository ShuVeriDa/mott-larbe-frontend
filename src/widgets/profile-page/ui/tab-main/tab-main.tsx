"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useProfileSummary } from "@/entities/statistics";
import type { UserProfile } from "@/entities/user";
import { ActivityCard } from "./activity-card";
import { LearningSettingsCard } from "./learning-settings-card";
import { PersonalDataCard } from "./personal-data-card";
import { StatsCard } from "./stats-card";

export interface TabMainProps {
	profile: UserProfile;
	lang: string;
}

export const TabMain = ({ profile, lang }: TabMainProps) => {
	const { t } = useI18n();
	const { data: summary, isLoading: summaryLoading } = useProfileSummary();

	return (
		<div className="grid grid-cols-[1fr_300px] gap-3.5 items-start max-lg:grid-cols-1">
			<div className="flex flex-col gap-3.5">
				<PersonalDataCard profile={profile} />
				<LearningSettingsCard profile={profile} />
			</div>

			<div className="flex flex-col gap-3.5">
				{summaryLoading ? (
					<div className="rounded-[12px] border-hairline border-bd-1 bg-surf px-4 py-6 text-center">
						<Typography tag="p" className="text-[13px] text-t-3">
							{t("profile.loading")}
						</Typography>
					</div>
				) : summary ? (
					<>
						<StatsCard summary={summary} lang={lang} />
						<ActivityCard heatmap={summary.heatmap} />
					</>
				) : null}
			</div>
		</div>
	);
};
