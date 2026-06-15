import type { AdminCouponStats } from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";
import { Typography } from "@/shared/ui/typography";
import type { ReactNode } from "react";

interface Props {
	stats: AdminCouponStats | undefined;
	isLoading: boolean;
}

const formatDiscountK = (cents: number) => {
	const rub = cents / 100;
	if (rub >= 1000) return `${Math.round(rub / 1000)} тыс ₽`;
	return `${rub.toLocaleString("ru-RU")} ₽`;
};

export const CouponsKpiRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	const growth = stats?.usageGrowth ?? 0;
	const convDelta = stats ? Math.round(stats.conversionDelta * 1000) / 10 : 0;

	const usageSub: ReactNode = (
		<>
			<Typography tag="span" className={growth >= 0 ? "text-grn-t" : "text-red-t"}>
				{growth >= 0 ? "+" : ""}
				{growth}
			</Typography>{" "}
			{t("admin.coupons.kpi.usageGrowthSuffix")}
		</>
	);

	const convSub: ReactNode = (
		<>
			<Typography tag="span" className={convDelta >= 0 ? "text-grn-t" : "text-red-t"}>
				{convDelta >= 0 ? "+" : ""}
				{convDelta} пп
			</Typography>{" "}
			{t("admin.coupons.kpi.conversionSuffix")}
		</>
	);

	if (isLoading) {
		return (
			<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<AdminStatCard
				label={t("admin.coupons.kpi.activeCodes")}
				value={stats?.activeCount ?? 0}
				sub={t("admin.coupons.kpi.activeOf").replace(
					"{total}",
					String(stats?.totalCreated ?? 0),
				)}
			/>
			<AdminStatCard
				label={t("admin.coupons.kpi.usagesMonth")}
				value={stats?.usagesThisMonth ?? 0}
				sub={usageSub}
			/>
			<AdminStatCard
				label={t("admin.coupons.kpi.discountTotal")}
				value={stats ? formatDiscountK(stats.totalDiscountCents) : "0 ₽"}
				sub={t("admin.coupons.kpi.discountSub")}
			/>
			<AdminStatCard
				label={t("admin.coupons.kpi.conversion")}
				value={stats ? `${Math.round(stats.conversionRate * 1000) / 10}%` : "0%"}
				sub={convSub}
			/>
		</div>
	);
};
