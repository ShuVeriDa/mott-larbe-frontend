"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { FetchAdminUsersQuery, RoleName, UsersSort } from "@/entities/admin-user";
import { Search } from "lucide-react";
import { Select } from "@/shared/ui/select";

const ROLES: Array<{ value: RoleName | ""; label: string }> = [
	{ value: "", label: "" },
	{ value: "learner", label: "Learner" },
	{ value: "support", label: "Support" },
	{ value: "content", label: "Content" },
	{ value: "linguist", label: "Linguist" },
	{ value: "admin", label: "Admin" },
	{ value: "superadmin", label: "Superadmin" },
];

const PLANS = [
	{ value: "", label: "" },
	{ value: "FREE", label: "Free" },
	{ value: "BASIC", label: "Basic" },
	{ value: "PRO", label: "Pro" },
	{ value: "PREMIUM", label: "Premium" },
	{ value: "LIFETIME", label: "Lifetime" },
];

const SORTS: Array<{ value: UsersSort; labelKey: string }> = [
	{ value: "signup_desc", labelKey: "admin.users.toolbar.sortByDate" },
	{ value: "activity_desc", labelKey: "admin.users.toolbar.sortByActivity" },
	{ value: "name_asc", labelKey: "admin.users.toolbar.sortByName" },
];

interface UsersToolbarProps {
	search: string;
	role: FetchAdminUsersQuery["role"];
	plan: string;
	sort: UsersSort;
	onSearchChange: (value: string) => void;
	onRoleChange: (value: string) => void;
	onPlanChange: (value: string) => void;
	onSortChange: (value: UsersSort) => void;
}

export const UsersToolbar = ({
	search,
	role,
	plan,
	sort,
	onSearchChange,
	onRoleChange,
	onPlanChange,
	onSortChange,
}: UsersToolbarProps) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onRoleChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onPlanChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onSortChange(e.currentTarget.value as UsersSort);
	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative min-w-[180px] flex-1">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3" />
				<input
					type="text"
					value={search}
					onChange={handleChange}
					placeholder={t("admin.users.toolbar.searchPlaceholder")}
					className="h-8 w-full rounded-lg border border-bd-2 bg-surf pl-8 pr-2.5 font-sans text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-1.5">
				<Select value={role ?? ""} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					{ROLES.map((r) => (
						<option key={r.value} value={r.value}>
							{r.value === "" ? t("admin.users.toolbar.allRoles") : r.label}
						</option>
					))}
				</Select>

				<Select value={plan} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					{PLANS.map((p) => (
						<option key={p.value} value={p.value}>
							{p.value === "" ? t("admin.users.toolbar.allPlans") : p.label}
						</option>
					))}
				</Select>

				<Select value={sort} onChange={handleChange4} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					{SORTS.map((s) => (
						<option key={s.value} value={s.value}>
							{t(s.labelKey)}
						</option>
					))}
				</Select>
			</div>
		</div>
	);
};
