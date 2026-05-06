"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan } from "@/entities/admin-billing";
import type { PaymentProvider } from "@/entities/admin-payment";

const SELECT_CLS =
	"h-[30px] appearance-none rounded-[7px] border border-bd-1 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pl-2.5 pr-6 text-[12px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1";

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

	return (
		<div className="flex flex-wrap items-center gap-2 border-b border-bd-1 px-3.5 py-2.5">
			{/* Search */}
			<div className="relative max-w-[240px] flex-1 max-sm:max-w-none max-sm:basis-full">
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
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.payments.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-[7px] border border-bd-1 bg-surf-2 pl-7 pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
				/>
			</div>

			{/* Plan select */}
			<select
				value={planId}
				onChange={(e) => onPlanChange(e.target.value)}
				className={SELECT_CLS}
			>
				<option value="">{t("admin.payments.toolbar.allPlans")}</option>
				{plans.map((p) => (
					<option key={p.id} value={p.id}>
						{p.name}
					</option>
				))}
			</select>

			{/* Provider select */}
			<select
				value={provider}
				onChange={(e) => onProviderChange(e.target.value)}
				className={SELECT_CLS}
			>
				<option value="">{t("admin.payments.toolbar.allProviders")}</option>
				<option value="STRIPE">Stripe</option>
				<option value="PAYPAL">PayPal</option>
				<option value="PADDLE">Paddle</option>
				<option value="LEMONSQUEEZY">LemonSqueezy</option>
				<option value="MANUAL">Manual</option>
			</select>

			{/* Date range */}
			<div className="flex items-center gap-1.5 max-sm:hidden">
				<input
					type="date"
					value={dateFrom}
					onChange={(e) => onDateFromChange(e.target.value)}
					className="h-[30px] rounded-[7px] border border-bd-1 bg-surf-2 px-2 text-[11.5px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
				/>
				<span className="text-[11px] text-t-4">—</span>
				<input
					type="date"
					value={dateTo}
					onChange={(e) => onDateToChange(e.target.value)}
					className="h-[30px] rounded-[7px] border border-bd-1 bg-surf-2 px-2 text-[11.5px] text-t-2 outline-none transition-colors focus:border-acc focus:text-t-1"
				/>
			</div>

			<div className="ml-auto whitespace-nowrap text-[11.5px] text-t-3">
				{fetched} {t("admin.payments.toolbar.of")} {total}
			</div>
		</div>
	);
};
