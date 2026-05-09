"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

export type ProfileTabId = "main" | "security" | "subscription";

export interface ProfileTabsProps {
	active: ProfileTabId;
	onChange: (tab: ProfileTabId) => void;
}

export const ProfileTabs = ({ active, onChange }: ProfileTabsProps) => {
	const { t } = useI18n();

	const tabs: { id: ProfileTabId; label: string }[] = [
		{ id: "main", label: t("profile.tabs.main") },
		{ id: "security", label: t("profile.tabs.security") },
		{ id: "subscription", label: t("profile.tabs.subscription") },
	];

	return (
		<div className="flex gap-px rounded-[9px] bg-surf-3 p-[3px] w-fit max-sm:w-full">
			{tabs.map(({ id, label }) => {
			  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(id);
			  return (
				<Button
					key={id}
					onClick={handleClick}
					className={cn(
						"h-7 px-3.5 rounded-base text-[12.5px] font-medium font-[inherit] cursor-pointer transition-all duration-100 whitespace-nowrap",
						"max-sm:flex-1 max-sm:h-[34px] max-sm:text-[12px] max-sm:px-1.5",
						active === id
							? "bg-surf text-t-1 shadow-sm"
							: "bg-transparent text-t-2 hover:text-t-1",
					)}
				>
					{label}
				</Button>
			);
			})}
		</div>
	);
};
