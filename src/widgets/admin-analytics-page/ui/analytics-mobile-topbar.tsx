"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Calendar } from "lucide-react";
import type { AnalyticsRange } from "@/entities/admin-analytics";

const RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "all"];

interface AnalyticsMobileTopbarProps {
	range: AnalyticsRange;
	isCustomRange: boolean;
	onRangeChange: (range: AnalyticsRange) => void;
	onDateRangeChange: (from: string, to: string) => void;
	onDateRangeClear: () => void;
}

export const AnalyticsMobileTopbar = ({
	range,
	isCustomRange,
	onRangeChange,
	onDateRangeChange,
	onDateRangeClear,
}: AnalyticsMobileTopbarProps) => {
	const { t } = useI18n();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [localFrom, setLocalFrom] = useState("");
	const [localTo, setLocalTo] = useState("");

	const handleApply = () => {
		if (localFrom && localTo) {
			onDateRangeChange(
				new Date(localFrom).toISOString(),
				new Date(`${localTo}T23:59:59`).toISOString(),
			);
		}
		setShowDatePicker(false);
	};

	const handleClear = () => {
		setLocalFrom("");
		setLocalTo("");
		onDateRangeClear();
		setShowDatePicker(false);
	};

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setShowDatePicker((v) => !v);
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setLocalFrom(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setLocalTo(e.currentTarget.value);
return (
		<header className=" border-b border-bd-1 bg-surf transition-colors md:hidden">
			<div className="flex items-center justify-between px-4 py-2.5">
				<Typography tag="span" className="font-display text-[13px] font-medium text-t-1">
					{t("admin.analytics.title")}
				</Typography>
				<div className="flex items-center gap-1">
					<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
						{RANGES.map((r) => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRangeChange(r);
						  return (
							<Button
								key={r}
								onClick={handleClick}
								className={cn(
									"h-6 rounded-md px-2 text-[11px] font-medium transition-all",
									r === range && !isCustomRange
										? "bg-surf text-t-1 shadow-sm"
										: "text-t-2 hover:text-t-1",
								)}
							>
								{t(`admin.analytics.range.${r}`)}
							</Button>
						);
						})}
					</div>
					<Button
						onClick={handleClick}
						className={cn(
							"flex size-6 items-center justify-center rounded-md border transition-colors",
							isCustomRange
								? "border-acc bg-acc/10 text-acc"
								: "border-bd-2 text-t-3 hover:text-t-1",
						)}
					>
						<Calendar className="size-[10px]" aria-hidden="true" />
					</Button>
				</div>
			</div>

			{showDatePicker && (
				<div className="border-t border-bd-1 px-4 py-3">
					<div className="flex gap-2">
						<div className="flex flex-1 flex-col gap-1">
							<Typography tag="label" className="text-[10px] text-t-3">{t("admin.analytics.dateFrom")}</Typography>
							<input
								type="date"
								value={localFrom}
								max={localTo || undefined}
								onChange={handleChange}
								className="h-[28px] w-full rounded-md border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1"
							/>
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<Typography tag="label" className="text-[10px] text-t-3">{t("admin.analytics.dateTo")}</Typography>
							<input
								type="date"
								value={localTo}
								min={localFrom || undefined}
								onChange={handleChange2}
								className="h-[28px] w-full rounded-md border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1"
							/>
						</div>
					</div>
					<div className="mt-2 flex justify-end gap-1.5">
						<Button onClick={handleClear} className="h-[26px] rounded-md px-2.5 text-[11.5px] text-t-2">
							{t("admin.analytics.clear")}
						</Button>
						<Button
							onClick={handleApply}
							disabled={!localFrom || !localTo}
							className="h-[26px] rounded-md bg-acc px-2.5 text-[11.5px] font-medium text-white disabled:opacity-40"
						>
							{t("admin.analytics.apply")}
						</Button>
					</div>
				</div>
			)}
		</header>
	);
};
