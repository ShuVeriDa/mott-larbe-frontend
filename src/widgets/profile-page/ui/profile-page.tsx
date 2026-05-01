"use client";

import { useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useCurrentUser } from "@/entities/user";
import { useMySubscription } from "@/entities/subscription";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs, type ProfileTabId } from "./profile-tabs";
import { TabMain } from "./tab-main";
import { TabSecurity } from "./tab-security";
import { TabSubscription } from "./tab-subscription";

export interface ProfilePageProps {
	lang: string;
}

export const ProfilePage = ({ lang }: ProfilePageProps) => {
	const { t } = useI18n();
	const [activeTab, setActiveTab] = useState<ProfileTabId>("main");

	const { data: profile, isLoading, isError } = useCurrentUser();
	const { data: subscription } = useMySubscription();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3.5 px-[22px] pt-[18px] pb-10 max-md:px-3.5 max-md:pt-3.5">
				<Typography tag="p" className="text-[13px] text-t-3">
					{t("profile.loading")}
				</Typography>
			</div>
		);
	}

	if (isError || !profile) {
		return (
			<div className="flex flex-col gap-3.5 px-[22px] pt-[18px] pb-10 max-md:px-3.5 max-md:pt-3.5">
				<Typography tag="p" className="text-[13px] text-red">
					{t("profile.loadError")}
				</Typography>
			</div>
		);
	}

	return (
		<>
			<div className="border-b border-hairline border-bd-1 bg-surf px-[22px] py-3 max-md:hidden sticky top-0 z-10">
				<Typography tag="p" className="text-[13.5px] font-semibold text-t-1">
					{t("profile.pageTitle")}
				</Typography>
			</div>

			<div className="flex flex-col gap-3.5 px-[22px] pt-[18px] pb-10 max-md:px-3.5 max-md:pt-3.5 max-md:pb-[calc(70px+env(safe-area-inset-bottom,0px))]">
				<ProfileHeader profile={profile} subscription={subscription} />
				<ProfileTabs active={activeTab} onChange={setActiveTab} />

				{activeTab === "main" && <TabMain profile={profile} lang={lang} />}
				{activeTab === "security" && <TabSecurity profile={profile} />}
				{activeTab === "subscription" && <TabSubscription lang={lang} />}
			</div>
		</>
	);
};
