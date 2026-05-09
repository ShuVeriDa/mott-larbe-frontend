"use client";

import { Typography } from "@/shared/ui/typography";
import type { AdminSubscriptionDetail, SubscriptionEventType } from "@/entities/admin-subscription";

const EVENT_STYLES: Record<SubscriptionEventType, { dot: string; icon: string }> = {
	SUBSCRIBED:    { dot: "bg-grn-t", icon: "✦" },
	RENEWED:       { dot: "bg-grn-t", icon: "↻" },
	UPGRADED:      { dot: "bg-pur-t", icon: "↑" },
	DOWNGRADED:    { dot: "bg-amb-t", icon: "↓" },
	CANCELED:      { dot: "bg-red-t", icon: "×" },
	REFUNDED:      { dot: "bg-amb-t", icon: "↩" },
	TRIAL_STARTED: { dot: "bg-acc-t", icon: "◎" },
	TRIAL_ENDED:   { dot: "bg-t-3",   icon: "○" },
	EXTENDED:      { dot: "bg-grn-t", icon: "+" },
	PLAN_CHANGED:  { dot: "bg-pur-t", icon: "⇄" },
};

const formatDateShort = (date: string) =>
	new Date(date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const SectionTitle = ({ label }: { label: string }) => (
	<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
		{label}
	</div>
);

interface Props {
	sub: AdminSubscriptionDetail;
	sectionTitle: string;
}

export const SubscriptionEventsSection = ({ sub, sectionTitle }: Props) => {
	if (sub.events.length === 0) return null;

	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<SectionTitle label={sectionTitle} />
			<div className="space-y-0">
				{sub.events.map((ev) => {
					const style = EVENT_STYLES[ev.type] ?? { dot: "bg-t-3", icon: "·" };
					return (
						<div key={ev.id} className="flex items-center gap-2 border-b border-bd-1 py-[5px] last:border-b-0 last:pb-0">
							<div className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
							<Typography tag="span" className="flex-1 text-[11.5px] text-t-2">{ev.type}</Typography>
							<Typography tag="span" className="text-[10.5px] text-t-3">{formatDateShort(ev.createdAt)}</Typography>
						</div>
					);
				})}
			</div>
		</div>
	);
};
