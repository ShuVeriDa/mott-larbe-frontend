"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { useAdminUserSubscription } from "@/entities/admin-user/model/use-admin-user-subscription";
import type { PaymentStatus } from "@/entities/admin-user";
import { cn } from "@/shared/lib/cn";

interface UserSubscriptionCardProps {
	subscription: ReturnType<typeof useAdminUserSubscription>;
}

const formatAmount = (cents: number, currency: string) => {
	const amount = cents / 100;
	const symbol = currency === "RUB" ? "₽" : currency === "USD" ? "$" : currency;
	return `${symbol}${amount.toLocaleString("ru-RU")}`;
};

const paymentStatusStyle: Record<PaymentStatus, string> = {
	SUCCEEDED: "bg-grn-bg text-grn-t",
	PENDING: "bg-amb-bg text-amb-t",
	FAILED: "bg-red-bg text-red-t",
	REFUNDED: "bg-surf-3 text-t-2",
};

export const UserSubscriptionCard = ({ subscription }: UserSubscriptionCardProps) => {
	const { t } = useI18n();
	const { query, cancel } = subscription;
	const data = query.data;

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex items-center justify-between border-b border-bd-1 px-3.5 py-3">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.userDetail.subscription.title")}
				</span>
				<button className="border-none bg-transparent p-0 text-[11.5px] text-acc-t transition-opacity hover:opacity-70">
					{t("admin.userDetail.subscription.manage")}
				</button>
			</div>

			<div className="p-3.5">
				{query.isLoading ? (
					<div className="space-y-2">
						<div className="h-16 animate-pulse rounded-lg bg-surf-3" />
						<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
						<div className="space-y-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-3 w-full animate-pulse rounded bg-surf-3" />
							))}
						</div>
					</div>
				) : (
					<>
						{data?.current ? (
							<div className="mb-3 flex items-start gap-2.5 rounded-lg border border-bd-2 bg-surf-2 p-3">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-pur-bg">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
										<path
											d="M8 2l1.8 3.6L14 6.2l-3 2.9.7 4.1L8 11.2l-3.7 1.9.7-4.1-3-2.9 4.2-.6z"
											stroke="var(--pur-t)"
											strokeWidth="1.3"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<div className="text-[13.5px] font-semibold text-t-1">
										{data.current.planName}
									</div>
									<div className="text-[11.5px] text-t-3">
										{data.current.status === "ACTIVE"
											? t("admin.userDetail.subscription.active")
											: data.current.status}{" "}
										{data.current.endDate &&
											`· ${t("admin.userDetail.subscription.until", {
												date: new Date(data.current.endDate).toLocaleDateString("ru-RU", {
													day: "numeric",
													month: "short",
													year: "numeric",
												}),
											})}`}{" "}
										· {formatAmount(data.current.priceCents, data.current.currency)}
										{data.current.interval === "year" ? "/год" : data.current.interval === "month" ? "/мес" : ""}
									</div>
								</div>
								<div className="flex gap-1">
									<button className="flex h-[26px] items-center rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1">
										{t("admin.userDetail.subscription.extend")}
									</button>
									<button
										onClick={() => cancel.mutate(data.current!.id)}
										disabled={cancel.isPending}
										className="flex h-[26px] items-center rounded-base border border-red/25 bg-transparent px-2.5 text-[11.5px] font-medium text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
									>
										{t("admin.userDetail.subscription.cancel")}
									</button>
								</div>
							</div>
						) : (
							<p className="mb-3 text-[12.5px] text-t-3">
								{t("admin.userDetail.subscription.noSubscription")}
							</p>
						)}

						{data?.paymentHistory && data.paymentHistory.length > 0 && (
							<>
								<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
									{t("admin.userDetail.subscription.history")}
								</div>
								<div>
									{data.paymentHistory.map((payment) => (
										<div
											key={payment.id}
											className="flex items-center gap-2 border-b border-bd-1 py-1.5 text-[12.5px] last:border-b-0 last:pb-0 first:pt-0"
										>
											<span
												className={cn(
													"rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold",
													paymentStatusStyle[payment.status],
												)}
											>
												{payment.status}
											</span>
											<span className="flex-1 font-medium text-t-1">
												{payment.planName ?? "—"}
											</span>
											<span
												className={cn(
													"text-[12px] font-medium",
													payment.status === "REFUNDED"
														? "text-t-3"
														: "text-grn-t",
												)}
											>
												{formatAmount(payment.amountCents, payment.currency)}
											</span>
											<span className="text-[11px] text-t-3">
												{new Date(payment.createdAt).toLocaleDateString("ru-RU", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</span>
										</div>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};
