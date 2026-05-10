import { ComponentProps } from 'react';
import type { CouponType } from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";
import { Search } from "lucide-react";

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

			{/* Type select */}
			<select
				value={type}
				onChange={handleChange2}
				className="h-[30px] appearance-none rounded-base border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%276%27 fill=%27none%27%3E%3Cpath d=%27M1 1l4 4 4-4%27 stroke=%27%23a5a39a%27 stroke-width=%271.3%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-[position:right_7px_center] bg-no-repeat pl-2.5 pr-6 text-[12px] text-t-2 outline-none focus:border-acc focus:text-t-1"
			>
				<option value="">{t("admin.coupons.toolbar.allTypes")}</option>
				<option value="PERCENT">
					{t("admin.coupons.toolbar.typePercent")}
				</option>
				<option value="FIXED">{t("admin.coupons.toolbar.typeFixed")}</option>
			</select>

			{/* Plan select */}
			<select
				value={plan}
				onChange={handleChange3}
				className="h-[30px] appearance-none rounded-base border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%276%27 fill=%27none%27%3E%3Cpath d=%27M1 1l4 4 4-4%27 stroke=%27%23a5a39a%27 stroke-width=%271.3%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-[position:right_7px_center] bg-no-repeat pl-2.5 pr-6 text-[12px] text-t-2 outline-none focus:border-acc focus:text-t-1"
			>
				<option value="">{t("admin.coupons.toolbar.allPlans")}</option>
				<option value="BASIC">Basic</option>
				<option value="PRO">Pro</option>
				<option value="PREMIUM">Premium</option>
				<option value="LIFETIME">Lifetime</option>
			</select>

			<div className="ml-auto text-[11.5px] text-t-3">
				{t("admin.coupons.toolbar.count").replace("{n}", String(total))}
			</div>
		</div>
	);
};
