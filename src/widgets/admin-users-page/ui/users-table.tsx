"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import type { AdminUserListItem, RoleName } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user";
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
				<Table className="w-full border-collapse text-[13px]" aria-busy="true" aria-label="Loading users">
					<TableBody>
						{Array.from({ length: 8 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-3 pl-3.5" style={{ width: 30 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-3">
									<div className="flex items-center gap-2">
										<div className="size-7 animate-pulse rounded-full bg-surf-3" />
										<div className="space-y-1">
											<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
											<div className="h-2 w-36 animate-pulse rounded bg-surf-3" />
										</div>
									</div>
								</TableCell>
								<TableCell className="px-2.5 py-3" style={{ width: 110 }}>
									<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-3" style={{ width: 140 }}>
									<div className="h-4 w-20 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-3" style={{ width: 90 }}>
									<div className="h-4 w-12 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-3" style={{ width: 100 }}>
									<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-3 pr-3.5" style={{ width: 100 }}>
									<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell style={{ width: 70 }} />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
			<Table className="w-full border-collapse text-[13px]" aria-label={t("admin.users.table.user")}>
				<TableHeader>
					<TableRow className="border-b border-bd-1">
						<TableHead className="px-2.5 py-[9px] pl-3.5" style={{ width: 30 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								aria-label={t("admin.users.table.selectAll")}
								className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
							/>
						</TableHead>
						<TableHead className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.users.table.user")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 110 }}
						>
							{t("admin.users.table.status")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 140 }}
						>
							{t("admin.users.table.roles")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 90 }}
						>
							{t("admin.users.table.plan")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[9px] text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 100 }}
						>
							{t("admin.users.table.activity")}
						</TableHead>
						<TableHead
							className="col-reg px-2.5 py-[9px] pr-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 100 }}
						>
							{t("admin.users.table.registered")}
						</TableHead>
						<TableHead style={{ width: 70 }} />
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => {
					  const handleCheckboxClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleToggleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => onToggleRow(user.id);
					  const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  return (
						<TableRow
							key={user.id}
							className="cursor-pointer border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
						>
							<TableCell className="px-2.5 py-[9px] pl-3.5" onClick={handleCheckboxClick}>
								<input
									type="checkbox"
									checked={selectedIds.has(user.id)}
									onChange={handleToggleChange}
									aria-label={`${user.name} ${user.surname}`}
									className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
								/>
							</TableCell>
							<TableCell className="px-2.5 py-[9px]">
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
							</TableCell>
							<TableCell className="px-2.5 py-[9px]">
								<UserStatusBadge status={user.status} labels={statusLabels} />
							</TableCell>
							<TableCell className="px-2.5 py-[9px]">
								<div className="flex flex-wrap gap-[3px]">
									{user.roles.map((role) => (
										<UserRoleChip
											key={role}
											role={role}
											label={roleLabels[role]}
										/>
									))}
								</div>
							</TableCell>
							<TableCell className="px-2.5 py-[9px]">
								<UserPlanChip plan={user.plan} labels={planLabels} />
							</TableCell>
							<TableCell
								className={`px-2.5 py-[9px] text-[11.5px] ${user.status === "BLOCKED" || user.status === "DELETED" ? "text-t-4" : "text-t-3"}`}
							>
								{user.lastActiveAt
									? formatActivity(user.lastActiveAt)
									: "—"}
							</TableCell>
							<TableCell className="px-2.5 py-[9px] pr-3.5 text-[11.5px] text-t-3 max-md:hidden">
								{new Date(user.signupAt).toLocaleDateString("ru-RU", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</TableCell>
							<TableCell className="px-2.5 py-[9px]" onClick={handleActionsClick}>
								<UserRowActions user={user} mutations={mutations} />
							</TableCell>
						</TableRow>
					);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
