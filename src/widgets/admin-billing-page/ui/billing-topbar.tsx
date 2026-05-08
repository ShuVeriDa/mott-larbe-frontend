"use client";

import { useI18n } from "@/shared/lib/i18n";

interface BillingTopbarProps {
	onNewPlan: () => void;
	onNewCoupon: () => void;
}

export const BillingTopbar = ({
	onNewPlan,
	onNewCoupon,
}: BillingTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3.5 transition-colors max-sm:px-3.5">
			<div className="min-w-0 flex-1">
				<div className="font-display text-[16px] text-t-1">
					{t("admin.plans.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3">
					{t("admin.plans.subtitle")}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<button
					onClick={onNewCoupon}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					>
						<path d="M1 6h10M6 1v10" />
					</svg>
					{t("admin.plans.newCoupon")}
				</button>
				<button
					onClick={onNewPlan}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					>
						<path d="M1 6h10M6 1v10" />
					</svg>
					{t("admin.plans.newPlan")}
				</button>
			</div>
		</header>
	);
};
