"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminCouponDetail } from "@/entities/admin-coupon";

const AVATAR_COLORS = [
	"bg-acc-bg text-acc-t",
	"bg-grn-bg text-grn-t",
	"bg-pur-bg text-pur-t",
	"bg-amb-bg text-amb-t",
];

const getInitials = (name: string, surname: string) =>
	(name[0] ?? "") + (surname[0] ?? "");

interface Props {
	coupon: AdminCouponDetail;
	sectionTitle: string;
}

export const CouponRedemptionsList = ({ coupon, sectionTitle }: Props) => {
	if (coupon.redemptions.length === 0) return null;

	return (
		<div className="border-b border-bd-1">
			<div className="px-[15px] pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{sectionTitle}
			</div>
			{coupon.redemptions.slice(0, 5).map((r, i) => {
				const initials = getInitials(r.user.name, r.user.surname);
				const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
				const plan = r.user.subscriptions?.[0]?.plan;

				return (
					<div
						key={r.id}
						className="flex items-center gap-2 border-b border-bd-1 px-[15px] py-1.5 text-[12px] last:border-b-0 hover:bg-surf-2"
					>
						<div
							className={cn(
								"flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
								colorClass,
							)}
						>
							{initials}
						</div>
						<div className="min-w-0 flex-1">
							<div className="truncate font-medium text-t-1">
								{r.user.name} {r.user.surname}
							</div>
							{plan && (
								<div className="text-[10.5px] text-t-3">
									{plan.charAt(0) + plan.slice(1).toLowerCase()}
								</div>
							)}
						</div>
						<div className="shrink-0 text-[10.5px] text-t-3">
							{new Date(r.createdAt).toLocaleDateString("ru-RU", {
								day: "numeric",
								month: "short",
							})}
						</div>
						{r.discountCents != null && (
							<div className="shrink-0 text-[11.5px] font-semibold text-grn-t">
								−{(r.discountCents / 100).toLocaleString("ru-RU")} ₽
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
