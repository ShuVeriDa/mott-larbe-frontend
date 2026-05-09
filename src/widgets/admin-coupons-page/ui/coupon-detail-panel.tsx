"use client";

import type { AdminCouponDetail } from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useState } from 'react';
import { CouponHeroSection } from "./coupon-hero-section";
import { CouponUsageSection } from "./coupon-usage-section";
import { CouponRedemptionsList } from "./coupon-redemptions-list";
import { CouponActionsSection } from "./coupon-actions-section";

interface Props {
	coupon: AdminCouponDetail;
	isLoading: boolean;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onDeactivate: (id: string) => Promise<void>;
	onActivate: (id: string) => Promise<void>;
}

const Skeleton = ({ className }: { className: string }) => (
	<div
		className={`animate-pulse rounded bg-surf-3 ${className}`}
		style={{ width: `${[90, 60, 75, 50, 80][Math.floor(Math.random() * 5)]}%` }}
	/>
);

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
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<div className="space-y-3 p-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-4" />
					))}
				</div>
			</div>
		);
	}

	const handleCopy: NonNullable<ComponentProps<"button">["onClick"]> = () => {
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

	const handleEdit = () => onEdit(coupon.id);
	const handleDelete = () => onDelete(coupon.id);

	return (
		<div className="flex flex-col gap-0 overflow-hidden rounded-card border border-bd-1 bg-surf">
			<CouponHeroSection
				coupon={coupon}
				copied={copied}
				labels={{
					copy: t("admin.coupons.detail.copy"),
					copied: t("admin.coupons.detail.copied"),
					newUsersOnly: t("admin.coupons.detail.newUsersOnly"),
					stackable: t("admin.coupons.detail.stackable"),
					discount: t("admin.coupons.detail.discount"),
					discountFixed: t("admin.coupons.detail.discountFixed"),
				}}
				statusLabels={{
					active: t("admin.coupons.status.active"),
					expired: t("admin.coupons.status.expired"),
					exhausted: t("admin.coupons.status.exhausted"),
					disabled: t("admin.coupons.status.disabled"),
				}}
				onCopy={handleCopy}
				t={t}
			/>
			<CouponUsageSection
				coupon={coupon}
				labels={{
					sectionTitle: t("admin.coupons.detail.usageSection"),
					perUser: t("admin.coupons.detail.perUser"),
					plans: t("admin.coupons.detail.plans"),
					validFrom: t("admin.coupons.detail.validFrom"),
					validUntil: t("admin.coupons.detail.validUntil"),
					usageOf: t("admin.coupons.detail.usageOf"),
					usageUnlimited: t("admin.coupons.detail.usageUnlimited"),
					planAll: t("admin.coupons.table.planAll"),
				}}
			/>
			<CouponRedemptionsList
				coupon={coupon}
				sectionTitle={t("admin.coupons.detail.redemptionsSection")}
			/>
			<CouponActionsSection
				coupon={coupon}
				toggling={toggling}
				labels={{
					edit: t("admin.coupons.detail.edit"),
					copyCode: t("admin.coupons.detail.copyCode"),
					activate: t("admin.coupons.detail.activate"),
					deactivate: t("admin.coupons.detail.deactivate"),
					delete: t("admin.coupons.detail.delete"),
				}}
				onEdit={handleEdit}
				onCopy={handleCopy}
				onToggle={handleToggle}
				onDelete={handleDelete}
			/>
		</div>
	);
};
