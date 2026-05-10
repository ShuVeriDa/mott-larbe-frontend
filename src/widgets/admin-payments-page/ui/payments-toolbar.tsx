"use client";

import { Typography } from "@/shared/ui/typography";
import { Search } from "lucide-react";
import { ComponentProps } from 'react';
import type { AdminPlan } from "@/entities/admin-billing";
import type { PaymentProvider } from "@/entities/admin-payment";
import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";

interface Props {
	search: string;
	planId: string;
	provider: PaymentProvider | "";
	dateFrom: string;
	dateTo: string;
	total: number;
	fetched: number;
	plans: AdminPlan[];
	onSearchChange: (v: string) => void;
	onPlanChange: (v: string) => void;
	onProviderChange: (v: string) => void;
	onDateFromChange: (v: string) => void;
	onDateToChange: (v: string) => void;
}

export const PaymentsToolbar = ({
	search,
	planId,
	provider,
	dateFrom,
	dateTo,
	total,
	fetched,
	plans,
	onSearchChange,
	onPlanChange,
	onProviderChange,
	onDateFromChange,
	onDateToChange,
}: Props) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onPlanChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onProviderChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"input">["onChange"]> = e => onDateFromChange(e.currentTarget.value);
	const handleChange5: NonNullable<ComponentProps<"input">["onChange"]> = e => onDateToChange(e.currentTarget.value);
	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-bd-1 px-3.5 py-2.5">
			{/* Search */}
			<div className="relative max-w-[240px] flex-1 max-sm:max-w-none max-sm:basis-full">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3" />
				<input
					value={search}
					onChange={handleChange}
					placeholder={t("admin.payments.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-1 bg-surf-2 pl-7 pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
				/>
			</div>

			<Select value={planId} onChange={handleChange2} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.payments.toolbar.allPlans")}</option>
				{plans.map(p => (
					<option key={p.id} value={p.id}>
						{p.name}
					</option>
				))}
			</Select>

			<Select value={provider} onChange={handleChange3} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.payments.toolbar.allProviders")}</option>
				<option value="STRIPE">Stripe</option>
				<option value="PAYPAL">PayPal</option>
				<option value="PADDLE">Paddle</option>
				<option value="LEMONSQUEEZY">LemonSqueezy</option>
				<option value="MANUAL">Manual</option>
			</Select>

			{/* Date range */}
			<div className="flex items-center gap-1.5 max-sm:hidden">
				<input
					type="date"
					value={dateFrom}
					onChange={handleChange4}
					className="h-[30px] rounded-base border border-bd-1 bg-surf-2 px-2 text-[11.5px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
				/>
				<Typography tag="span" className="text-[11px] text-t-4">—</Typography>
				<input
					type="date"
					value={dateTo}
					onChange={handleChange5}
					className="h-[30px] rounded-base border border-bd-1 bg-surf-2 px-2 text-[11.5px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
				/>
			</div>

			<div className="ml-auto whitespace-nowrap text-[11.5px] text-t-3">
				{fetched} {t("admin.payments.toolbar.of")} {total}
			</div>
		</div>
	);
};
