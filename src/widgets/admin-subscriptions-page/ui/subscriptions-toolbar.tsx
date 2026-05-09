import { useI18n } from "@/shared/lib/i18n";
import type { PaymentProvider, PlanType, SubscriptionsSort } from "@/entities/admin-subscription";

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

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.target.value);
	const handleChange2: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onPlanChange(e.target.value);
	const handleChange3: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onProviderChange(e.target.value);
	const handleChange4: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onSortChange(e.target.value as import("@/entities/admin-subscription").SubscriptionsSort);
return (
		<div className="flex flex-wrap items-center gap-2 border-b border-bd-1 px-3.5 py-2.5">
			{/* Search */}
			<div className="relative max-w-[260px] flex-1 max-sm:max-w-none max-sm:basis-full">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3"
					width="13"
					height="13"
					viewBox="0 0 13 13"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<circle cx="5.5" cy="5.5" r="4" />
					<path d="M9.5 9.5l2.5 2.5" strokeLinecap="round" />
				</svg>
				<input
					value={search}
					onChange={handleChange}
					placeholder={t("admin.subscriptions.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-1 bg-surf-2 pl-7 pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
				/>
			</div>

			{/* Plan filter */}
			<select
				value={planType ?? ""}
				onChange={handleChange2}
				className="h-[30px] appearance-none rounded-base border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_8px_center] pl-2.5 pr-6 text-[12px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
			>
				<option value="">{t("admin.subscriptions.toolbar.allPlans")}</option>
				<option value="BASIC">Basic</option>
				<option value="PRO">Pro</option>
				<option value="PREMIUM">Premium</option>
				<option value="LIFETIME">Lifetime</option>
			</select>

			{/* Provider filter */}
			<select
				value={provider ?? ""}
				onChange={handleChange3}
				className="h-[30px] appearance-none rounded-base border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_8px_center] pl-2.5 pr-6 text-[12px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
			>
				<option value="">{t("admin.subscriptions.toolbar.allProviders")}</option>
				<option value="STRIPE">Stripe</option>
				<option value="PAYPAL">PayPal</option>
				<option value="PADDLE">Paddle</option>
				<option value="LEMONSQUEEZY">LemonSqueezy</option>
				<option value="MANUAL">Manual</option>
			</select>

			{/* Sort */}
			<select
				value={sort}
				onChange={handleChange4}
				className="h-[30px] appearance-none rounded-base border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_8px_center] pl-2.5 pr-6 text-[12px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
			>
				<option value="nextBilling_asc">{t("admin.subscriptions.toolbar.sortNextAsc")}</option>
				<option value="nextBilling_desc">{t("admin.subscriptions.toolbar.sortNextDesc")}</option>
				<option value="amount_asc">{t("admin.subscriptions.toolbar.sortAmountAsc")}</option>
				<option value="amount_desc">{t("admin.subscriptions.toolbar.sortAmountDesc")}</option>
				<option value="createdAt_asc">{t("admin.subscriptions.toolbar.sortCreatedAsc")}</option>
				<option value="createdAt_desc">{t("admin.subscriptions.toolbar.sortCreatedDesc")}</option>
			</select>

			<div className="ml-auto text-[11.5px] text-t-3">
				{fetched} {t("admin.subscriptions.toolbar.of")} {total}
			</div>
		</div>
	);
};
