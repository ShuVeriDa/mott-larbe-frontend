"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import type { AdminSubscriptionListItem, BillingSubscriptionStatus } from "@/entities/admin-billing";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/format-date";

const STATUS_CLASS: Record<BillingSubscriptionStatus, string> = {
	ACTIVE: "bg-grn-bg text-grn-t",
	TRIALING: "bg-acc-bg text-acc-t",
	CANCELED: "bg-surf-3 text-t-2",
	EXPIRED: "bg-red-bg text-red-t",
};

const fmtAmount = (cents: number, currency: string | null | undefined) => {
	const amount = cents / 100;
	if (!currency) return `${Math.round(amount).toLocaleString("ru-RU")}`;
	if (currency === "RUB") return `₽${Math.round(amount).toLocaleString("ru-RU")}`;
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
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
		<AdminCard>
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
				<Table className="border-collapse text-[12.5px]" aria-label={t("admin.plans.subscriptions.title")}>
					<TableHeader>
						<TableRow>
							<TableHead className="border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								ID
							</TableHead>
							<TableHead className="border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.user")}
							</TableHead>
							<TableHead className="border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.plan")}
							</TableHead>
							<TableHead className="hidden border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3 lg:table-cell">
								{t("admin.plans.subscriptions.provider")}
							</TableHead>
							<TableHead className="border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.amount")}
							</TableHead>
							<TableHead className="border-b border-bd-1 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
								{t("admin.plans.subscriptions.status")}
							</TableHead>
							<TableHead className="hidden border-b border-bd-1 px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-[0.4px] text-t-3 lg:table-cell">
								{t("admin.plans.subscriptions.date")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i} className="border-b border-bd-1 last:border-b-0">
									{Array.from({ length: 7 }).map((_, j) => (
										<TableCell key={j} className="px-4 py-3">
											<div className="h-3 animate-pulse rounded bg-surf-3" />
										</TableCell>
									))}
								</TableRow>
							))
						) : items.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="px-4 py-6 text-center text-[12.5px] text-t-3">
									{t("admin.plans.subscriptions.noData")}
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow
									key={item.id}
									className="border-b border-bd-1 last:border-b-0"
								>
									<TableCell className="px-4 py-2.5">
										<Typography tag="span" className="font-mono text-[11px] text-t-3">
											{item.id.slice(0, 8)}…
										</Typography>
									</TableCell>
									<TableCell className="px-4 py-2.5">
										<div className="text-t-1">{item.user.name}</div>
										<div className="text-[11px] text-t-3">{item.user.email}</div>
									</TableCell>
									<TableCell className="px-4 py-2.5 text-t-1">{item.plan.name}</TableCell>
									<TableCell className="hidden px-4 py-2.5 lg:table-cell">
										{item.provider ? (
											<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] border border-bd-2 bg-surf-2 px-1.5 py-0.5 text-[11px] font-medium text-t-2">
												<Typography tag="span" className="size-1.5 rounded-full bg-acc" />
												{item.provider}
											</Typography>
										) : (
											<Typography tag="span" className="text-t-3">—</Typography>
										)}
									</TableCell>
									<TableCell className="px-4 py-2.5 font-medium text-t-1">
										{fmtAmount(item.amountCents, item.currency)}
									</TableCell>
									<TableCell className="px-4 py-2.5">
										<Typography tag="span"
											className={cn(
												"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
												STATUS_CLASS[item.status],
											)}
										>
											{t(`admin.plans.status.${item.status.toLowerCase()}`)}
										</Typography>
									</TableCell>
									<TableCell className="hidden px-4 py-2.5 text-right text-[11.5px] text-t-3 lg:table-cell">
										{formatDate(item.createdAt)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</AdminCard>
	);
};
