"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { UnknownWordsTab, UnknownWordTabCounts } from "@/entities/admin-unknown-word";

const TABS: UnknownWordsTab[] = ["all", "frequent", "rare"];

interface UnknownWordsTabsProps {
	active: UnknownWordsTab;
	counts: UnknownWordTabCounts | undefined;
	onChange: (tab: UnknownWordsTab) => void;
}

export const UnknownWordsTabs = ({
	active,
	counts,
	onChange,
}: UnknownWordsTabsProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{TABS.map((tab) => {
					const count = counts?.[tab];
					const isFrequent = tab === "frequent";
										const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(tab);
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
							{t(`admin.unknownWords.tabs.${tab}`)}
							{count !== undefined && (
								<span
									className={cn(
										"min-w-[18px] rounded px-1 py-px text-center text-[10px] font-semibold",
										isFrequent && count > 0
											? "bg-red-bg text-red-t"
											: active === tab
												? "bg-surf-2 text-t-3"
												: "bg-surf-3 text-t-3",
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
