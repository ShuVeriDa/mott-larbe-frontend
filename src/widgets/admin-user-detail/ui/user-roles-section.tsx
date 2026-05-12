"use client";

import { Typography } from "@/shared/ui/typography";

import type { RoleName, UserRoleItem } from "@/entities/admin-user";
import type { useAdminUserRoles } from "@/entities/admin-user/model/use-admin-user-roles";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Plus, X } from "lucide-react";
import { ComponentProps, useState } from "react";

const roleStyles: Record<RoleName, string> = {
	learner: "bg-surf-3 text-t-2",
	support: "bg-acc-bg text-acc-t",
	content: "bg-pur-bg text-pur-t",
	linguist: "bg-amb-bg text-amb-t",
	admin: "bg-red-bg text-red-t",
	superadmin: "bg-grn-bg text-grn-t",
};

const normalizeRole = (name: string): RoleName =>
	name.toLowerCase() as RoleName;

const ALL_ROLES: RoleName[] = [
	"learner",
	"support",
	"content",
	"linguist",
	"admin",
	"superadmin",
];

interface UserRolesSectionProps {
	roles: UserRoleItem[];
	roleMutations: ReturnType<typeof useAdminUserRoles>;
}

export const UserRolesSection = ({
	roles,
	roleMutations,
}: UserRolesSectionProps) => {
	const { t, lang } = useI18n();
	const [showDropdown, setShowDropdown] = useState(false);

	const existingRoleNames = new Set(roles.map(r => r.name));
	const availableRoles = ALL_ROLES.filter(r => !existingRoleNames.has(r));

	const handleAssign = (roleName: RoleName) => {
		roleMutations.assign.mutate(roleName);
		setShowDropdown(false);
	};

	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setShowDropdown(v => !v);
	return (
		<div className="border-b border-bd-1 px-4 py-3">
			<div className="mb-2 flex items-center justify-between">
				<Typography
					tag="span"
					className="text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3"
				>
					{t("admin.userDetail.roles")}
				</Typography>
				{availableRoles.length > 0 && (
					<div className="relative">
						<Button
							onClick={handleClick}
							className="flex h-[22px] items-center gap-1 rounded-[5px] bg-acc-bg px-2 text-[11px] font-semibold text-acc-t transition-colors hover:bg-acc-bg/80"
						>
							<Plus className="size-2.5" />
							{t("admin.userDetail.addRole")}
						</Button>
						{showDropdown && (
							<div className="absolute right-0 top-full z-20 mt-1 min-w-[130px] overflow-hidden rounded-lg border border-bd-2 bg-surf shadow-md">
								{availableRoles.map(role => {
									const handleClick: NonNullable<
										ComponentProps<"button">["onClick"]
									> = () => handleAssign(role);
									return (
										<Button
											key={role}
											onClick={handleClick}
											disabled={roleMutations.assign.isPending}
											className="flex w-full rounded-none items-center px-3 py-1.5 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2 disabled:opacity-50"
										>
											<Typography
												tag="span"
												className={cn(
													"rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
													roleStyles[normalizeRole(role)],
												)}
											>
												{t(`admin.users.roles.${normalizeRole(role)}`)}
											</Typography>
										</Button>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>

			<div className="divide-y divide-bd-1">
				{roles.map(role => {
					const sinceDate = new Date(role.assignedAt).toLocaleDateString(lang, {
						day: "numeric",
						month: "short",
						year: "numeric",
					});
					const isLearner = normalizeRole(role.name) === "learner";
					const handleClick: NonNullable<
						ComponentProps<"button">["onClick"]
					> = () => roleMutations.revoke.mutate(role.id);
					return (
						<div
							key={role.id}
							className="flex items-center justify-between py-1.5 last:pb-0 first:pt-0"
						>
							<div className="flex items-center gap-1.5">
								<Typography
									tag="span"
									className={cn(
										"rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
										roleStyles[normalizeRole(role.name)],
									)}
								>
									{t(`admin.users.roles.${normalizeRole(role.name)}`)}
								</Typography>
								<Typography tag="span" className="text-[10.5px] text-t-3">
									{sinceDate}
								</Typography>
							</div>
							<Button
								size={"bare"}
								onClick={handleClick}
								disabled={isLearner || roleMutations.revoke.isPending}
								title={t("admin.userDetail.revokeRole")}
								className={cn(
									"cursor-pointer flex size-5 items-center justify-center rounded border-none text-t-4 transition-colors hover:bg-red-bg hover:text-red-t",
									isLearner && "hidden pointer-events-none opacity-30",
								)}
							>
								<X className="size-[11px]" />
							</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
};
