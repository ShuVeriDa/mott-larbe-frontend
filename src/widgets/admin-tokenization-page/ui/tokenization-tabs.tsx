"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TokenizationStats, TokenizationTab } from "@/entities/token";

interface TokenizationTabsProps {
	activeTab: TokenizationTab;
	stats: TokenizationStats | undefined;
	onChange: (tab: TokenizationTab) => void;
}

const TABS: { key: TokenizationTab; labelKey: string }[] = [
	{ key: "all", labelKey: "admin.tokenization.tabs.all" },
	{ key: "issues", labelKey: "admin.tokenization.tabs.issues" },
	{ key: "notfound", labelKey: "admin.tokenization.tabs.notfound" },
	{ key: "pending", labelKey: "admin.tokenization.tabs.pending" },
];

export const TokenizationTabs = ({ activeTab, stats, onChange }: TokenizationTabsProps) => {
	const { t } = useI18n();

	const counts: Record<TokenizationTab, number | undefined> = {
		all: stats?.tabs.all,
		issues: stats?.tabs.issues,
		notfound: stats?.tabs.notfound,
		pending: stats?.tabs.pending,
	};

	return (
		<div className="mb-3.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0 rounded-[9px] bg-surf-2 p-[3px]">
				{TABS.map(({ key, labelKey }) => {
				  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(key);
				  return (
					<Button
						key={key}
						onClick={handleClick}
						className={cn(
							"flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 py-1 text-[12px] font-medium transition-colors",
							activeTab === key
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2",
						)}
					>
						{t(labelKey)}
						{counts[key] !== undefined && (
							<Typography tag="span"
								className={cn(
									"rounded px-1 py-px text-[10px] font-semibold",
									activeTab === key ? "bg-surf-3 text-t-2" : "bg-surf-3 text-t-3",
								)}
							>
								{counts[key]!.toLocaleString()}
							</Typography>
						)}
					</Button>
				);
				})}
			</div>
		</div>
	);
};
