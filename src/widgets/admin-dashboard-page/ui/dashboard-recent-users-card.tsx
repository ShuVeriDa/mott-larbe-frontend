"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import type { AdminDashboardUser } from "@/entities/admin-dashboard";

const AVATAR_COLORS = [
	{ bg: "bg-acc-bg", text: "text-acc-t" },
	{ bg: "bg-grn-bg", text: "text-grn-t" },
	{ bg: "bg-pur-bg", text: "text-pur-t" },
	{ bg: "bg-amb-bg", text: "text-amb-t" },
	{ bg: "bg-red-bg", text: "text-red-t" },
];

const getInitials = (name: string, surname: string) =>
	`${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();

const formatDate = (iso: string) => {
	const d = new Date(iso);
	const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
	return `${d.getDate()} ${months[d.getMonth()]}`;
};

const subTypeBadge = (
	type: string | null,
	t: (k: Parameters<ReturnType<typeof useI18n>["t"]>[0]) => string,
) => {
	if (!type) return null;
	const map: Record<string, { cls: string; key: Parameters<ReturnType<typeof useI18n>["t"]>[0] }> = {
		trial: { cls: "bg-amb-bg text-amb-t", key: "admin.dashboard.recentUsers.trial" },
		pro: { cls: "bg-acc-bg text-acc-t", key: "admin.dashboard.recentUsers.pro" },
		lifetime: { cls: "bg-pur-bg text-pur-t", key: "admin.dashboard.recentUsers.lifetime" },
	};
	const def = map[type] ?? { cls: "bg-grn-bg text-grn-t", key: "admin.dashboard.recentUsers.active" };
	return (
		<Typography tag="span"
			className={cn(
				"inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
				def.cls,
			)}
		>
			{t(def.key)}
		</Typography>
	);
};

interface DashboardRecentUsersCardProps {
	users: AdminDashboardUser[];
}

export const DashboardRecentUsersCard = ({ users }: DashboardRecentUsersCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.recentUsers.title")}
				</Typography>
				<Link
					href={`/${params.lang}/admin/users`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("admin.dashboard.recentUsers.all")}
				</Link>
			</div>
			<div className="px-4 pb-4 pt-1">
				{users.map((user, idx) => {
					const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
					return (
						<Link
							key={user.id}
							href={`/${params.lang}/admin/users/${user.id}`}
							className={cn(
								"flex min-w-0 cursor-pointer items-center gap-2.5 py-2 transition-colors hover:opacity-80",
								idx < users.length - 1 && "border-b border-bd-1",
							)}
						>
							<div
								className={cn(
									"flex size-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
									color.bg,
									color.text,
								)}
							>
								{getInitials(user.name, user.surname)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="truncate text-[12.5px] font-medium text-t-1">
									{user.name} {user.surname}
								</div>
								<div className="truncate text-[11px] text-t-3">{user.email}</div>
							</div>
							<div className="shrink-0">
								{subTypeBadge(user.subscriptionType, t)}
							</div>
							<div className="hidden shrink-0 text-[11px] text-t-3 sm:block">
								{formatDate(user.createdAt)}
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export const DashboardRecentUsersCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
			<div className="h-3.5 w-32 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-10 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 pb-4 pt-1">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2.5 border-b border-bd-1 py-2 last:border-b-0">
					<div className="size-[30px] animate-pulse rounded-full bg-surf-3" />
					<div className="flex-1 space-y-1.5">
						<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
						<div className="h-2.5 w-40 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
			))}
		</div>
	</div>
);
