"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { AnalyticsRange } from "@/entities/admin-analytics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Calendar, Download } from "lucide-react";
import { ComponentProps, useRef, useState } from 'react';
const RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "all"];

interface AnalyticsTopbarProps {
	range: AnalyticsRange;
	dateFrom?: string;
	dateTo?: string;
	isCustomRange: boolean;
	onRangeChange: (range: AnalyticsRange) => void;
	onDateRangeChange: (from: string, to: string) => void;
	onDateRangeClear: () => void;
	onExport: (format: "json" | "csv") => void;
}

export const AnalyticsTopbar = ({
	range,
	dateFrom,
	dateTo,
	isCustomRange,
	onRangeChange,
	onDateRangeChange,
	onDateRangeClear,
	onExport,
}: AnalyticsTopbarProps) => {
	const { t } = useI18n();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [localFrom, setLocalFrom] = useState(dateFrom ?? "");
	const [localTo, setLocalTo] = useState(dateTo ?? "");
	const [showExportMenu, setShowExportMenu] = useState(false);
	const exportRef = useRef<HTMLDivElement>(null);

	const handleDateApply = () => {
		if (localFrom && localTo) {
			// convert YYYY-MM-DD to ISO datetime
			onDateRangeChange(
				new Date(localFrom).toISOString(),
				new Date(`${localTo}T23:59:59`).toISOString(),
			);
		}
		setShowDatePicker(false);
	};

	const handleDateClear = () => {
		setLocalFrom("");
		setLocalTo("");
		onDateRangeClear();
		setShowDatePicker(false);
	};

	const handleDatePickerToggle: NonNullable<ComponentProps<"button">["onClick"]> = () => setShowDatePicker(v => !v);
	const handleFromChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setLocalFrom(e.currentTarget.value);
	const handleToChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setLocalTo(e.currentTarget.value);
	const handleExportMenuToggle: NonNullable<ComponentProps<"button">["onClick"]> = () => setShowExportMenu(v => !v);
return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-md:hidden">
			<div>
				<Typography tag="h1" className="font-display text-base font-medium text-t-1">
					{t("admin.analytics.title")}
				</Typography>
				<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
					{t("admin.analytics.subtitle")}
				</Typography>
			</div>

			<div className="ml-auto flex items-center gap-2">
				{/* Preset range segment */}
				<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
					{RANGES.map(r => {
					  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRangeChange(r);
					  return (
						<Button
							key={r}
							onClick={handleClick}
							className={cn(
								"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
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

				{/* Date-range chip */}
				<div className="relative">
					<Button
						onClick={handleDatePickerToggle}
						className={cn(
							"flex h-[30px] items-center gap-1.5 rounded-base border px-2.5 text-[12px] font-medium transition-colors",
							isCustomRange
								? "border-acc bg-acc/10 text-acc"
								: "border-bd-2 bg-transparent text-t-2 hover:border-bd-3 hover:text-t-1",
						)}
					>
						<Calendar className="size-[11px]" aria-hidden="true" />
						{isCustomRange && dateFrom && dateTo
							? `${dateFrom.slice(0, 10)} — ${dateTo.slice(0, 10)}`
							: t("admin.analytics.dateRange")}
					</Button>

					{showDatePicker && (
						<div className="absolute top-full right-0 z-20 mt-1.5 flex flex-col gap-2 rounded-xl border border-bd-2 bg-surf p-3 shadow-lg">
							<div className="flex gap-2">
								<div className="flex flex-col gap-1">
									<Typography tag="label" className="text-[10px] text-t-3">
										{t("admin.analytics.dateFrom")}
									</Typography>
									<input
										type="date"
										value={localFrom}
										max={localTo || undefined}
										onChange={handleFromChange}
										className="h-[28px] rounded-md border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1"
									/>
								</div>
								<div className="flex flex-col gap-1">
									<Typography tag="label" className="text-[10px] text-t-3">
										{t("admin.analytics.dateTo")}
									</Typography>
									<input
										type="date"
										value={localTo}
										min={localFrom || undefined}
										onChange={handleToChange}
										className="h-[28px] rounded-md border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1"
									/>
								</div>
							</div>
							<div className="flex justify-end gap-1.5">
								<Button
									onClick={handleDateClear}
									className="h-[26px] rounded-md px-2.5 text-[11.5px] text-t-2 hover:text-t-1"
								>
									{t("admin.analytics.clear")}
								</Button>
								<Button
									onClick={handleDateApply}
									disabled={!localFrom || !localTo}
									className="h-[26px] rounded-md bg-acc px-2.5 text-[11.5px] font-medium text-white disabled:opacity-40"
								>
									{t("admin.analytics.apply")}
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Export with format dropdown */}
				<div className="relative" ref={exportRef}>
					<Button
						onClick={handleExportMenuToggle}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
					>
						<Download className="size-3" aria-hidden="true" />
						{t("admin.analytics.export")}
					</Button>

					{showExportMenu && (
						<div className="absolute top-full right-0 z-20 mt-1.5 flex flex-col overflow-hidden rounded-xl border border-bd-2 bg-surf shadow-lg">
							{(["csv", "json"] as const).map(fmt => {
							  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
										onExport(fmt);
										setShowExportMenu(false);
									};
							  return (
								<Button
									key={fmt}
									onClick={handleClick}
									className="px-4 py-2 text-left text-[12px] text-t-1 hover:bg-surf-2"
								>
									{fmt.toUpperCase()}
								</Button>
							);
							})}
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
