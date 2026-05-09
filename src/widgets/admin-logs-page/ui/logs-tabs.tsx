"use client";

import type { AdminLogTab, AdminLogsTabs } from "@/entities/admin-log";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

interface LogsTabsProps {
	active: AdminLogTab;
	counts?: AdminLogsTabs;
	onChange: (tab: AdminLogTab) => void;
}

const TABS: Array<{ key: AdminLogTab; danger?: boolean; warn?: boolean }> = [
	{ key: "all" },
	{ key: "debug" },
	{ key: "info" },
	{ key: "warn", warn: true },
	{ key: "error", danger: true },
	{ key: "critical", danger: true },
];

export const LogsTabs = ({ active, counts, onChange }: LogsTabsProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{TABS.map(({ key, danger, warn }) => {
					const isActive = active === key;
					const count = counts?.[key];
										const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(key);
return (
						<button
							key={key}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex h-7 items-center gap-1.5 whitespace-nowrap rounded-base border border-transparent px-3 text-[12.5px] transition-colors",
								isActive
									? "border-bd-1 bg-surf font-medium text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
									: "text-t-2 hover:bg-surf-3 hover:text-t-1",
							)}
						>
							{t(`admin.logs.tabs.${key}`)}
							{count !== undefined && (
								<span
									className={cn(
										"min-w-[18px] rounded px-1 py-px text-center text-[10.5px] font-semibold",
										isActive ? "bg-surf-2 text-t-3" : "bg-surf-3 text-t-3",
										danger && !isActive && "bg-red-bg text-red-t",
										warn && !isActive && "bg-amb-bg text-amb-t",
									)}
								>
									{count.toLocaleString()}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
