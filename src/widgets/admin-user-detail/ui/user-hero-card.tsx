"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminUserDetail } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import type { useAdminUserRoles } from "@/entities/admin-user/model/use-admin-user-roles";
import type { useAdminUserSessions } from "@/entities/admin-user/model/use-admin-user-sessions";
import { UserInfoSection } from "./user-info-section";
import { UserRolesSection } from "./user-roles-section";
import { UserActionsSection } from "./user-actions-section";

type AvatarColor = "blue" | "purple" | "green" | "amber" | "rose" | "neutral";

const colorMap: Record<AvatarColor, string> = {
	blue: "bg-acc-bg text-acc-t",
	purple: "bg-pur-bg text-pur-t",
	green: "bg-grn-bg text-grn-t",
	amber: "bg-amb-bg text-amb-t",
	rose: "bg-ros-bg text-ros-t",
	neutral: "bg-surf-3 text-t-2",
};

const getColor = (name: string, surname: string): AvatarColor => {
	const colors: AvatarColor[] = ["blue", "purple", "green", "amber", "rose", "neutral"];
	const seed = (name.charCodeAt(0) ?? 0) + (surname.charCodeAt(0) ?? 0);
	return colors[seed % colors.length];
};

const statusBadgeConfig = {
	ACTIVE: { dot: "bg-grn", wrap: "bg-grn-bg text-grn-t" },
	BLOCKED: { dot: "bg-red", wrap: "bg-red-bg text-red-t" },
	FROZEN: { dot: "bg-amb", wrap: "bg-amb-bg text-amb-t" },
	DELETED: { dot: "bg-t-3", wrap: "bg-surf-3 text-t-2" },
};

const planChipStyles: Record<string, string> = {
	FREE: "bg-surf-3 text-t-3",
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-pur-bg text-pur-t",
	PREMIUM: "bg-amb-bg text-amb-t",
	LIFETIME: "bg-grn-bg text-grn-t",
};

interface UserHeroCardProps {
	user: AdminUserDetail | undefined;
	isLoading: boolean;
	mutations: ReturnType<typeof useAdminUserMutations>;
	roleMutations: ReturnType<typeof useAdminUserRoles>;
	sessions: ReturnType<typeof useAdminUserSessions>;
}

export const UserHeroCard = ({
	user,
	isLoading,
	mutations,
	roleMutations,
	sessions,
}: UserHeroCardProps) => {
	const { t } = useI18n();

	if (isLoading || !user) {
		return (
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<div className="border-b border-bd-1 p-4">
					<div className="mb-2.5 size-[52px] animate-pulse rounded-full bg-surf-3" />
					<div className="mb-1.5 h-4 w-36 animate-pulse rounded bg-surf-3" />
					<div className="mb-3 h-3 w-48 animate-pulse rounded bg-surf-3" />
					<div className="flex gap-1.5">
						<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
						<div className="h-4 w-14 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="h-[72px] animate-pulse border-b border-bd-1 bg-surf-2 last:border-b-0" />
				))}
			</div>
		);
	}

	const color = getColor(user.name, user.surname);
	const initials =
		(user.name[0] ?? "").toUpperCase() + (user.surname[0] ?? "").toUpperCase();
	const statusCfg = statusBadgeConfig[user.status];
	const planKey = user.subscription?.planType ?? "FREE";
	const planStyle = planChipStyles[planKey] ?? planChipStyles.FREE;

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="border-b border-bd-1 px-4 py-[18px]">
				<div
					className={`mb-2.5 flex size-[52px] items-center justify-center rounded-full text-[17px] font-bold ${colorMap[color]}`}
				>
					{initials}
				</div>
				<div className="mb-0.5 text-[15px] font-semibold text-t-1">
					{user.name} {user.surname}
				</div>
				<div className="mb-2.5 text-[12px] text-t-3">{user.email}</div>
				<div className="flex flex-wrap gap-1">
					<span
						className={`inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold ${statusCfg.wrap}`}
					>
						<span className={`size-[5px] shrink-0 rounded-full ${statusCfg.dot}`} />
						{t(`admin.users.status.${user.status.toLowerCase()}`)}
					</span>
					{user.subscription && (
						<span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${planStyle}`}>
							{user.subscription.planName}
						</span>
					)}
				</div>
			</div>

			<UserInfoSection user={user} />
			<UserRolesSection roles={user.roles} roleMutations={roleMutations} />
			<UserActionsSection user={user} mutations={mutations} sessions={sessions} />
		</div>
	);
};
