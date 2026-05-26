"use client";

import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { AdminPhrasebookTab } from "../model/types";
import { TABS_CONFIG } from "../lib/tabs-config";

interface PhrasebookTabBarProps {
	active: AdminPhrasebookTab;
	categoriesCount: number;
	phrasesTotal: number;
	suggestionsCount: number;
	onChange: (tab: AdminPhrasebookTab) => void;
	t: (key: string) => string;
}

export const PhrasebookTabBar = ({
	active,
	categoriesCount,
	phrasesTotal,
	suggestionsCount,
	onChange,
	t,
}: PhrasebookTabBarProps) => {
	const counts: Record<AdminPhrasebookTab, number> = {
		categories: categoriesCount,
		phrases: phrasesTotal,
		suggestions: suggestionsCount,
	};

	return (
		<div className="mb-3.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit rounded-[9px] bg-surf-2 p-[3px]">
				{TABS_CONFIG.map(({ key, labelKey }) => {
					const isActive = active === key;
					const cnt = counts[key];

					const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(key);

					return (
						<Button
							key={key}
							onClick={handleClick}
							title={t(labelKey)}
							className={cn(
								"flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 py-1 text-[12px] font-medium transition-colors",
								isActive
									? "bg-surf text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
									: "text-t-3 hover:text-t-2",
							)}
						>
							{t(labelKey)}
							<Typography
								tag="span"
								className={cn(
									"rounded px-1.5 py-px text-[10px] font-semibold",
									isActive ? "bg-surf-3 text-t-2" : "bg-surf-3 text-t-3",
								)}
							>
								{cnt}
							</Typography>
						</Button>
					);
				})}
			</div>
		</div>
	);
};
