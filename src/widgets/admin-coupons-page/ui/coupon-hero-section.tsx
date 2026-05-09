"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminCouponDetail, CouponStatus } from "@/entities/admin-coupon";
import { ComponentProps } from "react";

const STATUS_STYLES: Record<CouponStatus, string> = {
	active: "bg-grn-bg text-grn-t",
	expired: "bg-amb-bg text-amb-t",
	exhausted: "bg-red-bg text-red-t",
	disabled: "bg-surf-3 text-t-2",
};

interface Props {
	coupon: AdminCouponDetail;
	copied: boolean;
	labels: {
		copy: string;
		copied: string;
		newUsersOnly: string;
		stackable: string;
		discount: string;
		discountFixed: string;
	};
	statusLabels: Record<CouponStatus, string>;
	onCopy: () => void;
	t: (key: string) => string;
}

export const CouponHeroSection = ({
	coupon,
	copied,
	labels,
	statusLabels,
	onCopy,
	t,
}: Props) => {
	const handleCopy: NonNullable<ComponentProps<"div">["onClick"]> = () => onCopy();

	return (
		<div className="border-b border-bd-1 px-[15px] py-4">
			<div
				onClick={handleCopy}
				className={cn(
					"mb-3 flex cursor-pointer items-center justify-between rounded-[9px] border px-3.5 py-2 transition-colors",
					copied
						? "border-grn bg-grn-bg"
						: "border-bd-2 bg-surf-2 hover:border-acc",
				)}
			>
				<Typography tag="span"
					className={cn(
						"font-mono text-[17px] font-extrabold tracking-[1.5px]",
						copied ? "text-grn-t" : "text-t-1",
					)}
				>
					{coupon.code}
				</Typography>
				<Typography tag="span"
					className={cn(
						"flex items-center gap-1 text-[11px] font-medium",
						copied ? "text-grn-t" : "text-t-3",
					)}
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<rect x="4" y="1" width="7" height="7" rx="1.2" />
						<path d="M1 4v6a1 1 0 001 1h6" strokeLinecap="round" />
					</svg>
					{copied ? labels.copied : labels.copy}
				</Typography>
			</div>

			<div className="mb-2.5 flex flex-wrap gap-1.5">
				<Typography tag="span"
					className={cn(
						"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
						STATUS_STYLES[coupon.computedStatus],
					)}
				>
					{coupon.computedStatus === "active" && (
						<Typography tag="span" className="size-[5px] rounded-full bg-grn" />
					)}
					{statusLabels[coupon.computedStatus] || t(`admin.coupons.status.${coupon.computedStatus}`)}
				</Typography>
				{coupon.newUsersOnly && (
					<Typography tag="span" className="rounded-[5px] bg-pur-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-pur-t">
						{labels.newUsersOnly}
					</Typography>
				)}
				{coupon.isStackable && (
					<Typography tag="span" className="rounded-[5px] bg-acc-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-acc-t">
						{labels.stackable}
					</Typography>
				)}
			</div>

			<div className="text-[26px] font-bold leading-none text-t-1">
				{coupon.amount}
				{coupon.type === "PERCENT" ? "%" : " ₽"}
			</div>
			<div className="mt-1 text-[11.5px] text-t-3">
				{coupon.type === "PERCENT"
					? labels.discount.replace("{amount}", String(coupon.amount))
					: labels.discountFixed.replace("{amount}", String(coupon.amount))}
			</div>
		</div>
	);
};
