"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { PlanRevenueItem, PlanCode } from "@/entities/admin-billing";

const BAR_COLORS: Record<string, string> = {
	FREE: "bg-surf-4",
	BASIC: "bg-acc",
	PRO: "bg-grn",
	PREMIUM: "bg-pur",
	LIFETIME: "bg-amb",
};

const fmtMoney = (cents: number) => {
	const rub = cents / 100;
	if (rub >= 1_000_000) return `${(rub / 1_000_000).toFixed(1)} млн ₽`;
	if (rub >= 1_000) return `${Math.round(rub / 1_000)} тыс. ₽`;
	return `${Math.round(rub)} ₽`;
};

interface BillingRevenueChartProps {
	items: PlanRevenueItem[];
	isLoading: boolean;
}

export const BillingRevenueChart = ({ items, isLoading }: BillingRevenueChartProps) => {
	const { t } = useI18n();
	const maxTotal = Math.max(...items.map((i) => i.totalCents), 1);

	return (
		<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf transition-colors">
			<div className="border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("admin.plans.revenue.title")}
				</Typography>
			</div>
			<div className="px-4 py-4">
				{isLoading ? (
					<div className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-7 animate-pulse rounded-lg bg-surf-3" />
						))}
					</div>
				) : items.length === 0 ? (
					<div className="py-4 text-center text-[12.5px] text-t-3">—</div>
				) : (
					<div className="space-y-3">
						{items.map((item) => {
							const pct = Math.max(
								Math.round((item.totalCents / maxTotal) * 100),
								item.totalCents > 0 ? 4 : 0,
							);
							const barClass =
								BAR_COLORS[item.planCode as PlanCode] ?? "bg-surf-4";
							return (
								<div key={item.planId}>
									<div className="mb-1 flex items-baseline justify-between gap-2">
										<Typography tag="span" className="text-[12px] text-t-2">{item.planName}</Typography>
										<Typography tag="span" className="shrink-0 text-[12.5px] font-semibold text-t-1">
											{fmtMoney(item.totalCents)}
										</Typography>
									</div>
									<div className="h-1.5 overflow-hidden rounded-full bg-surf-3">
										<div
											className={`h-full rounded-full transition-all duration-500 ${barClass}`}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
