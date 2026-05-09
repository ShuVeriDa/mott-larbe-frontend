"use client";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { BillingPeriod } from "../model";

interface PricingToggleProps {
	value: BillingPeriod;
	onChange: (value: BillingPeriod) => void;
}

export const PricingToggle = ({ value, onChange }: PricingToggleProps) => {
	const { t } = useI18n();

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange("monthly");
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange("yearly");
return (
		<div className="mx-auto mt-[22px] inline-flex items-center gap-1 rounded-full border-hairline border-bd-2 bg-surf p-1">
			<button
				type="button"
				onClick={handleClick}
				className={cn(
					"inline-flex h-[30px] items-center gap-1.5 rounded-full border-0 px-4 text-[12.5px] font-semibold transition-all",
					value === "monthly"
						? "bg-acc text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)]"
						: "bg-transparent text-t-2 hover:text-t-1",
				)}
			>
				{t("landing.pricing.monthly")}
			</button>
			<button
				type="button"
				onClick={handleClick2}
				className={cn(
					"inline-flex h-[30px] items-center gap-1.5 rounded-full border-0 px-4 text-[12.5px] font-semibold transition-all",
					value === "yearly"
						? "bg-acc text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)]"
						: "bg-transparent text-t-2 hover:text-t-1",
				)}
			>
				{t("landing.pricing.yearly")}
				<Typography
					tag="span"
					className={cn(
						"rounded px-[5px] py-[1.5px] text-[9.5px] font-bold",
						value === "yearly"
							? "bg-white/20 text-white"
							: "bg-grn-bg text-grn-t",
					)}
				>
					{t("landing.pricing.save")}
				</Typography>
			</button>
		</div>
	);
};
