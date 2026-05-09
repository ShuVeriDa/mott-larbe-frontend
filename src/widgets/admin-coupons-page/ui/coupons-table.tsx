"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, MouseEvent, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminCouponListItem, CouponStatus } from "@/entities/admin-coupon";
import type { CouponSortBy } from "../model/use-admin-coupons-page";
import { CouponRow } from "./coupons-table-row";

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

// ── Sub-components ─────────────────────────────────────────────────────────────

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


const SkeletonRow = () => (
	<tr className="border-b border-bd-1">
		{Array.from({ length: 8 }).map((_, i) => (
			<td key={i} className="px-3.5 py-2.5">
				<div className="h-4 animate-pulse rounded bg-surf-3" style={{ width: `${[80, 100, 60, 70, 90, 70, 60, 50][i]}px` }} />
			</td>
		))}
	</tr>
);

// ── Main component ─────────────────────────────────────────────────────────────

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
						: items.map((item) => (
							<CouponRow
								key={item.id}
								item={item}
								isSelected={item.id === selectedId}
								onSelectRow={onSelectRow}
								onEdit={onEdit}
								onDelete={onDelete}
								t={t}
							/>
						))}
				</tbody>
			</table>
		</div>
	);
};
