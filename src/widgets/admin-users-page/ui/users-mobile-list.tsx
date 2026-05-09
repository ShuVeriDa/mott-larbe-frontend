"use client";

import { Typography } from "@/shared/ui/typography";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminUserListItem, RoleName } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import { UserAvatar } from "./user-avatar";
import { UserStatusBadge } from "./user-status-badge";
import { UserRoleChip } from "./user-role-chip";
import { UserPlanChip } from "./user-plan-chip";
import { UserRowActions } from "./user-row-actions";
import { formatActivity } from "../lib/format-activity";

interface UsersMobileListProps {
	users: AdminUserListItem[];
	mutations: ReturnType<typeof useAdminUserMutations>;
	isLoading: boolean;
}

export const UsersMobileList = ({
	users,
	mutations,
	isLoading,
}: UsersMobileListProps) => {
	const { t } = useI18n();

	const statusLabels = {
		active: t("admin.users.status.active"),
		blocked: t("admin.users.status.blocked"),
		frozen: t("admin.users.status.frozen"),
		deleted: t("admin.users.status.deleted"),
	};

	const roleLabels: Record<RoleName, string> = {
		learner: t("admin.users.roles.learner"),
		support: t("admin.users.roles.support"),
		content: t("admin.users.roles.content"),
		linguist: t("admin.users.roles.linguist"),
		admin: t("admin.users.roles.admin"),
		superadmin: t("admin.users.roles.superadmin"),
	};

	const planLabels = {
		free: t("admin.users.plans.free"),
		basic: t("admin.users.plans.basic"),
		pro: t("admin.users.plans.pro"),
		premium: t("admin.users.plans.premium"),
		lifetime: t("admin.users.plans.lifetime"),
	};

	if (isLoading) {
		return (
			<div className="hidden max-sm:block">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-start gap-3 border-b border-bd-1 px-4 py-3.5">
						<div className="size-10 animate-pulse rounded-full bg-surf-3 shrink-0" />
						<div className="flex-1 space-y-2">
							<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
							<div className="h-2.5 w-44 animate-pulse rounded bg-surf-3" />
							<div className="flex gap-1.5">
								<div className="h-4 w-14 animate-pulse rounded bg-surf-3" />
								<div className="h-4 w-10 animate-pulse rounded bg-surf-3" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="hidden max-sm:block">
			{users.map((user) => {
			  const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
			  return (
				<div
					key={user.id}
					className="flex items-start gap-3 border-b border-bd-1 px-4 py-3.5 transition-colors last:border-b-0 active:bg-surf-2"
				>
					<UserAvatar name={user.name} surname={user.surname} size="md" />
					<div className="min-w-0 flex-1">
						<div className="mb-0.5 text-[13.5px] font-medium text-t-1">
							{user.name} {user.surname}
						</div>
						<div className="mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-t-3">
							{user.email}
						</div>
						<div className="flex flex-wrap items-center gap-1.5">
							<UserStatusBadge status={user.status} labels={statusLabels} />
							{user.roles.map((role) => (
								<UserRoleChip
									key={role}
									role={role}
									label={roleLabels[role]}
								/>
							))}
							<UserPlanChip plan={user.plan} labels={planLabels} />
							{user.lastActiveAt && (
								<Typography tag="span" className="text-[11px] text-t-3">
									{formatActivity(user.lastActiveAt)}
								</Typography>
							)}
						</div>
					</div>
					<div onClick={handleClick}>
						<UserRowActions user={user} mutations={mutations} />
					</div>
				</div>
			);
			})}
		</div>
	);
};
