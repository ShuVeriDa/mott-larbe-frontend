"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminTextsStats, AdminTextsTab } from "@/entities/admin-text";

interface TextsTabsProps {
	active: AdminTextsTab;
	stats: AdminTextsStats | undefined;
	onChange: (tab: AdminTextsTab) => void;
}

interface TabDef {
	key: AdminTextsTab;
	labelKey: string;
	count: (s: AdminTextsStats) => number;
}

const TABS: TabDef[] = [
	{ key: "all", labelKey: "admin.texts.tabs.all", count: (s) => s.totalCount },
	{ key: "published", labelKey: "admin.texts.tabs.published", count: (s) => s.publishedCount },
	{ key: "draft", labelKey: "admin.texts.tabs.draft", count: (s) => s.draftCount },
	{ key: "processing", labelKey: "admin.texts.tabs.processing", count: (s) => s.processingCount },
	{ key: "error", labelKey: "admin.texts.tabs.error", count: (s) => s.errorCount },
];

export const TextsTabs = ({ active, stats, onChange }: TextsTabsProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-3.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit rounded-[9px] bg-surf-2 p-[3px]">
				{TABS.map(({ key, labelKey, count }) => {
					const isActive = active === key;
					const cnt = stats ? count(stats) : undefined;

										const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(key);
return (
						<Button
							key={key}
							onClick={handleClick}
							className={cn(
								"flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 py-1 text-[12px] font-medium transition-colors",
								isActive
									? "bg-surf text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
									: "text-t-3 hover:text-t-2",
							)}
						>
							{t(labelKey)}
							{cnt !== undefined && (
								<Typography tag="span"
									className={cn(
										"rounded px-1.5 py-px text-[10px] font-semibold",
										isActive ? "bg-surf-3 text-t-2" : "bg-surf-3 text-t-3",
									)}
								>
									{cnt}
								</Typography>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	);
};
