"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import type { AdminSubscriptionListItem, BillingSubscriptionStatus } from "@/entities/admin-billing";
import { cn } from "@/shared/lib/cn";

const STATUS_CLASS: Record<BillingSubscriptionStatus, string> = {
	ACTIVE: "bg-grn-bg text-grn-t",
	TRIALING: "bg-acc-bg text-acc-t",
	CANCELED: "bg-surf-3 text-t-2",
	EXPIRED: "bg-red-bg text-red-t",
};

const fmtAmount = (cents: number, currency: string) => {
	const amount = cents / 100;
	if (currency === "RUB") return `₽${Math.round(amount).toLocaleString("ru-RU")}`;
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
};

const fmtDate = (iso: string) => {
	const d = new Date(iso);
	return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

interface BillingSubscriptionsTableProps {
	items: AdminSubscriptionListItem[];
	total: number;
	activeCount: number;
	isLoading: boolean;
}

export const BillingSubscriptionsTable = ({
	items,
	total,
	activeCount,
	isLoading,
}: BillingSubscriptionsTableProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<div className="flex items-center gap-2">
					<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
						{t("admin.plans.subscriptions.title")}
					</Typography>
					<Typography tag="span" className="rounded-[5px] bg-surf-2 px-1.5 py-px text-[10.5px] font-medium text-t-3">
						{total.toLocaleString("ru-RU")}
					</Typography>
					{activeCount > 0 && (
						<Typography tag="span" className="rounded-[5px] bg-grn-bg px-1.5 py-px text-[10.5px] font-semibold text-grn-t">
							{activeCount.toLocaleString("ru-RU")} {t("admin.plans.subscriptions.active")}
						</Typography>
					)}
				</div>
				<Link
					href={`/${params.lang}/admin/payments`}
					className="text-[11.5px] text-acc-t transition-opacity hover:opacity-75"
				>
					{t("admin.plans.subscriptions.allTransactions")}
				</Link>
			</div>

			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
				<table className="w-full border-collapse text-[12.5px]">
					<thead>
						<tr>
							<th className="border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								ID
							</th>
							<th className="border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.user")}
							</th>
							<th className="border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.plan")}
							</th>
							<th className="hidden border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3 lg:table-cell">
								{t("admin.plans.subscriptions.provider")}
							</th>
							<th className="border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.amount")}
							</th>
							<th className="border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.status")}
							</th>
							<th className="hidden border-b border-bd-1 px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-[0.4px] text-t-3 lg:table-cell">
								{t("admin.plans.subscriptions.date")}
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className="border-b border-bd-1 last:border-b-0">
									{Array.from({ length: 7 }).map((_, j) => (
										<td key={j} className="px-4 py-3">
											<div className="h-3 animate-pulse rounded bg-surf-3" />
										</td>
									))}
								</tr>
							))
						) : items.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-6 text-center text-[12.5px] text-t-3">
									{t("admin.plans.subscriptions.noData")}
								</td>
							</tr>
						) : (
							items.map((item) => (
								<tr
									key={item.id}
									className="border-b border-bd-1 last:border-b-0"
								>
									<td className="px-4 py-2.5">
										<Typography tag="span" className="font-mono text-[11px] text-t-3">
											{item.id.slice(0, 8)}…
										</Typography>
									</td>
									<td className="px-4 py-2.5">
										<div className="text-t-1">{item.user.name}</div>
										<div className="text-[11px] text-t-3">{item.user.email}</div>
									</td>
									<td className="px-4 py-2.5 text-t-1">{item.plan.name}</td>
									<td className="hidden px-4 py-2.5 lg:table-cell">
										{item.provider ? (
											<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] border border-bd-2 bg-surf-2 px-1.5 py-0.5 text-[11px] font-medium text-t-2">
												<Typography tag="span" className="size-1.5 rounded-full bg-acc" />
												{item.provider}
											</Typography>
										) : (
											<Typography tag="span" className="text-t-3">—</Typography>
										)}
									</td>
									<td className="px-4 py-2.5 font-medium text-t-1">
										{fmtAmount(item.amountCents, item.currency)}
									</td>
									<td className="px-4 py-2.5">
										<Typography tag="span"
											className={cn(
												"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
												STATUS_CLASS[item.status],
											)}
										>
											{t(`admin.plans.status.${item.status.toLowerCase()}`)}
										</Typography>
									</td>
									<td className="hidden px-4 py-2.5 text-right text-[11.5px] text-t-3 lg:table-cell">
										{fmtDate(item.createdAt)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
