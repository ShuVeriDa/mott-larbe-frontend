"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { ReadingFunnel } from "@/entities/admin-analytics";

interface FunnelRowProps {
	label: string;
	value: string;
	widthPct: number;
	isCompleted?: boolean;
}

const FunnelRow = ({ label, value, widthPct, isCompleted }: FunnelRowProps) => (
	<div className="relative flex h-9 items-center overflow-hidden rounded-[6px]">
		<div
			className={cn(
				"absolute inset-y-0 left-0 rounded-[6px]",
				isCompleted ? "bg-grn-bg" : "bg-acc-bg",
			)}
			style={{ width: `${widthPct}%` }}
		/>
		<div className="relative z-10 flex w-full items-center justify-between px-3">
			<span className="text-[12px] font-medium text-t-1">{label}</span>
			<span
				className={cn(
					"text-[12px] font-semibold",
					isCompleted ? "text-grn-t" : "text-t-1",
				)}
			>
				{value}
			</span>
		</div>
	</div>
);

interface AnalyticsReadingFunnelProps {
	funnel?: ReadingFunnel;
	isLoading?: boolean;
}

export const AnalyticsReadingFunnel = ({
	funnel,
	isLoading,
}: AnalyticsReadingFunnelProps) => {
	const { t } = useI18n();

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between px-4 pt-3.5 pb-3">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.readingFunnel.title")}
				</span>
				<span className="text-[11px] text-t-3">
					{t("admin.analytics.readingFunnel.subtitle")}
				</span>
			</div>

			<div className="flex flex-col gap-1.5 px-4 pb-4">
				{isLoading || !funnel ? (
					Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="h-9 animate-pulse rounded-[6px] bg-surf-2"
						/>
					))
				) : (
					<>
						<FunnelRow
							label={t("admin.analytics.readingFunnel.opened")}
							value={funnel.openedEventsCount.toLocaleString()}
							widthPct={100}
						/>
						<FunnelRow
							label={t("admin.analytics.readingFunnel.read25")}
							value={`${funnel.read25Percent}%`}
							widthPct={funnel.read25Percent}
						/>
						<FunnelRow
							label={t("admin.analytics.readingFunnel.read50")}
							value={`${funnel.read50Percent}%`}
							widthPct={funnel.read50Percent}
						/>
						<FunnelRow
							label={t("admin.analytics.readingFunnel.read75")}
							value={`${funnel.read75Percent}%`}
							widthPct={funnel.read75Percent}
						/>
						<FunnelRow
							label={t("admin.analytics.readingFunnel.completed")}
							value={`${funnel.completedPercent}%`}
							widthPct={funnel.completedPercent}
							isCompleted
						/>
					</>
				)}
			</div>
		</div>
	);
};
