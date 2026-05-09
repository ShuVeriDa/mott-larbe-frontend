"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminCouponDetail } from "@/entities/admin-coupon";

const PLAN_STYLES: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const usageBarColor = (pct: number) => {
	if (pct >= 1) return "bg-red-t";
	if (pct >= 0.8) return "bg-amb";
	return "bg-acc";
};

const formatDate = (date: string | null | undefined) => {
	if (!date) return "—";
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

interface Props {
	coupon: AdminCouponDetail;
	labels: {
		sectionTitle: string;
		perUser: string;
		plans: string;
		validFrom: string;
		validUntil: string;
		usageOf: string;
		usageUnlimited: string;
		planAll: string;
	};
}

export const CouponUsageSection = ({ coupon, labels }: Props) => {
	const maxR = coupon.maxRedemptions;
	const pct = maxR ? Math.min(coupon.redeemedCount / maxR, 1) : 0;

	return (
		<div className="border-b border-bd-1 px-[15px] py-3">
			<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{labels.sectionTitle}
			</div>

			<div className="mb-2.5">
				<div className="mb-1.5 flex items-baseline justify-between">
					<Typography tag="span" className="text-[18px] font-bold text-t-1">
						{coupon.redeemedCount}
					</Typography>
					<Typography tag="span" className="text-[12px] text-t-3">
						{maxR
							? labels.usageOf.replace("{max}", String(maxR))
							: labels.usageUnlimited}
					</Typography>
				</div>
				{maxR && (
					<div className="h-[7px] overflow-hidden rounded-full bg-surf-3">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								usageBarColor(pct),
							)}
							style={{ width: `${pct * 100}%` }}
						/>
					</div>
				)}
			</div>

			<div className="space-y-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">
						{labels.perUser}
					</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">
						{coupon.maxPerUser ?? labels.usageUnlimited}
					</Typography>
				</div>
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">
						{labels.plans}
					</Typography>
					<div className="flex flex-wrap justify-end gap-1">
						{coupon.applicablePlans.length === 0 ? (
							<Typography tag="span" className="rounded bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
								{labels.planAll}
							</Typography>
						) : (
							coupon.applicablePlans.map(p => (
								<Typography tag="span"
									key={p}
									className={cn(
										"rounded px-1.5 py-0.5 text-[10px] font-semibold",
										PLAN_STYLES[p] ?? "bg-surf-3 text-t-2",
									)}
								>
									{p.charAt(0) + p.slice(1).toLowerCase()}
								</Typography>
							))
						)}
					</div>
				</div>
				{coupon.validFrom && (
					<div className="flex items-baseline justify-between gap-2">
						<Typography tag="span" className="text-[11.5px] text-t-3">
							{labels.validFrom}
						</Typography>
						<Typography tag="span" className="text-[12px] font-medium text-t-1">
							{formatDate(coupon.validFrom)}
						</Typography>
					</div>
				)}
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">
						{labels.validUntil}
					</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">
						{formatDate(coupon.validUntil)}
					</Typography>
				</div>
			</div>
		</div>
	);
};
