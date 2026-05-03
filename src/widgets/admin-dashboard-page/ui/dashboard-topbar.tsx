"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { DashboardPeriod } from "@/entities/admin-dashboard";

const PERIODS: DashboardPeriod[] = ["week", "month", "year", "all"];

interface DashboardTopbarProps {
	period: DashboardPeriod;
	onPeriodChange: (p: DashboardPeriod) => void;
	onExport: () => void;
}

export const DashboardTopbar = ({ period, onPeriodChange, onExport }: DashboardTopbarProps) => {
	const { t } = useI18n();

	return (
		<div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-bd-1 bg-bg px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
			<div className="min-w-0 flex-1">
				<div className="font-display text-base font-medium text-t-1">
					{t("admin.dashboard.title")}
				</div>
				<div className="text-[11px] text-t-3 max-sm:hidden">{t("admin.dashboard.subtitle")}</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<div className="hidden items-center gap-0.5 rounded-[7px] border border-bd-1 bg-surf p-0.5 sm:flex">
					{PERIODS.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => onPeriodChange(p)}
							className={cn(
								"h-[26px] rounded-[5px] px-3 text-[11.5px] font-medium transition-colors",
								period === p
									? "bg-acc-bg text-acc-t"
									: "text-t-2 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							{t(`admin.dashboard.period.${p}` as Parameters<typeof t>[0])}
						</button>
					))}
				</div>

				<select
					value={period}
					onChange={(e) => onPeriodChange(e.target.value as DashboardPeriod)}
					className="flex h-[30px] items-center rounded-[7px] border border-bd-2 bg-surf px-2 text-[12px] text-t-2 transition-colors hover:border-bd-3 sm:hidden"
				>
					{PERIODS.map((p) => (
						<option key={p} value={p}>
							{t(`admin.dashboard.period.${p}` as Parameters<typeof t>[0])}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
						<path
							d="M3 10v2a1 1 0 001 1h8a1 1 0 001-1v-2M8 3v7M5 7l3 3 3-3"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span className="max-sm:hidden">{t("admin.dashboard.export")}</span>
				</button>
			</div>
		</div>
	);
};
