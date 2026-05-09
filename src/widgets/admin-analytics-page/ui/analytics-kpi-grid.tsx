"use client";

import { Typography } from "@/shared/ui/typography";

import { cn } from "@/shared/lib/cn";
import type { KpiItem } from "@/entities/admin-analytics";

interface KpiCardProps {
	item?: KpiItem;
	isLoading?: boolean;
}

const KpiCard = ({ item, isLoading }: KpiCardProps) => (
	<div className="rounded-card border border-bd-1 bg-surf p-3.5 transition-colors">
		<div className="mb-1.5 text-[11px] font-medium tracking-[0.3px] text-t-3">
			{isLoading ? (
				<Typography tag="span" className="inline-block h-3 w-20 animate-pulse rounded bg-surf-3" />
			) : (
				item?.label
			)}
		</div>
		<div
			className={cn(
				"mb-1 text-[24px] font-semibold leading-none text-t-1",
				isLoading && "animate-pulse text-t-4",
			)}
		>
			{isLoading ? "—" : (item?.valueFormatted ?? "—")}
		</div>
		{!isLoading && item && (
			<div
				className={cn(
					"flex items-center gap-1 text-[11px]",
					item.changeType === "up" && "text-grn-t",
					item.changeType === "down" && "text-red-t",
					item.changeType === "neutral" && "text-t-3",
				)}
			>
				{item.changeType !== "neutral" && (
					<svg
						width="11"
						height="11"
						viewBox="0 0 12 12"
						fill="none"
						aria-hidden="true"
					>
						{item.changeType === "up" ? (
							<path
								d="M6 9V3M3 6l3-3 3 3"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						) : (
							<path
								d="M6 3v6M3 6l3 3 3-3"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						)}
					</svg>
				)}
				{item.changeText}
			</div>
		)}
	</div>
);

interface AnalyticsKpiGridProps {
	items?: KpiItem[];
	isLoading?: boolean;
}

export const AnalyticsKpiGrid = ({ items, isLoading }: AnalyticsKpiGridProps) => {
	const placeholders = Array.from({ length: 4 });

	return (
		<div className="mb-5 grid grid-cols-4 gap-2.5 max-md:grid-cols-2 max-sm:grid-cols-2 max-sm:gap-2">
			{isLoading || !items
				? placeholders.map((_, i) => <KpiCard key={i} isLoading />)
				: items.map((item) => <KpiCard key={item.key} item={item} />)}
		</div>
	);
};
