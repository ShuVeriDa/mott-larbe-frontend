"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps, MouseEvent, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminCouponListItem, CouponStatus } from "@/entities/admin-coupon";
import type { CouponSortBy } from "../model/use-admin-coupons-page";

interface Props {
	items: AdminCouponListItem[];
	selectedId: string | null;
	isLoading: boolean;
	sortBy: CouponSortBy;
	sortOrder: "asc" | "desc";
	onSelectRow: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onSortChange: (sortBy: CouponSortBy) => void;
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
	return new Date(date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "2-digit" });
};

const usageColor = (redeemed: number, max: number | null | undefined) => {
	if (!max) return "bg-acc";
	const pct = redeemed / max;
	if (pct >= 1) return "bg-red-t";
	if (pct >= 0.8) return "bg-amb";
	return "bg-acc";
};

const SortIcon = ({ active, order }: { active: boolean; order: "asc" | "desc" }) => (
	<svg
		className={cn("ml-0.5 inline size-[9px] shrink-0", active ? "text-acc" : "text-t-4")}
		viewBox="0 0 8 10"
		fill="currentColor"
	>
		{active && order === "asc" ? (
			<path d="M4 0L7.46 5H.54L4 0z" />
		) : active && order === "desc" ? (
			<path d="M4 10L.54 5h6.92L4 10z" />
		) : (
			<>
				<path d="M4 0L7.46 4H.54L4 0z" opacity=".3" />
				<path d="M4 10L.54 6h6.92L4 10z" opacity=".3" />
			</>
		)}
	</svg>
);

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

const SkeletonRow = () => (
	<tr className="border-b border-bd-1">
		{Array.from({ length: 8 }).map((_, i) => (
			<td key={i} className="px-3.5 py-2.5">
				<div className="h-4 animate-pulse rounded bg-surf-3" style={{ width: `${[80, 100, 60, 70, 90, 70, 60, 50][i]}px` }} />
			</td>
		))}
	</tr>
);

export const CouponsTable = ({
	items,
	selectedId,
	isLoading,
	sortBy,
	sortOrder,
	onSelectRow,
	onEdit,
	onDelete,
	onSortChange,
}: Props) => {
	const { t } = useI18n();

	const renderSortableTh = (key: CouponSortBy, label: string, extraClass?: string) => {
	  const handleClick: NonNullable<ComponentProps<"th">["onClick"]> = () => onSortChange(key);
	  return (
		<th
			key={key}
			onClick={handleClick}
			className={cn(
				"cursor-pointer select-none whitespace-nowrap px-3.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 hover:text-t-1",
				extraClass,
			)}
		>
			{label}
			<SortIcon active={sortBy === key} order={sortOrder} />
		</th>
	);
	};

	const renderStaticTh = (label: string, extraClass?: string) => (
		<th
			key={label}
			className={cn(
				"whitespace-nowrap px-3.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3",
				extraClass,
			)}
		>
			{label}
		</th>
	);

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="border-b border-bd-1">
						{renderSortableTh("code", t("admin.coupons.table.code"))}
						{renderStaticTh(t("admin.coupons.table.name"))}
						{renderStaticTh(t("admin.coupons.table.discount"))}
						{renderStaticTh(t("admin.coupons.table.plans"))}
						{renderSortableTh("redeemedCount", t("admin.coupons.table.uses"))}
						{renderSortableTh("validUntil", t("admin.coupons.table.validUntil"))}
						{renderStaticTh(t("admin.coupons.table.status"))}
						{renderStaticTh(t("admin.coupons.table.actions"))}
					</tr>
				</thead>
				<tbody>
					{isLoading
						? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
						: items.length === 0
						? (
							<tr>
								<td colSpan={8} className="py-12 text-center text-[12.5px] text-t-3">
									{t("admin.coupons.table.empty")}
								</td>
							</tr>
						)
						: items.map((item) => {
							const maxR = item.maxRedemptions;
							const pct = maxR ? Math.min((item.redeemedCount / maxR) * 100, 100) : 0;
							const isSelected = item.id === selectedId;

														const handleClick: NonNullable<ComponentProps<"tr">["onClick"]> = () => onSelectRow(item.id);
							const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onEdit(item.id); };
							const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onDelete(item.id); };
return (
								<tr
									key={item.id}
									onClick={handleClick}
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
												onClick={handleClick2}
												className="flex h-6 items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
											>
												{t("admin.coupons.table.edit")}
											</Button>
											<Button
												onClick={handleClick3}
												className="flex h-6 items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
											>
												{t("admin.coupons.table.delete")}
											</Button>
										</div>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};
