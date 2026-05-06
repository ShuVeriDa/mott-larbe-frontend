import { useI18n } from "@/shared/lib/i18n";
import type { AdminCouponStats } from "@/entities/admin-coupon";

interface Props {
	stats: AdminCouponStats | undefined;
	isLoading: boolean;
}

const KpiCard = ({
	label,
	value,
	sub,
	isLoading,
}: {
	label: string;
	value: React.ReactNode;
	sub: React.ReactNode;
	isLoading: boolean;
}) => (
	<div className="rounded-[11px] border border-bd-1 bg-surf p-3 transition-colors">
		<div className="mb-1.5 text-[11px] font-medium tracking-[0.2px] text-t-3">{label}</div>
		{isLoading ? (
			<div className="mb-1 h-5 w-16 animate-pulse rounded bg-surf-3" />
		) : (
			<div className="mb-0.5 text-[20px] font-semibold leading-none text-t-1">{value}</div>
		)}
		{isLoading ? (
			<div className="h-3.5 w-24 animate-pulse rounded bg-surf-3" />
		) : (
			<div className="text-[11px] text-t-3">{sub}</div>
		)}
	</div>
);

const formatDiscountK = (cents: number) => {
	const rub = cents / 100;
	if (rub >= 1000) return `${Math.round(rub / 1000)} тыс ₽`;
	return `${rub.toLocaleString("ru-RU")} ₽`;
};

export const CouponsKpiRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	const growth = stats?.usageGrowth ?? 0;
	const convDelta = stats ? Math.round(stats.conversionDelta * 1000) / 10 : 0;

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<KpiCard
				label={t("admin.coupons.kpi.activeCodes")}
				value={stats?.activeCount ?? 0}
				sub={t("admin.coupons.kpi.activeOf").replace("{total}", String(stats?.totalCreated ?? 0))}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.coupons.kpi.usagesMonth")}
				value={stats?.usagesThisMonth ?? 0}
				sub={
					<>
						<span className={growth >= 0 ? "text-grn-t" : "text-red-t"}>
							{growth >= 0 ? "+" : ""}{growth}
						</span>{" "}
						{t("admin.coupons.kpi.usageGrowthSuffix")}
					</>
				}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.coupons.kpi.discountTotal")}
				value={stats ? formatDiscountK(stats.totalDiscountCents) : "0 ₽"}
				sub={t("admin.coupons.kpi.discountSub")}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.coupons.kpi.conversion")}
				value={stats ? `${Math.round(stats.conversionRate * 1000) / 10}%` : "0%"}
				sub={
					<>
						<span className={convDelta >= 0 ? "text-grn-t" : "text-red-t"}>
							{convDelta >= 0 ? "+" : ""}{convDelta} пп
						</span>{" "}
						{t("admin.coupons.kpi.conversionSuffix")}
					</>
				}
				isLoading={isLoading}
			/>
		</div>
	);
};
