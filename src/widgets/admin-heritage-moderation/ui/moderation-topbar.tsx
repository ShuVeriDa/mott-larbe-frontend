"use client";

import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { ModerationTypeFilter } from "../model/types";

interface ModerationTopbarProps {
	pendingCount: number;
	verifiedCount: number;
	rejectedCount: number;
	typeFilter: ModerationTypeFilter;
	onTypeFilterChange: (value: ModerationTypeFilter) => void;
	t: ReturnType<typeof useI18n>["t"];
}

const FILTERS: { value: ModerationTypeFilter; labelKey: string }[] = [
	{ value: "ALL", labelKey: "admin.heritage.moderation.filter.all" },
	{ value: "TAIP", labelKey: "admin.heritage.moderation.filter.taip" },
	{ value: "GARA", labelKey: "admin.heritage.moderation.filter.gara" },
];

export const ModerationTopbar = ({
	pendingCount,
	verifiedCount,
	rejectedCount,
	typeFilter,
	onTypeFilterChange,
	t,
}: ModerationTopbarProps) => (
	<div className="flex shrink-0 flex-col gap-3 border-b border-bd-1 px-5 py-3">
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div>
				<Typography tag="h1" className="text-[16px] font-semibold text-t-1">
					{t("admin.heritage.moderation.title")}
				</Typography>
				<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
					{t("admin.heritage.moderation.subtitle")}
				</Typography>
			</div>

			<div className="flex items-center gap-3">
				<StatPill
					label={t("admin.heritage.moderation.stats.pending")}
					count={pendingCount}
					color="yellow"
				/>
				<StatPill
					label={t("admin.heritage.moderation.stats.verified")}
					count={verifiedCount}
					color="green"
				/>
				<StatPill
					label={t("admin.heritage.moderation.stats.rejected")}
					count={rejectedCount}
					color="red"
				/>
			</div>
		</div>

		<div className="flex items-center gap-1">
			{FILTERS.map(({ value, labelKey }) => (
				<FilterButton
					key={value}
					label={t(labelKey)}
					isActive={typeFilter === value}
					onClick={() => onTypeFilterChange(value)}
				/>
			))}
		</div>
	</div>
);

interface StatPillProps {
	label: string;
	count: number;
	color: "yellow" | "green" | "red";
}

const colorClasses: Record<string, string> = {
	yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const StatPill = ({ label, count, color }: StatPillProps) => (
	<div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1", colorClasses[color])}>
		<Typography tag="span" className="text-[11px] font-semibold tabular-nums">
			{count}
		</Typography>
		<Typography tag="span" className="text-[11px]">
			{label}
		</Typography>
	</div>
);

interface FilterButtonProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"rounded-md px-3 py-1 text-[12px] font-medium transition-colors duration-150 ease-out",
			isActive
				? "bg-acc text-white"
				: "bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
		)}
	>
		{label}
	</button>
);
