"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminUserListItem, RoleName } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import { UserAvatar } from "./user-avatar";
import { UserStatusBadge } from "./user-status-badge";
import { UserRoleChip } from "./user-role-chip";
import { UserPlanChip } from "./user-plan-chip";
import { UserRowActions } from "./user-row-actions";
import { formatActivity } from "../lib/format-activity";

interface UsersTableProps {
	users: AdminUserListItem[];
	selectedIds: Set<string>;
	allSelected: boolean;
	onToggleAll: () => void;
	onToggleRow: (id: string) => void;
	mutations: ReturnType<typeof useAdminUserMutations>;
	isLoading: boolean;
}

export const UsersTable = ({
	users,
	selectedIds,
	allSelected,
	onToggleAll,
	onToggleRow,
	mutations,
	isLoading,
}: UsersTableProps) => {
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
			<div className="overflow-x-auto max-sm:hidden">
				<table className="w-full border-collapse text-[13px]">
					<tbody>
						{Array.from({ length: 8 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1">
								<td className="px-2.5 py-3 pl-3.5" style={{ width: 30 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-3">
									<div className="flex items-center gap-2">
										<div className="size-7 animate-pulse rounded-full bg-surf-3" />
										<div className="space-y-1">
											<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
											<div className="h-2 w-36 animate-pulse rounded bg-surf-3" />
										</div>
									</div>
								</td>
								<td className="px-2.5 py-3" style={{ width: 110 }}>
									<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-3" style={{ width: 140 }}>
									<div className="h-4 w-20 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-3" style={{ width: 90 }}>
									<div className="h-4 w-12 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-3" style={{ width: 100 }}>
									<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-3 pr-3.5" style={{ width: 100 }}>
									<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
								</td>
								<td style={{ width: 70 }} />
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
			<table className="w-full border-collapse text-[13px]">
				<thead>
					<tr className="border-b border-bd-1">
						<th className="px-2.5 py-[9px] pl-3.5" style={{ width: 30 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
							/>
						</th>
						<th className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.users.table.user")}
						</th>
						<th
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 110 }}
						>
							{t("admin.users.table.status")}
						</th>
						<th
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 140 }}
						>
							{t("admin.users.table.roles")}
						</th>
						<th
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 90 }}
						>
							{t("admin.users.table.plan")}
						</th>
						<th
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 100 }}
						>
							{t("admin.users.table.activity")}
						</th>
						<th
							className="col-reg px-2.5 py-[9px] pr-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 100 }}
						>
							{t("admin.users.table.registered")}
						</th>
						<th style={{ width: 70 }} />
					</tr>
				</thead>
				<tbody>
					{users.map((user) => {
					  const handleClick: NonNullable<React.ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = () => onToggleRow(user.id);
					  const handleClick2: NonNullable<React.ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  return (
						<tr
							key={user.id}
							className="cursor-pointer border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
						>
							<td className="px-2.5 py-[9px] pl-3.5" onClick={handleClick}>
								<input
									type="checkbox"
									checked={selectedIds.has(user.id)}
									onChange={handleChange}
									className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
								/>
							</td>
							<td className="px-2.5 py-[9px]">
								<div className="flex items-center gap-2.5">
									<UserAvatar
										name={user.name}
										surname={user.surname}
										faded={user.status === "DELETED" || user.status === "BLOCKED"}
									/>
									<div>
										<div
											className={`text-[13px] font-medium text-t-1 ${user.status === "BLOCKED" || user.status === "DELETED" ? "opacity-50" : ""}`}
										>
											{user.name} {user.surname}
										</div>
										<div className="mt-px text-[11px] text-t-3">{user.email}</div>
									</div>
								</div>
							</td>
							<td className="px-2.5 py-[9px]">
								<UserStatusBadge status={user.status} labels={statusLabels} />
							</td>
							<td className="px-2.5 py-[9px]">
								<div className="flex flex-wrap gap-[3px]">
									{user.roles.map((role) => (
										<UserRoleChip
											key={role}
											role={role}
											label={roleLabels[role]}
										/>
									))}
								</div>
							</td>
							<td className="px-2.5 py-[9px]">
								<UserPlanChip plan={user.plan} labels={planLabels} />
							</td>
							<td
								className={`px-2.5 py-[9px] text-[11.5px] ${user.status === "BLOCKED" || user.status === "DELETED" ? "text-t-4" : "text-t-3"}`}
							>
								{user.lastActiveAt
									? formatActivity(user.lastActiveAt)
									: "—"}
							</td>
							<td className="px-2.5 py-[9px] pr-3.5 text-[11.5px] text-t-3 max-md:hidden">
								{new Date(user.signupAt).toLocaleDateString("ru-RU", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</td>
							<td className="px-2.5 py-[9px]" onClick={handleClick2}>
								<UserRowActions user={user} mutations={mutations} />
							</td>
						</tr>
					);
					})}
				</tbody>
			</table>
		</div>
	);
};
