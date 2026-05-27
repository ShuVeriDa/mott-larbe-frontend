"use client";

import type { TopActiveUser } from "@/entities/admin-analytics";
import { AVATAR_COLORS } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { AdminCard, AdminCardHeader } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AnalyticsTopUsersProps {
	users?: TopActiveUser[];
	isLoading?: boolean;
}

export const AnalyticsTopUsers = ({ users, isLoading }: AnalyticsTopUsersProps) => {
	const { t } = useI18n();
	const params = useParams();
	const lang = params?.lang as string;

	return (
		<AdminCard>
			<AdminCardHeader
				title={t("admin.analytics.topUsers.title")}
				action={
					<Link href={`/${lang}/admin/users`} className="text-[11.5px] text-acc hover:underline">
						{t("admin.analytics.topUsers.viewAll")}
					</Link>
				}
			/>

			{isLoading || !users
				? Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2.5 border-t border-bd-1 px-4 py-2">
							<div className="size-7 animate-pulse rounded-full bg-surf-3" />
							<div className="flex-1">
								<div className="mb-1 h-3 w-28 animate-pulse rounded bg-surf-3" />
								<div className="h-2.5 w-20 animate-pulse rounded bg-surf-3" />
							</div>
						</div>
					))
				: users.map((user, i) => (
						<Link
							key={user.userId}
							href={`/${lang}/admin/users/${user.userId}`}
							className="flex items-center gap-2.5 border-t border-bd-1 px-4 py-2 transition-colors hover:bg-surf-2"
						>
							<div
								className={cn(
									"flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
									AVATAR_COLORS[i % AVATAR_COLORS.length],
								)}
							>
								{user.initials}
							</div>
							<div className="min-w-0 flex-1">
								<div className="truncate text-[12.5px] font-medium text-t-1">
									{user.fullName}
								</div>
								<div className="text-[11px] text-t-3">
									{user.level && `${t(`shared.cefrLevel.${user.level}`)} · `}
									{t("admin.analytics.topUsers.streak", { count: user.streakDays })}
								</div>
							</div>
							<div className="shrink-0 text-right">
								<div className="text-[13px] font-semibold text-t-1">
									{user.eventsCount.toLocaleString()}
								</div>
								<div className="text-[10.5px] text-t-3">
									{t("admin.analytics.topUsers.events")}
								</div>
							</div>
						</Link>
					))}
		</AdminCard>
	);
};
