"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminUsersTabCounts, UsersTab } from "@/entities/admin-user";

const TABS: UsersTab[] = ["all", "active", "blocked", "frozen", "deleted"];

interface UsersTabsProps {
	active: UsersTab;
	counts: AdminUsersTabCounts | undefined;
	onChange: (tab: UsersTab) => void;
}

export const UsersTabs = ({ active, counts, onChange }: UsersTabsProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{TABS.map((tab) => {
					const count = counts?.[tab];
										const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(tab);
return (
						<button
							key={tab}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-base border-none px-[11px] font-sans text-[12.5px] transition-colors",
								active === tab
									? "bg-surf font-medium text-t-1 shadow-sm"
									: "bg-transparent text-t-2 hover:bg-surf-3 hover:text-t-1",
							)}
						>
							{t(`admin.users.tabs.${tab}`)}
							{count !== undefined && (
								<span
									className={cn(
										"min-w-[18px] rounded px-1 py-px text-center text-[10px] font-semibold",
										active === tab ? "bg-surf-2 text-t-3" : "bg-surf-3 text-t-3",
									)}
								>
									{count.toLocaleString("ru-RU")}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
