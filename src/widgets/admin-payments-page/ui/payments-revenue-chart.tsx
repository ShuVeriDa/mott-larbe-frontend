"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentChartItem } from "@/entities/admin-payment";

const fmtTick = (val: number) => {
	if (val >= 1000) return `${Math.round(val / 1000)}к`;
	return String(val);
};

const fmtRub = (cents: number) => {
	const rub = cents / 100;
	if (rub >= 1000) return `${Math.round(rub / 1000)} тыс. ₽`;
	return `${Math.round(rub)} ₽`;
};

interface Props {
	items?: AdminPaymentChartItem[];
	isLoading: boolean;
}

export const PaymentsRevenueChart = ({ items, isLoading }: Props) => {
	const { t } = useI18n();

	const data = (items ?? []).map((item) => ({
		label: item.day.slice(8),
		revenue: Math.round(item.revenueCents / 100),
		refunds: Math.round(item.refundCents / 100),
	}));

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<span className="text-[12.5px] font-semibold text-t-1">
					{t("admin.payments.chart.revenueTitle")}
				</span>
				<div className="flex items-center gap-3.5">
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-[2px] bg-acc/70" />
						{t("admin.payments.chart.legendPaid")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-[2px] bg-red/60" />
						{t("admin.payments.chart.legendRefunds")}
					</div>
				</div>
			</div>

			<div className="px-4 pb-4 pt-3">
				{isLoading ? (
					<div className="h-[140px] animate-pulse rounded-lg bg-surf-3" />
				) : data.length === 0 ? (
					<div className="flex h-[140px] items-center justify-center text-[12.5px] text-t-3">
						—
					</div>
				) : (
					<ResponsiveContainer width="100%" height={140}>
						<BarChart
							data={data}
							margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
							barCategoryGap="30%"
						>
							<CartesianGrid
								strokeDasharray="0"
								vertical={false}
								stroke="rgba(0,0,0,0.06)"
								className="dark:stroke-white/6"
							/>
							<XAxis
								dataKey="label"
								tick={{ fontSize: 11, fill: "var(--color-t-3, #a5a39a)" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: "var(--color-t-3, #a5a39a)" }}
								axisLine={false}
								tickLine={false}
								tickFormatter={fmtTick}
							/>
							<Tooltip
								formatter={(value, name) => [
									fmtRub((value as number) * 100),
									name === "revenue"
										? t("admin.payments.chart.legendPaid")
										: t("admin.payments.chart.legendRefunds"),
								]}
								contentStyle={{
									background: "var(--color-surf, #fff)",
									border: "0.5px solid var(--color-bd-2, rgba(0,0,0,0.13))",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--color-t-1, #18180f)",
								}}
								cursor={{ fill: "rgba(0,0,0,0.03)" }}
							/>
							<Bar
								dataKey="revenue"
								fill="rgba(34,84,211,0.7)"
								radius={[3, 3, 0, 0]}
								maxBarSize={20}
							/>
							<Bar
								dataKey="refunds"
								fill="rgba(220,38,38,0.55)"
								radius={[3, 3, 0, 0]}
								maxBarSize={20}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
};
