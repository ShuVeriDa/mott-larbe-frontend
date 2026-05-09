"use client";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { StatsPeriod } from "@/entities/statistics";

const PERIODS: StatsPeriod[] = ["week", "month", "year", "all"];

interface PeriodTabsProps {
	value: StatsPeriod;
	onChange: (period: StatsPeriod) => void;
	className?: string;
}

export const PeriodTabs = ({ value, onChange, className }: PeriodTabsProps) => {
	const { t } = useI18n();

	return (
		<div
			role="tablist"
			aria-label={t("statistics.pageTitle")}
			className={cn(
				"flex gap-0.5 rounded-lg border-hairline border-bd-2 bg-surf-2 p-[3px] max-md:w-full",
				className,
			)}
		>
			{PERIODS.map((period) => {
				const active = value === period;
								const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(period);
return (
					<button
						key={period}
						type="button"
						role="tab"
						aria-selected={active}
						onClick={handleClick}
						className={cn(
							"rounded-md px-3 py-1 text-xs font-medium transition-colors duration-100 max-md:flex-1",
							active
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-2 hover:text-t-1",
						)}
					>
						{t(`statistics.period.${period}`)}
					</button>
				);
			})}
		</div>
	);
};
