"use client";

import { Typography } from "@/shared/ui/typography";
import { Info } from "lucide-react";
import type { AnalyticsInsight } from "@/entities/admin-analytics";

interface AnalyticsInsightStripProps {
	insight?: AnalyticsInsight;
	isLoading?: boolean;
}

export const AnalyticsInsightStrip = ({
	insight,
	isLoading,
}: AnalyticsInsightStripProps) => {
	if (isLoading) {
		return (
			<div className="mb-3.5 h-10 animate-pulse rounded-[9px] bg-surf-2" />
		);
	}

	if (!insight) return null;

	return (
		<div className="mb-3.5 flex items-start gap-2.5 rounded-[9px] border border-acc/15 bg-acc-bg px-3.5 py-2.5">
			<Info className="mt-0.5 size-[15px] shrink-0 text-acc" aria-hidden="true" />
			<Typography tag="p" className="text-[12.5px] leading-relaxed text-acc-t">
				<Typography tag="strong" className="font-semibold">{insight.title}: </Typography>
				{insight.message}
			</Typography>
		</div>
	);
};
