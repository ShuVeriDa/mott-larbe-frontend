"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import type { AdminSubscriptionDetail } from "@/entities/admin-subscription";
import { formatDateLong } from "@/shared/lib/format-date";
import { SubscriptionProviderBadge } from "./subscription-provider-badge";

const SectionTitle = ({ label }: { label: string }) => (
	<SectionLabel className="mb-[7px]">{label}</SectionLabel>
);

interface Props {
	sub: AdminSubscriptionDetail;
	labels: {
		sectionTitle: string;
		userId: string;
		registered: string;
		lastSeen: string;
		provider: string;
	};
}

export const SubscriptionAccountSection = ({ sub, labels }: Props) => (
	<div className="border-b border-bd-1 px-[15px] py-2.5">
		<SectionTitle label={labels.sectionTitle} />
		<div className="space-y-1.5">
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">{labels.userId}</Typography>
				<Typography tag="span" className="font-mono text-[11px] text-t-3">{sub.userId.slice(0, 16)}…</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">{labels.registered}</Typography>
				<Typography tag="span" className="text-[12px] font-medium text-t-1">{formatDateLong(sub.user.signupAt)}</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">{labels.lastSeen}</Typography>
				<Typography tag="span" className="text-[12px] font-medium text-t-1">{formatDateLong(sub.user.lastActiveAt)}</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">{labels.provider}</Typography>
				<SubscriptionProviderBadge provider={sub.provider} />
			</div>
		</div>
	</div>
);
