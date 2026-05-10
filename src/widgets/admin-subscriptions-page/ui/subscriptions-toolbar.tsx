import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Search } from "lucide-react";
import type { PaymentProvider, PlanType, SubscriptionsSort } from "@/entities/admin-subscription";
import { Select } from "@/shared/ui/select";

interface Props {
	search: string;
	planType: PlanType | "";
	provider: PaymentProvider | "";
	sort: SubscriptionsSort;
	total: number;
	fetched: number;
	onSearchChange: (value: string) => void;
	onPlanChange: (value: string) => void;
	onProviderChange: (value: string) => void;
	onSortChange: (value: SubscriptionsSort) => void;
}

export const SubscriptionsToolbar = ({
	search,
	planType,
	provider,
	sort,
	total,
	fetched,
	onSearchChange,
	onPlanChange,
	onProviderChange,
	onSortChange,
}: Props) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onPlanChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onProviderChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onSortChange(e.currentTarget.value as import("@/entities/admin-subscription").SubscriptionsSort);
	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-bd-1 px-3.5 py-2.5">
			{/* Search */}
			<div className="relative max-w-[260px] flex-1 max-sm:max-w-none max-sm:basis-full">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3" />
				<input
					value={search}
					onChange={handleChange}
					placeholder={t("admin.subscriptions.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-1 bg-surf-2 pl-7 pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
				/>
			</div>

			<Select value={planType ?? ""} onChange={handleChange2} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.subscriptions.toolbar.allPlans")}</option>
				<option value="BASIC">Basic</option>
				<option value="PRO">Pro</option>
				<option value="PREMIUM">Premium</option>
				<option value="LIFETIME">Lifetime</option>
			</Select>

			<Select value={provider ?? ""} onChange={handleChange3} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="">{t("admin.subscriptions.toolbar.allProviders")}</option>
				<option value="STRIPE">Stripe</option>
				<option value="PAYPAL">PayPal</option>
				<option value="PADDLE">Paddle</option>
				<option value="LEMONSQUEEZY">LemonSqueezy</option>
				<option value="MANUAL">Manual</option>
			</Select>

			<Select value={sort} onChange={handleChange4} wrapperClassName="w-auto" className="border-bd-1 text-t-2">
				<option value="nextBilling_asc">{t("admin.subscriptions.toolbar.sortNextAsc")}</option>
				<option value="nextBilling_desc">{t("admin.subscriptions.toolbar.sortNextDesc")}</option>
				<option value="amount_asc">{t("admin.subscriptions.toolbar.sortAmountAsc")}</option>
				<option value="amount_desc">{t("admin.subscriptions.toolbar.sortAmountDesc")}</option>
				<option value="createdAt_asc">{t("admin.subscriptions.toolbar.sortCreatedAsc")}</option>
				<option value="createdAt_desc">{t("admin.subscriptions.toolbar.sortCreatedDesc")}</option>
			</Select>

			<div className="ml-auto text-[11.5px] text-t-3">
				{fetched} {t("admin.subscriptions.toolbar.of")} {total}
			</div>
		</div>
	);
};
