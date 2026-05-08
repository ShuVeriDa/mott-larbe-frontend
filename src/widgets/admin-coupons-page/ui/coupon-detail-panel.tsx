"use client";

import type { AdminCouponDetail, CouponStatus } from "@/entities/admin-coupon";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useState } from "react";

interface Props {
	coupon: AdminCouponDetail;
	isLoading: boolean;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onDeactivate: (id: string) => Promise<void>;
	onActivate: (id: string) => Promise<void>;
}

const PLAN_STYLES: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const STATUS_STYLES: Record<CouponStatus, string> = {
	active: "bg-grn-bg text-grn-t",
	expired: "bg-amb-bg text-amb-t",
	exhausted: "bg-red-bg text-red-t",
	disabled: "bg-surf-3 text-t-2",
};

const formatDate = (date: string | null | undefined) => {
	if (!date) return "—";
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const usageBarColor = (pct: number) => {
	if (pct >= 1) return "bg-red-t";
	if (pct >= 0.8) return "bg-amb";
	return "bg-acc";
};

const getInitials = (name: string, surname: string) =>
	(name[0] ?? "") + (surname[0] ?? "");

const AVATAR_COLORS = [
	"bg-acc-bg text-acc-t",
	"bg-grn-bg text-grn-t",
	"bg-pur-bg text-pur-t",
	"bg-amb-bg text-amb-t",
];

export const CouponDetailPanel = ({
	coupon,
	isLoading,
	onEdit,
	onDelete,
	onDeactivate,
	onActivate,
}: Props) => {
	const { t } = useI18n();
	const [copied, setCopied] = useState(false);
	const [toggling, setToggling] = useState(false);

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
				<div className="space-y-3 p-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="h-4 animate-pulse rounded bg-surf-3"
							style={{ width: `${[90, 60, 75, 50, 80][i]}%` }}
						/>
					))}
				</div>
			</div>
		);
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(coupon.code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	const handleToggle = async () => {
		setToggling(true);
		try {
			if (coupon.computedStatus === "disabled") {
				await onActivate(coupon.id);
			} else {
				await onDeactivate(coupon.id);
			}
		} finally {
			setToggling(false);
		}
	};

	const maxR = coupon.maxRedemptions;
	const pct = maxR ? Math.min(coupon.redeemedCount / maxR, 1) : 0;

	return (
		<div className="flex flex-col gap-0 overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
			{/* Hero */}
			<div className="border-b border-bd-1 px-[15px] py-4">
				{/* Code display */}
				<div
					onClick={handleCopy}
					className={cn(
						"mb-3 flex cursor-pointer items-center justify-between rounded-[9px] border px-3.5 py-2 transition-colors",
						copied
							? "border-grn bg-grn-bg"
							: "border-bd-2 bg-surf-2 hover:border-acc",
					)}
				>
					<span
						className={cn(
							"font-mono text-[17px] font-extrabold tracking-[1.5px]",
							copied ? "text-grn-t" : "text-t-1",
						)}
					>
						{coupon.code}
					</span>
					<span
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
						{copied
							? t("admin.coupons.detail.copied")
							: t("admin.coupons.detail.copy")}
					</span>
				</div>

				{/* Badges */}
				<div className="mb-2.5 flex flex-wrap gap-1.5">
					<span
						className={cn(
							"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
							STATUS_STYLES[coupon.computedStatus],
						)}
					>
						{coupon.computedStatus === "active" && (
							<span className="size-[5px] rounded-full bg-grn" />
						)}
						{t(`admin.coupons.status.${coupon.computedStatus}`)}
					</span>
					{coupon.newUsersOnly && (
						<span className="rounded-[5px] bg-pur-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-pur-t">
							{t("admin.coupons.detail.newUsersOnly")}
						</span>
					)}
					{coupon.isStackable && (
						<span className="rounded-[5px] bg-acc-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-acc-t">
							{t("admin.coupons.detail.stackable")}
						</span>
					)}
				</div>

				{/* Value */}
				<div className="text-[26px] font-bold leading-none text-t-1">
					{coupon.amount}
					{coupon.type === "PERCENT" ? "%" : " ₽"}
				</div>
				<div className="mt-1 text-[11.5px] text-t-3">
					{coupon.type === "PERCENT"
						? t("admin.coupons.detail.discount").replace(
								"{amount}",
								String(coupon.amount),
							)
						: t("admin.coupons.detail.discountFixed").replace(
								"{amount}",
								String(coupon.amount),
							)}
				</div>
			</div>

			{/* Usage section */}
			<div className="border-b border-bd-1 px-[15px] py-3">
				<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("admin.coupons.detail.usageSection")}
				</div>

				<div className="mb-2.5">
					<div className="mb-1.5 flex items-baseline justify-between">
						<span className="text-[18px] font-bold text-t-1">
							{coupon.redeemedCount}
						</span>
						<span className="text-[12px] text-t-3">
							{maxR
								? t("admin.coupons.detail.usageOf").replace(
										"{max}",
										String(maxR),
									)
								: t("admin.coupons.detail.usageUnlimited")}
						</span>
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
						<span className="text-[11.5px] text-t-3">
							{t("admin.coupons.detail.perUser")}
						</span>
						<span className="text-[12px] font-medium text-t-1">
							{coupon.maxPerUser ?? t("admin.coupons.detail.usageUnlimited")}
						</span>
					</div>
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11.5px] text-t-3">
							{t("admin.coupons.detail.plans")}
						</span>
						<div className="flex flex-wrap justify-end gap-1">
							{coupon.applicablePlans.length === 0 ? (
								<span className="rounded bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
									{t("admin.coupons.table.planAll")}
								</span>
							) : (
								coupon.applicablePlans.map(p => (
									<span
										key={p}
										className={cn(
											"rounded px-1.5 py-0.5 text-[10px] font-semibold",
											PLAN_STYLES[p] ?? "bg-surf-3 text-t-2",
										)}
									>
										{p.charAt(0) + p.slice(1).toLowerCase()}
									</span>
								))
							)}
						</div>
					</div>
					{coupon.validFrom && (
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">
								{t("admin.coupons.detail.validFrom")}
							</span>
							<span className="text-[12px] font-medium text-t-1">
								{formatDate(coupon.validFrom)}
							</span>
						</div>
					)}
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11.5px] text-t-3">
							{t("admin.coupons.detail.validUntil")}
						</span>
						<span className="text-[12px] font-medium text-t-1">
							{formatDate(coupon.validUntil)}
						</span>
					</div>
				</div>
			</div>

			{/* Last redemptions */}
			{coupon.redemptions.length > 0 && (
				<div className="border-b border-bd-1">
					<div className="px-[15px] pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("admin.coupons.detail.redemptionsSection")}
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
			)}

			{/* Actions */}
			<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
				<button
					type="button"
					onClick={() => onEdit(coupon.id)}
					className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path
							d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.coupons.detail.edit")}
				</button>

				<button
					type="button"
					onClick={handleCopy}
					className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<rect x="4" y="1" width="7" height="7" rx="1.2" />
						<path d="M1 4v6a1 1 0 001 1h6" strokeLinecap="round" />
					</svg>
					{t("admin.coupons.detail.copyCode")}
				</button>

				{(coupon.computedStatus === "active" ||
					coupon.computedStatus === "disabled") && (
					<button
						type="button"
						disabled={toggling}
						onClick={handleToggle}
						className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-50"
					>
						<svg
							className="size-3 shrink-0 text-t-3"
							viewBox="0 0 12 12"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.3"
						>
							<circle cx="6" cy="6" r="5" />
							<path d="M4 6h4M6 4v4" strokeLinecap="round" />
						</svg>
						{coupon.computedStatus === "disabled"
							? t("admin.coupons.detail.activate")
							: t("admin.coupons.detail.deactivate")}
					</button>
				)}

				<button
					type="button"
					onClick={() => onDelete(coupon.id)}
					className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[11.5px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
				>
					<svg
						className="size-3 shrink-0 text-red-t"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path
							d="M2 3h8M4 3V2h4v1M5 5.5v3M7 5.5v3M3 3l.6 7h4.8L9 3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.coupons.detail.delete")}
				</button>
			</div>
		</div>
	);
};
