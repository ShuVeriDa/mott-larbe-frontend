"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { FetchAdminUsersQuery, RoleName, UsersSort } from "@/entities/admin-user";

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

const selectClass =
	"h-8 cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf px-2.5 pr-7 font-sans text-[12.5px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_9px_center]";

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

	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative min-w-[180px] flex-1">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3"
					viewBox="0 0 16 16"
					fill="none"
				>
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
					<path
						d="M10.5 10.5l2.5 2.5"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.users.toolbar.searchPlaceholder")}
					className="h-8 w-full rounded-lg border border-bd-2 bg-surf pl-8 pr-2.5 font-sans text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-1.5">
				<select
					value={role ?? ""}
					onChange={(e) => onRoleChange(e.target.value)}
					className={selectClass}
				>
					{ROLES.map((r) => (
						<option key={r.value} value={r.value}>
							{r.value === "" ? t("admin.users.toolbar.allRoles") : r.label}
						</option>
					))}
				</select>

				<select
					value={plan}
					onChange={(e) => onPlanChange(e.target.value)}
					className={selectClass}
				>
					{PLANS.map((p) => (
						<option key={p.value} value={p.value}>
							{p.value === "" ? t("admin.users.toolbar.allPlans") : p.label}
						</option>
					))}
				</select>

				<select
					value={sort}
					onChange={(e) => onSortChange(e.target.value as UsersSort)}
					className={selectClass}
				>
					{SORTS.map((s) => (
						<option key={s.value} value={s.value}>
							{t(s.labelKey)}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
