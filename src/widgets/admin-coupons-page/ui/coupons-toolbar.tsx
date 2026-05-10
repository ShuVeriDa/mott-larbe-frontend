import { ComponentProps } from 'react';
import type { CouponType } from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";
import { Search } from "lucide-react";
import { Select } from "@/shared/ui/select";

interface Props {
	search: string;
	type: CouponType | "";
	plan: string;
	total: number;
	onSearchChange: (v: string) => void;
	onTypeChange: (v: string) => void;
	onPlanChange: (v: string) => void;
}

export const CouponsToolbar = ({
	search,
	type,
	plan,
	total,
	onSearchChange,
	onTypeChange,
	onPlanChange,
}: Props) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onTypeChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onPlanChange(e.currentTarget.value);
	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-bd-1 px-3.5 py-2.5">
			{/* Search */}
			<div className="relative max-w-[240px] flex-1">
				<Search className="pointer-events-none absolute left-2 top-1/2 size-[13px] -translate-y-1/2 text-t-3" />
				<input
					value={search}
					onChange={handleChange}
					placeholder={t("admin.coupons.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-1 bg-surf-2 pl-7 pr-2.5 text-[12.5px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
				/>
			</div>

			<Select value={type} onChange={handleChange2} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.coupons.toolbar.allTypes")}</option>
				<option value="PERCENT">{t("admin.coupons.toolbar.typePercent")}</option>
				<option value="FIXED">{t("admin.coupons.toolbar.typeFixed")}</option>
			</Select>

			<Select value={plan} onChange={handleChange3} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.coupons.toolbar.allPlans")}</option>
				<option value="BASIC">Basic</option>
				<option value="PRO">Pro</option>
				<option value="PREMIUM">Premium</option>
				<option value="LIFETIME">Lifetime</option>
			</Select>

			<div className="ml-auto text-[11.5px] text-t-3">
				{t("admin.coupons.toolbar.count").replace("{n}", String(total))}
			</div>
		</div>
	);
};
