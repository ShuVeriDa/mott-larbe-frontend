"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import type { AdminDashboardActivityEvent } from "@/entities/admin-dashboard";

const EVENT_COLORS: Record<string, string> = {
	TEXT_PUBLISHED: "var(--grn)",
	PAYMENT: "var(--grn)",
	FEEDBACK_NEW: "var(--amb)",
	USER_BLOCKED: "var(--red-token)",
	PROMO_REDEEMED: "var(--acc)",
	MORPH_RULES_ADDED: "var(--pur)",
};

const formatTimeAgo = (iso: string) => {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 60_000);
	if (mins < 1) return "только что";
	if (mins < 60) return `${mins} мин. назад`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} ч. назад`;
	const days = Math.floor(hours / 24);
	return `${days} дн. назад`;
};

interface DashboardActivityCardProps {
	events: AdminDashboardActivityEvent[];
}

export const DashboardActivityCard = ({ events }: DashboardActivityCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.activity.title")}
				</Typography>
				<Link
					href={`/${params.lang}/admin/logs`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("admin.dashboard.activity.log")}
				</Link>
			</div>
			<div className="px-4 pb-4 pt-1">
				{events.map((event, idx) => (
					<div
						key={`${event.type}-${event.createdAt}-${idx}`}
						className="flex min-w-0 items-start gap-2.5 border-b border-bd-1 py-2.5 last:border-b-0"
					>
						<div
							className="mt-[5px] size-[7px] shrink-0 rounded-full"
							style={{ background: EVENT_COLORS[event.type] ?? "var(--t-3)" }}
						/>
						<div className="min-w-0 flex-1">
							<div className="text-[12.5px] leading-[1.5] text-t-1">{event.title}</div>
							<div className="mt-0.5 text-[11px] text-t-3">
								{formatTimeAgo(event.createdAt)} · {event.meta}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export const DashboardActivityCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
			<div className="h-3.5 w-32 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-10 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 pb-4 pt-1">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="flex items-start gap-2.5 border-b border-bd-1 py-2.5 last:border-b-0">
					<div className="mt-1.5 size-2 animate-pulse rounded-full bg-surf-3" />
					<div className="flex-1 space-y-1.5">
						<div className="h-3 w-3/4 animate-pulse rounded bg-surf-3" />
						<div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
			))}
		</div>
	</div>
);
