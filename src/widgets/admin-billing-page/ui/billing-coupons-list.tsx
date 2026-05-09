"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminCoupon } from "@/entities/admin-billing";

const STATUS_BADGE: Record<string, string> = {
	active: "bg-grn-bg text-grn-t",
	expired: "bg-surf-3 text-t-2",
	exhausted: "bg-amb-bg text-amb-t",
	disabled: "bg-surf-3 text-t-3",
};

interface BillingCouponsListProps {
	coupons: AdminCoupon[];
	isLoading: boolean;
	onAdd: () => void;
	onDelete: (id: string) => void;
}

export const BillingCouponsList = ({
	coupons,
	isLoading,
	onAdd,
	onDelete,
}: BillingCouponsListProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<span className="text-[12.5px] font-semibold text-t-1">
					{t("admin.plans.coupons.title")}
				</span>
				<button
					onClick={onAdd}
					className="bg-transparent text-[11.5px] text-acc-t transition-opacity hover:opacity-75"
				>
					{t("admin.plans.coupons.add")}
				</button>
			</div>

			{isLoading ? (
				<div className="space-y-px p-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-12 animate-pulse rounded-lg bg-surf-3" />
					))}
				</div>
			) : coupons.length === 0 ? (
				<div className="px-4 py-6 text-center text-[12.5px] text-t-3">
					{t("admin.plans.coupons.empty")}
				</div>
			) : (
				<div>
					{coupons.map((coupon) => {
						const discountLabel =
							coupon.type === "PERCENT"
								? `−${coupon.amount}%`
								: `−${(coupon.amount / 100).toLocaleString("ru-RU")} ₽`;

						const usesLabel =
							coupon.maxRedemptions !== null && coupon.maxRedemptions !== undefined
								? `${coupon.redeemedCount}/${coupon.maxRedemptions} ${t("admin.plans.coupons.uses")}`
								: `${coupon.redeemedCount} ${t("admin.plans.coupons.uses")} · ${t("admin.plans.coupons.unlimited")}`;

						const badgeClass =
							STATUS_BADGE[coupon.computedStatus] ?? "bg-surf-3 text-t-2";

												const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(coupon.id);
return (
							<div
								key={coupon.id}
								className="flex items-center gap-3 border-b border-bd-1 px-4 py-2.5 last:border-b-0"
							>
								<code className="shrink-0 rounded-[5px] border border-bd-2 bg-surf-2 px-2 py-0.5 font-mono text-[12px] font-semibold text-t-1">
									{coupon.code}
								</code>
								<div className="min-w-0 flex-1">
									<div className="truncate text-[12.5px] text-t-1">
										{coupon.name ?? coupon.code}
									</div>
									<div className="mt-0.5 text-[11px] text-t-3">{usesLabel}</div>
								</div>
								<span className="shrink-0 text-[13px] font-semibold text-grn-t">
									{discountLabel}
								</span>
								<span
									className={`shrink-0 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold ${badgeClass}`}
								>
									{coupon.computedStatus}
								</span>
								<div className="flex shrink-0 gap-1">
									<button
										onClick={handleClick}
										className="flex h-[26px] items-center rounded-[6px] border border-bd-2 bg-surf-2 px-2.5 text-[11.5px] font-medium text-red-t transition-colors hover:border-red-bg hover:bg-red-bg"
									>
										{t("admin.plans.coupons.delete")}
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
