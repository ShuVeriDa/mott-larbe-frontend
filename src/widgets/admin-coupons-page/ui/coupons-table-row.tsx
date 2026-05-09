"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, MouseEvent, useState } from 'react';
import type { AdminCouponListItem } from "@/entities/admin-coupon";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

const PLAN_STYLES: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const STATUS_STYLES: Record<string, string> = {
	active: "bg-grn-bg text-grn-t",
	inactive: "bg-surf-3 text-t-2",
	expired: "bg-surf-3 text-t-3",
};

const formatDate = (iso: string | null) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

const usageColor = (redeemed: number, max: number) => {
	const pct = (redeemed / max) * 100;
	if (pct < 50) return "bg-grn";
	if (pct < 80) return "bg-amb";
	return "bg-red";
};

const CouponCodeChip = ({ code }: { code: string }) => {
	const [copied, setCopied] = useState(false);
	const { t } = useI18n();

	const handleCopy = (e: MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	return (
		<Typography tag="span"
			onClick={handleCopy}
			title={copied ? t("admin.coupons.table.copied") : t("admin.coupons.detail.copy")}
			className={cn(
				"inline-flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2 py-0.5 font-mono text-[12px] font-bold tracking-[0.5px] transition-colors",
				copied
					? "border-grn bg-grn-bg text-grn-t"
					: "border-bd-2 bg-surf-2 text-t-1 hover:border-bd-3 hover:bg-surf-3",
			)}
		>
			{code}
			<svg className="size-[11px] shrink-0 text-t-4" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
				<rect x="4" y="1" width="7" height="7" rx="1.2" />
				<path d="M1 4v6a1 1 0 001 1h6" strokeLinecap="round" />
			</svg>
		</Typography>
	);
};

interface CouponRowProps {
	item: AdminCouponListItem;
	isSelected: boolean;
	onSelectRow: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const CouponRow = ({
	item,
	isSelected,
	onSelectRow,
	onEdit,
	onDelete,
	t,
}: CouponRowProps) => {
	const maxR = item.maxRedemptions;
	const pct = maxR ? Math.min((item.redeemedCount / maxR) * 100, 100) : 0;

	const handleRowClick: NonNullable<ComponentProps<"tr">["onClick"]> = () => onSelectRow(item.id);
	const handleEditClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onEdit(item.id); };
	const handleDeleteClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onDelete(item.id); };

	return (
		<tr
			onClick={handleRowClick}
			className={cn(
				"cursor-pointer border-b border-bd-1 transition-colors last:border-b-0",
				isSelected ? "bg-acc-bg" : "hover:bg-surf-2",
			)}
		>
			{/* Code */}
			<td className="px-3.5 py-2.5">
				<CouponCodeChip code={item.code} />
			</td>

			{/* Name */}
			<td className="max-w-[140px] px-3.5 py-2.5">
				<Typography tag="span" className="block truncate text-t-2">{item.name ?? "—"}</Typography>
			</td>

			{/* Discount */}
			<td className="px-3.5 py-2.5">
				<Typography tag="span" className="text-[13.5px] font-bold text-t-1">
					{item.amount}
				</Typography>
				<Typography tag="span" className="ml-0.5 text-[10.5px] text-t-3">
					{item.type === "PERCENT" ? "%" : "₽"}
				</Typography>
			</td>

			{/* Plans */}
			<td className="px-3.5 py-2.5 max-md:hidden">
				{item.applicablePlans.length === 0 ? (
					<Typography tag="span" className="rounded bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
						{t("admin.coupons.table.planAll")}
					</Typography>
				) : (
					<div className="flex flex-wrap gap-1">
						{item.applicablePlans.slice(0, 3).map((p) => (
							<Typography tag="span"
								key={p}
								className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", PLAN_STYLES[p] ?? "bg-surf-3 text-t-2")}
							>
								{p.charAt(0) + p.slice(1).toLowerCase()}
							</Typography>
						))}
						{item.applicablePlans.length > 3 && (
							<Typography tag="span" className="rounded bg-surf-3 px-1.5 py-0.5 text-[10px] text-t-3">
								+{item.applicablePlans.length - 3}
							</Typography>
						)}
					</div>
				)}
			</td>

			{/* Uses */}
			<td className="px-3.5 py-2.5 max-sm:hidden">
				<div className="flex items-center gap-2">
					{maxR && (
						<div className="h-[5px] min-w-[50px] flex-1 overflow-hidden rounded-full bg-surf-3 max-md:hidden">
							<div
								className={cn("h-full rounded-full transition-all", usageColor(item.redeemedCount, maxR))}
								style={{ width: `${pct}%` }}
							/>
						</div>
					)}
					<Typography tag="span" className="whitespace-nowrap text-[11.5px] font-medium text-t-2">
						{item.redeemedCount}
						{maxR ? ` / ${maxR}` : ""}
					</Typography>
				</div>
			</td>

			{/* Valid until */}
			<td className="px-3.5 py-2.5 text-[12px] text-t-3 max-sm:hidden">
				{formatDate(item.validUntil)}
			</td>

			{/* Status */}
			<td className="px-3.5 py-2.5">
				<Typography tag="span" className={cn("inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold", STATUS_STYLES[item.computedStatus])}>
					{item.computedStatus === "active" && (
						<Typography tag="span" className="size-[5px] rounded-full bg-grn" />
					)}
					{t(`admin.coupons.status.${item.computedStatus}`)}
				</Typography>
			</td>

			{/* Actions */}
			<td className="px-3.5 py-2.5">
				<div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 [tr:hover_&]:opacity-100 [tr.bg-acc-bg_&]:opacity-100">
					<Button
						onClick={handleEditClick}
						className="flex h-6 items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						{t("admin.coupons.table.edit")}
					</Button>
					<Button
						onClick={handleDeleteClick}
						className="flex h-6 items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
					>
						{t("admin.coupons.table.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};
