"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import type { AdminDashboardBilling } from "@/entities/admin-dashboard";

const formatAmount = (cents: number, currency: string) => {
	const amount = cents / 100;
	if (currency === "RUB") return `₽${Math.round(amount).toLocaleString("ru-RU")}`;
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
};

const formatDate = (iso: string) => {
	const d = new Date(iso);
	const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
	return `${d.getDate()} ${months[d.getMonth()]}`;
};

const PLAN_COLORS: Record<string, string> = {
	FREE: "var(--surf-4)",
	PRO: "var(--acc)",
	LIFETIME: "var(--pur)",
	PREMIUM: "var(--grn)",
};

interface DashboardBillingCardProps {
	billing: AdminDashboardBilling;
}

export const DashboardBillingCard = ({ billing }: DashboardBillingCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	const totalSubs = billing.plans.reduce((s, p) => s + p.activeSubscriptions, 0) || 1;

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.billing.title")}
				</Typography>
				<Link
					href={`/${params.lang}/admin/billing`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("admin.dashboard.billing.detail")}
				</Link>
			</div>
			<div className="px-4 pt-3 pb-1">
				<div className="mb-3 space-y-2.5">
					{billing.plans.map((plan) => {
						const pct = Math.round((plan.activeSubscriptions / totalSubs) * 100);
						const color = PLAN_COLORS[plan.type] ?? "var(--t-3)";
						return (
							<div key={plan.id}>
								<div className="flex min-w-0 items-baseline justify-between gap-2">
									<Typography tag="span" className="min-w-0 truncate text-[11.5px] text-t-2">{plan.name}</Typography>
									<Typography tag="span" className="shrink-0 text-[11.5px] font-semibold text-t-1">
										{plan.activeSubscriptions.toLocaleString("ru-RU")}{" "}
										<Typography tag="span" className="font-normal text-t-3">
											{t("admin.dashboard.billing.users")}
										</Typography>
									</Typography>
								</div>
								<div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surf-3">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{ width: `${Math.max(pct, 1)}%`, background: color }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{billing.recentPayments.length > 0 && (
				<div className="border-t border-bd-1 px-4 pb-4 pt-3">
					<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("admin.dashboard.billing.recentPayments")}
					</div>
					<table className="w-full border-collapse text-[12.5px]">
						<thead>
							<tr>
								<th className="pb-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
									{t("admin.dashboard.billing.user")}
								</th>
								<th className="pb-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
									{t("admin.dashboard.billing.amount")}
								</th>
								<th className="pb-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
									{t("admin.dashboard.billing.date")}
								</th>
							</tr>
						</thead>
						<tbody>
							{billing.recentPayments.map((payment) => (
								<tr key={payment.id} className="border-t border-bd-1">
									<td className="py-2 text-t-1">{payment.userName}</td>
									<td className="py-2 text-right font-medium text-grn-t">
										{formatAmount(payment.amountCents, payment.currency)}
									</td>
									<td className="py-2 text-right text-[11.5px] text-t-3">
										{formatDate(payment.createdAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export const DashboardBillingCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
			<div className="h-3.5 w-40 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 py-3 space-y-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i}>
					<div className="mb-1.5 flex justify-between">
						<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
						<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
					</div>
					<div className="h-1 animate-pulse rounded-full bg-surf-3" />
				</div>
			))}
		</div>
	</div>
);
