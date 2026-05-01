"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Avatar } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import type { UserProfile } from "@/entities/user";
import type { Subscription } from "@/entities/subscription";

const getInitials = (profile: UserProfile): string => {
	const first = profile.name?.[0] ?? profile.username[0] ?? "";
	const last = profile.surname?.[0] ?? "";
	return (first + last).toUpperCase() || "?";
};

const getDisplayName = (profile: UserProfile): string => {
	if (profile.name && profile.surname) return `${profile.name} ${profile.surname}`;
	if (profile.name) return profile.name;
	return profile.username;
};

const getMemberSince = (createdAt: string, t: (key: string) => string): string => {
	const date = new Date(createdAt);
	return `${t("profile.header.memberSince")} ${date.toLocaleDateString("ru", { month: "long", year: "numeric" })}`;
};

export interface ProfileHeaderProps {
	profile: UserProfile;
	subscription: Subscription | null | undefined;
}

export const ProfileHeader = ({ profile, subscription }: ProfileHeaderProps) => {
	const { t } = useI18n();

	const planName = subscription?.plan.name ?? t("profile.header.freePlan");
	const isPremium = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";

	return (
		<div className="flex flex-col gap-3 rounded-[12px] border-hairline border-bd-1 bg-surf p-5 sm:flex-row sm:items-start sm:gap-3.5">
			<div className="flex flex-1 items-center gap-3.5 min-w-0">
				<Avatar
					className="size-[54px] text-[20px] font-display shrink-0 border-hairline border-bd-2"
					src={profile.avatar ?? undefined}
					alt={getDisplayName(profile)}
				>
					{getInitials(profile)}
				</Avatar>

				<div className="flex-1 min-w-0">
					<Typography
						tag="h1"
						className="font-display text-[19px] font-normal text-t-1 tracking-[-0.3px] mb-1 truncate"
					>
						{getDisplayName(profile)}
					</Typography>
					<div className="flex flex-wrap items-center gap-1.5 text-[12px] text-t-2">
						<span className="truncate max-w-[200px]">{profile.email}</span>
						<span className="size-[3px] rounded-full bg-surf-4 shrink-0 max-sm:hidden" />
						<span className="max-sm:block max-sm:w-full">
							{getMemberSince(profile.createdAt, t)}
						</span>
						<span className="size-[3px] rounded-full bg-surf-4 shrink-0 max-sm:hidden" />
						<Badge
							className={
								isPremium
									? "bg-acc-bg border-hairline border-acc/20 text-acc-t text-[11px]"
									: "bg-surf-2 border-hairline border-bd-2 text-t-2 text-[11px]"
							}
						>
							{planName}
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
};
