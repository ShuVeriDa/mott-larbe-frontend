"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { BillingCycle } from "@/entities/subscription";

export interface BillingCycleToggleProps {
	value: BillingCycle;
	onChange: (cycle: BillingCycle) => void;
	yearlyDiscountPercent?: number;
}

export const BillingCycleToggle = ({
	value,
	onChange,
	yearlyDiscountPercent,
}: BillingCycleToggleProps) => {
	const { t } = useI18n();

	const renderButton = (cycle: BillingCycle, label: string, badge?: string) => {
		const active = value === cycle;
				const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(cycle);
return (
			<button
				type="button"
				onClick={handleClick}
				className={cn(
					"flex h-7 items-center justify-center gap-1.5 rounded-md px-3 text-[11.5px] font-medium transition-colors duration-100 max-md:flex-1",
					active
						? "bg-surf text-t-1 shadow-sm"
						: "bg-transparent text-t-2 hover:text-t-1",
				)}
				aria-pressed={active}
			>
				<span>{label}</span>
				{badge ? (
					<span className="rounded-[4px] bg-grn-bg px-[5px] py-[1px] text-[9.5px] font-semibold text-grn-t">
						{badge}
					</span>
				) : null}
			</button>
		);
	};

	const yearlyBadge =
		yearlyDiscountPercent && yearlyDiscountPercent > 0
			? `−${yearlyDiscountPercent}%`
			: undefined;

	return (
		<div
			className="flex w-fit gap-1 rounded-base border-hairline border-bd-1 bg-surf-2 p-1 max-md:w-full"
			role="tablist"
			aria-label={t("subscription.planSelector.billingToggle")}
		>
			{renderButton("monthly", t("subscription.planSelector.monthly"))}
			{renderButton(
				"yearly",
				t("subscription.planSelector.yearly"),
				yearlyBadge,
			)}
		</div>
	);
};
