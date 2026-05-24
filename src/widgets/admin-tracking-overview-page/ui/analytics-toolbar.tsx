"use client";

import type {
	AnalyticsRangePreset,
	AnalyticsRangeState,
} from "@/features/admin-analytics";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Calendar } from "lucide-react";
import type { ComponentProps } from "react";

interface ToolbarDict {
	today: string;
	"7d": string;
	"30d": string;
	"90d": string;
	custom: string;
	from: string;
	to: string;
	refresh: string;
	export?: string;
}

interface AnalyticsToolbarProps {
	rangeState: AnalyticsRangeState;
	dict: ToolbarDict;
	onRefresh?: () => void;
	onExport?: () => void;
	isExporting?: boolean;
}

const PRESETS: AnalyticsRangePreset[] = ["today", "7d", "30d", "90d"];

export const AnalyticsToolbar = ({
	rangeState,
	dict,
	onRefresh,
	onExport,
	isExporting,
}: AnalyticsToolbarProps) => {
	const { preset, range, setPreset, setCustomRange, error } = rangeState;

	const handlePresetClick = (p: AnalyticsRangePreset) => setPreset(p);
	const handleCustomClick: ComponentProps<"button">["onClick"] = () =>
		setPreset("custom");
	const handleFromChange: ComponentProps<"input">["onChange"] = e =>
		setCustomRange({ from: e.currentTarget.value });
	const handleToChange: ComponentProps<"input">["onChange"] = e =>
		setCustomRange({ to: e.currentTarget.value });

	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
				{PRESETS.map(p => {
					const handleClick: ComponentProps<"button">["onClick"] = () =>
						handlePresetClick(p);
					const label = (dict[p as keyof ToolbarDict] ?? p) as string;
					return (
						<Button
							key={p}
							onClick={handleClick}
							title={label}
							className={cn(
								"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
								preset === p
									? "bg-surf text-t-1 shadow-sm"
									: "text-t-2 hover:text-t-1",
							)}
						>
							{label}
						</Button>
					);
				})}
			</div>

			<div className="flex items-center gap-1.5">
				<Button
					onClick={handleCustomClick}
					title={dict.custom}
					className={cn(
						"flex h-[30px] gap-1  items-center rounded-base border px-2.5 text-[12px] font-medium transition-colors",
						preset === "custom"
							? "border-acc bg-acc/10 text-acc"
							: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
					)}
				>
					<Calendar className="size-[11px]" aria-hidden="true" />
					{dict.custom}
				</Button>
				{preset === "custom" && (
					<div className={cn("flex items-center gap-1", error && "text-red")}>
						<Input
							type="date"
							value={range.from}
							onChange={handleFromChange}
							className="h-[28px] rounded-md px-2 text-[12px]"
						/>
						<span className="text-t-3">—</span>
						<Input
							type="date"
							value={range.to}
							onChange={handleToChange}
							className="h-[28px] rounded-md px-2 text-[12px]"
						/>
					</div>
				)}
			</div>

			<div className="ml-auto flex items-center gap-2">
				{onRefresh && (
					<Button
						onClick={onRefresh}
						title={dict.refresh}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
					>
						{dict.refresh}
					</Button>
				)}
				{onExport && dict.export && (
					<Button
						onClick={onExport}
						disabled={isExporting}
						title={dict.export}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:opacity-40"
					>
						{dict.export}
					</Button>
				)}
			</div>
		</div>
	);
};
