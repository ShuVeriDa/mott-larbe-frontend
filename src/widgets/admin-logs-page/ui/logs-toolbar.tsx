"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminLogRange } from "@/entities/admin-log";
import { Calendar } from "lucide-react";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";

const RANGES: Array<{ value: AdminLogRange; labelKey: string }> = [
	{ value: "15m", labelKey: "admin.logs.toolbar.last15m" },
	{ value: "1h", labelKey: "admin.logs.toolbar.last1h" },
	{ value: "24h", labelKey: "admin.logs.toolbar.last24h" },
	{ value: "7d", labelKey: "admin.logs.toolbar.last7d" },
	{ value: "30d", labelKey: "admin.logs.toolbar.last30d" },
	{ value: "all", labelKey: "admin.logs.toolbar.allTime" },
];

interface LogsToolbarProps {
	search: string;
	service: string;
	range: AdminLogRange;
	services: string[];
	onSearchChange: (v: string) => void;
	onServiceChange: (v: string) => void;
	onRangeChange: (v: AdminLogRange) => void;
}

export const LogsToolbar = ({
	search,
	service,
	range,
	services,
	onSearchChange,
	onServiceChange,
	onRangeChange,
}: LogsToolbarProps) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onServiceChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onRangeChange(e.currentTarget.value as AdminLogRange);
	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<SearchBox
				value={search}
				onChange={handleChange}
				placeholder={t("admin.logs.toolbar.searchPlaceholder")}
				wrapperClassName="min-w-[160px] flex-1"
				className="h-8"
			/>

			<Select value={service} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
				<option value="all">{t("admin.logs.toolbar.allServices")}</option>
				{services.map((s) => (
					<option key={s} value={s}>
						{s}
					</option>
				))}
			</Select>

			<div className="ml-auto flex items-center gap-2">
				<div className="relative">
					<Select value={range} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 pl-8 hover:border-bd-3">
						{RANGES.map((r) => (
							<option key={r.value} value={r.value}>
								{t(r.labelKey)}
							</option>
						))}
					</Select>
					<Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-[12px] -translate-y-1/2 text-t-3" />
				</div>
			</div>
		</div>
	);
};
