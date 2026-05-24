"use client";

import { useAdminAnalyticsRealtime } from "@/features/admin-analytics";

interface RealtimeBadgeProps {
	online: string;
}

export const RealtimeBadge = ({ online }: RealtimeBadgeProps) => {
	const { data } = useAdminAnalyticsRealtime();
	const count = data?.count ?? null;

	return (
		<div className="flex items-center gap-1.5 text-[12px] text-t-2">
			<span className="relative flex size-1.5">
				<span className="absolute inline-flex size-full animate-ping rounded-full bg-grn opacity-75" />
				<span className="relative inline-flex size-1.5 rounded-full bg-grn" />
			</span>
			<span>
				{count === null ? "—" : count} {online}
			</span>
		</div>
	);
};
