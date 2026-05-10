"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from 'react';
import type { DashboardPeriod } from "@/entities/admin-dashboard";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Download } from "lucide-react";
import { Select } from "@/shared/ui/select";

const PERIODS: DashboardPeriod[] = ["week", "month", "year", "all"];

interface DashboardTopbarProps {
	period: DashboardPeriod;
	onPeriodChange: (p: DashboardPeriod) => void;
	onExport: () => void;
}

export const DashboardTopbar = ({
	period,
	onPeriodChange,
	onExport,
}: DashboardTopbarProps) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"select">["onChange"]> = e => onPeriodChange(e.currentTarget.value as DashboardPeriod);
	return (
		<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
			<div className="min-w-0 flex-1">
				<div className="font-display text-base font-medium text-t-1">
					{t("admin.dashboard.title")}
				</div>
				<div className="text-[11px] text-t-3 max-sm:hidden">
					{t("admin.dashboard.subtitle")}
				</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<div className="hidden items-center gap-0.5 rounded-base border border-bd-1 bg-surf p-0.5 sm:flex">
					{PERIODS.map(p => {
					  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPeriodChange(p);
					  return (
						<Button
							key={p}
							onClick={handleClick}
							className={cn(
								"h-[26px] rounded-[5px] px-3 text-[11.5px] font-medium transition-colors",
								period === p
									? "bg-acc-bg text-acc-t"
									: "text-t-2 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							{t(`admin.dashboard.period.${p}` as Parameters<typeof t>[0])}
						</Button>
					);
					})}
				</div>

				<Select
					value={period}
					onChange={handleChange}
					wrapperClassName="w-auto sm:hidden"
					className="bg-surf text-t-2 hover:border-bd-3"
				>
					{PERIODS.map(p => (
						<option key={p} value={p}>
							{t(`admin.dashboard.period.${p}` as Parameters<typeof t>[0])}
						</option>
					))}
				</Select>

				<Button
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Download className="size-[13px] shrink-0" />
					<Typography tag="span" className="max-sm:hidden">{t("admin.dashboard.export")}</Typography>
				</Button>
			</div>
		</header>
	);
};
