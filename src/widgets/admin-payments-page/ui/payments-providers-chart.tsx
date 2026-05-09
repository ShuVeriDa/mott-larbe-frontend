"use client";

import { Typography } from "@/shared/ui/typography";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentProviderItem } from "@/entities/admin-payment";

const PROVIDER_COLORS: Record<string, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const PROVIDER_LABELS: Record<string, string> = {
	STRIPE: "Stripe",
	PAYPAL: "PayPal",
	PADDLE: "Paddle",
	LEMONSQUEEZY: "LemonSqueezy",
	MANUAL: "Manual",
};

const fmtMoney = (cents: number) => {
	const rub = Math.round(cents / 100);
	if (rub >= 1000) return `${Math.round(rub / 1000)} тыс. ₽`;
	return `${rub} ₽`;
};

interface Props {
	items?: AdminPaymentProviderItem[];
	isLoading: boolean;
}

export const PaymentsProvidersChart = ({ items, isLoading }: Props) => {
	const { t } = useI18n();

	const data = (items ?? []).map((item) => ({
		name: PROVIDER_LABELS[item.provider] ?? item.provider,
		value: item.pct,
		totalCents: item.totalCents,
		color: PROVIDER_COLORS[item.provider] ?? "#a5a39a",
	}));

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("admin.payments.providers.title")}
				</Typography>
			</div>

			<div className="px-4 py-3.5">
				{isLoading ? (
					<div className="space-y-3">
						<div className="mx-auto h-[120px] w-[120px] animate-pulse rounded-full bg-surf-3" />
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-4 animate-pulse rounded bg-surf-3" />
						))}
					</div>
				) : data.length === 0 ? (
					<div className="py-6 text-center text-[12.5px] text-t-3">—</div>
				) : (
					<>
						<div className="mx-auto mb-3.5 max-md:hidden">
							<ResponsiveContainer width={120} height={120}>
								<PieChart>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={38}
										outerRadius={56}
										dataKey="value"
										strokeWidth={0}
									>
										{data.map((entry, i) => (
											<Cell key={i} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										formatter={(value, name) => [
											`${value as number}%`,
											name,
										]}
										contentStyle={{
											background: "var(--color-surf, #fff)",
											border:
												"0.5px solid var(--color-bd-2, rgba(0,0,0,0.13))",
											borderRadius: 8,
											fontSize: 11,
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>

						<div className="flex flex-col gap-[7px]">
							{data.map((item) => (
								<div key={item.name} className="flex items-center gap-2">
									<Typography tag="span"
										className="size-2 shrink-0 rounded-full"
										style={{ background: item.color }}
									/>
									<Typography tag="span" className="flex-1 text-[12px] text-t-2">
										{item.name}
									</Typography>
									<Typography tag="span" className="text-[12px] font-medium text-t-1">
										{fmtMoney(item.totalCents)}
									</Typography>
									<Typography tag="span" className="w-[34px] text-right text-[11px] text-t-3">
										{item.value}%
									</Typography>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
