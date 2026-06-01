"use client";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileHeader } from "./profile-header";
import { PROFILE_TAB_IDS, ProfileTabs, type ProfileTabId } from "./profile-tabs";
import { TabMain } from "./tab-main";

const TabSecurity = dynamic(() =>
	import("./tab-security").then(m => m.TabSecurity),
);
const TabSubscription = dynamic(() =>
	import("./tab-subscription").then(m => m.TabSubscription),
);
const AiSection = dynamic(() =>
	import("@/widgets/settings-page").then(m => m.AiSection),
);

const isValidTab = (v: string | null): v is ProfileTabId =>
	PROFILE_TAB_IDS.includes(v as ProfileTabId);

export interface ProfilePageProps {
	lang: string;
}

export const ProfilePage = ({ lang }: ProfilePageProps) => {
	const { t } = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab");
	const activeTab: ProfileTabId = isValidTab(tabParam) ? tabParam : "main";

	const handleTabChange = (tab: ProfileTabId) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", tab);
		router.replace(`?${params.toString()}`);
	};

	const { data: profile, isLoading, isError } = useCurrentUser();

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
			<header className="border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3 sticky top-0 z-10 shrink-0">
				<Typography tag="p" className="text-[13.5px] font-semibold text-t-1">
					{t("profile.pageTitle")}
				</Typography>
			</header>

			<main className="flex flex-col gap-3.5 px-[22px] pt-[18px] pb-10 max-md:px-3.5 max-md:pt-3.5 max-md:pb-[calc(70px+env(safe-area-inset-bottom,0))] overflow-y-auto">
				<ProfileHeader profile={profile} lang={lang} />
				<ProfileTabs active={activeTab} onChange={handleTabChange} />

				{activeTab === "main" && <TabMain profile={profile} lang={lang} />}
				{activeTab === "security" && <TabSecurity profile={profile} />}
				{activeTab === "subscription" && <TabSubscription lang={lang} />}
				{activeTab === "ai" && <AiSection />}
			</main>
		</>
	);
};
