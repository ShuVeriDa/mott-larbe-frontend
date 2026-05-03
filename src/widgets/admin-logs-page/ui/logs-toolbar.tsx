"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminLogRange } from "@/entities/admin-log";

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

const inputCls =
	"h-8 rounded-lg border border-bd-2 bg-surf font-[inherit] text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

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

	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative min-w-[160px] flex-1">
				<svg
					width="13"
					height="13"
					viewBox="0 0 16 16"
					fill="none"
					className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3"
				>
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
					<path
						d="M10.5 10.5L13 13"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					/>
				</svg>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.logs.toolbar.searchPlaceholder")}
					className={cn(inputCls, "w-full pl-8 pr-3")}
				/>
			</div>

			{/* Service filter */}
			<select
				value={service}
				onChange={(e) => onServiceChange(e.target.value)}
				className={cn(
					inputCls,
					"cursor-pointer appearance-none bg-no-repeat pr-7 pl-3",
					"bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a5a39a' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] bg-[right_9px_center] text-t-2",
				)}
			>
				<option value="all">{t("admin.logs.toolbar.allServices")}</option>
				{services.map((s) => (
					<option key={s} value={s}>
						{s}
					</option>
				))}
			</select>

			{/* Date range */}
			<div className="ml-auto flex items-center gap-2">
				<div className="relative">
					<select
						value={range}
						onChange={(e) => onRangeChange(e.target.value as AdminLogRange)}
						className={cn(
							inputCls,
							"cursor-pointer appearance-none bg-no-repeat pl-8 pr-7",
							"bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a5a39a' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] bg-[right_9px_center] text-t-2",
						)}
					>
						{RANGES.map((r) => (
							<option key={r.value} value={r.value}>
								{t(r.labelKey)}
							</option>
						))}
					</select>
					<svg
						width="12"
						height="12"
						viewBox="0 0 16 16"
						fill="none"
						className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3"
					>
						<rect
							x="2"
							y="3"
							width="12"
							height="11"
							rx="2"
							stroke="currentColor"
							strokeWidth="1.3"
						/>
						<path
							d="M5 2v2M11 2v2M2 7h12"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};
